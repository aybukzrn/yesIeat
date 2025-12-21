import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import pkg from '@prisma/client';
const { PrismaClient } = pkg;

dotenv.config();

const prisma = new PrismaClient();

const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API is running');
});

//admin login
app.post('/api/admin/login', async (req, res) => {
  try {
    const { ownername, password } = req.body;

    if (!ownername || !password) {
      return res.status(400).json({ success: false, message: 'Kullanıcı adı ve şifre gereklidir.'});
    }

    const admin =  await prisma.OWNER.findFirst({
      where: {
        oName: ownername,
        oPassword: password,
      },
    });

    if (!admin) {
      return res.status(401).json({ success: false, message: 'Kullanıcı adı veya şifre hatalı.'});
    }
    return res.json({
      success: true,
      admin: {
        name: admin.oName,
      },
    });
  } catch (err) {
    console.error('Admin giriş hatası:', err);
    return res.status(500).json({success: false, message: 'Sunucu hatası.'});
  }
});

// Customer Login
app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'E-Posta ve şifre gereklidir.'});
  }
    const user =  await prisma.USERS.findFirst({
      where: {
        uMail: email,
        uPassword: password,
      },
    });

    if (!user) {
      return res.status(401).json({ success: false, message: 'E-Posta veya şifre hatalı.'});
    }
    return res.json({
      success: true,
      user: {
        id:user.uID,
        name: user.uName,
        surname: user.uSurname,
        email: user.uMail,
        phone: user.uPhnNum,
      },
    });
  } catch (err) {
    console.error('Giriş hatası:', err);
    return res.status(500).json({success: false, message: 'Sunucu hatası.'});
  }

  sessionStorage.setItem('userLoggedIn', 'true');
});

//Customer Register
app.post('/api/register', async (req, res) => {
  try {
    const { email, password, name, surname, phone } = req.body;

    if (!email || !password || !name || !surname) {
      return res.status(400).json({success: false, message: 'Tüm alanları doldurunuz.'});
    }

    const existing = await prisma.USERS.findFirst({
      where: {uMail: email},
    });

    if (existing) {
      return res
      .status(409)
      .json({success: false, message: 'Bu E-Posta adresi zaten kullanılmaktadır.'});
    }

    const user = await prisma.USERS.create({
      data: {
        uMail: email,
        uPassword: password,
        uName: name,
        uSurname: surname,
        uPhnNum: phone || null,
      },
    });

    return res.status(201).json({
      success: true,
      user: {
        id: user.uID,
        name: user.uName,
        surname: user.uSurname,
        email: user.uMail,
        phone: user.uPhnNum,
      },
    });
  } catch (err) {
    console.error('Kayıt hatası:', err);
    return res.status(500).json({success: false, message: 'Sunucu hatası.'});
  }
});

// Menü listesi
app.get('/api/menu', async (req, res) => {
  try {
    const products = await prisma.PRODUCT.findMany({
      include: { CATEGORY: true },
    });

    const items = products.map((p) => ({
      id: p.prodID,
      name: p.prodName,
      price: p.prodUnitPrice,
      desc: p.prodDesc,
      tag: p.prodLabel || '',
      photo: p.prodPhoto || '',
      stock: p.prodStock || 0,
      category: p.CATEGORY?.categoryName || '',
    }));

    res.json(items);
  } catch (err) {
    console.error('Menu getirme hatası:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Kullanıcı Siparişlerini Getir
app.get('/api/orders', async (req, res) => {
  try {
    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Kullanıcı ID gereklidir.' 
      });
    }

    const orders = await prisma.ORDERS.findMany({
      where: {
        uID: parseInt(userId),
      },
      include: {
        ORDER_DETAIL: {
          include: {
            PRODUCT: true,
          },
        },
        ADDRESS: true,
        PAYMENT: true,
        USERS: {
          select: {
            uName: true,
            uSurname: true,
          },
        },
      },
      orderBy: {
        orderDate: 'desc',
      },
    });

    // Status mapping: pending -> Hazırlanıyor, confirmed -> Hazırlanıyor, delivered -> Teslim Edildi, canceled -> İptal Edildi
    const statusMap = {
      pending: 'Hazırlanıyor',
      confirmed: 'Hazırlanıyor',
      delivered: 'Teslim Edildi',
      canceled: 'İptal Edildi',
    };

    // Tarih formatlama fonksiyonu
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      const months = [
        'Ocak', 'Şubat', 'Mart', 'Nisan', 'Mayıs', 'Haziran',
        'Temmuz', 'Ağustos', 'Eylül', 'Ekim', 'Kasım', 'Aralık'
      ];
      return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
    };

    // Saat formatlama fonksiyonu
    const formatTime = (timeValue) => {
      if (!timeValue) return '';
      
      let time;
      if (timeValue instanceof Date) {
        time = timeValue;
      } else if (typeof timeValue === 'string') {
        // String formatından parse et (HH:MM:SS veya HH:MM)
        const timeStr = timeValue.includes('T') ? timeValue.split('T')[1] : timeValue;
        time = new Date(`2000-01-01T${timeStr}`);
      } else {
        return '';
      }
      
      return `${time.getHours().toString().padStart(2, '0')}.${time.getMinutes().toString().padStart(2, '0')}`;
    };

    const formattedOrders = orders.map((order) => {
      const items = order.ORDER_DETAIL.map((detail) => detail.PRODUCT.prodName);
      const payment = order.PAYMENT[0]; // İlk ödeme yöntemini al
      const address = order.ADDRESS;

      return {
        id: order.orderID,
        date: formatDate(order.orderDate),
        time: formatTime(order.orderTime),
        total: order.subTotal,
        status: statusMap[order.orderStatus] || order.orderStatus,
        items: items,
        // Detaylar için ekstra bilgiler
        customerName: `${order.USERS.uName} ${order.USERS.uSurname}`,
        address: address ? address.fullAddress : 'Adres bilgisi bulunamadı',
        paymentMethod: payment ? payment.paymentMethod : 'Ödeme bilgisi bulunamadı',
        orderDetails: order.ORDER_DETAIL.map((detail) => ({
          productName: detail.PRODUCT.prodName,
          quantity: detail.oQuantity,
          unitPrice: detail.prodUnitPrice,
        })),
      };
    });

    return res.json({
      success: true,
      orders: formattedOrders,
    });
  } catch (err) {
    console.error('Sipariş getirme hatası:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Siparişler getirilirken bir hata oluştu.' 
    });
  }
});

// Sipariş Oluşturma
app.post('/api/orders', async (req, res) => {
  try {
    const { 
      userId, 
      address, 
      cartItems, 
      paymentMethod, 
      deliveryType, 
      tip, 
      deliveryNote,
      subTotal 
    } = req.body;

    if (!userId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Kullanıcı ID gereklidir.' 
      });
    }

    if (!address || !address.fullAddress) {
      return res.status(400).json({ 
        success: false, 
        message: 'Adres bilgisi gereklidir.' 
      });
    }

    if (!cartItems || !Array.isArray(cartItems) || cartItems.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Sepet boş olamaz. Lütfen sepete ürün ekleyin.' 
      });
    }

    // Adresi oluştur veya mevcut adresi bul
    let addressRecord = await prisma.ADDRESS.findFirst({
      where: {
        uID: parseInt(userId),
        fullAddress: address.fullAddress || address,
      },
    });

    if (!addressRecord) {
      // Yeni adres oluştur
      addressRecord = await prisma.ADDRESS.create({
        data: {
          uID: parseInt(userId),
          addressTitle: address.addressTitle || 'Teslimat Adresi',
          fullAddress: address.fullAddress || address,
          flatNum: address.flatNum || null,
          floorNum: address.floorNum || null,
          aptNum: address.aptNum || null,
        },
      });
    }

    const now = new Date();
    const orderDate = now;
    const orderTime = now;

    // Sipariş oluştur
    const newOrder = await prisma.ORDERS.create({
      data: {
        uID: parseInt(userId),
        orderDate: orderDate,
        orderTime: orderTime,
        orderStatus: 'pending',
        addressID: addressRecord.addressID,
        subTotal: parseFloat(subTotal) || 0,
      },
    });

    // Sipariş detaylarını oluştur
    for (const item of cartItems) {
      const productId = parseInt(item.id);
      const quantity = parseInt(item.quantity);
      const price = parseFloat(item.price);

      if (!productId || isNaN(productId)) {
        throw new Error(`Geçersiz ürün ID: ${item.id}`);
      }

      if (!quantity || quantity <= 0 || isNaN(quantity)) {
        throw new Error(`Geçersiz miktar: ${item.quantity}`);
      }

      if (!price || price <= 0 || isNaN(price)) {
        throw new Error(`Geçersiz fiyat: ${item.price}`);
      }

      // Ürünün var olup olmadığını kontrol et
      const product = await prisma.PRODUCT.findUnique({
        where: { prodID: productId },
      });

      if (!product) {
        throw new Error(`Ürün bulunamadı: ${item.name || item.id}`);
      }

      await prisma.ORDER_DETAIL.create({
        data: {
          orderID: newOrder.orderID,
          prodID: productId,
          oQuantity: quantity,
          oPriority: deliveryType || 'standart',
          deliveryNote: deliveryNote || null,
          prodUnitPrice: price,
        },
      });
    }

    // Ödeme kaydı oluştur
    const paymentMethodText = paymentMethod === 'kapida' ? 'Kapıda Ödeme' : 
                              paymentMethod === 'kart' ? 'Kredi Kartı' : 
                              'Bilinmeyen';
    
    await prisma.PAYMENT.create({
      data: {
        uID: parseInt(userId),
        orderID: newOrder.orderID,
        paymentMethod: paymentMethodText,
        paymentDate: now,
        amount: parseFloat(subTotal) || 0,
      },
    });

    return res.status(201).json({
      success: true,
      message: 'Sipariş başarıyla oluşturuldu.',
      order: {
        id: newOrder.orderID,
        orderDate: newOrder.orderDate,
        total: newOrder.subTotal,
      },
    });
  } catch (err) {
    console.error('Sipariş oluşturma hatası:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Sipariş oluşturulurken bir hata oluştu.' 
    });
  }
});

// Admin - Tüm Siparişleri Getir
app.get('/api/admin/orders', async (req, res) => {
  try {
    const orders = await prisma.ORDERS.findMany({
      include: {
        ORDER_DETAIL: {
          include: {
            PRODUCT: true,
          },
        },
        ADDRESS: true,
        PAYMENT: true,
        USERS: {
          select: {
            uName: true,
            uSurname: true,
          },
        },
      },
      orderBy: {
        orderDate: 'desc',
      },
    });

    // Status mapping
    const statusMap = {
      pending: 'Beklemede',
      confirmed: 'Hazırlanıyor',
      delivered: 'Teslim Edildi',
      canceled: 'İptal Edildi',
    };

    // Tarih formatlama
    const formatDate = (dateString) => {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}.${(date.getMonth() + 1).toString().padStart(2, '0')}.${date.getFullYear()}`;
    };

    const formattedOrders = orders.map((order) => {
      const items = order.ORDER_DETAIL.map((detail) => detail.PRODUCT.prodName);
      const content = items.join(', ');

      // Eğer ORDER_DETAIL'deki oPriority "yolda" ise, durumu "Yolda" olarak göster
      const isOnWay = order.ORDER_DETAIL.some(detail => detail.oPriority === 'yolda');
      let displayStatus = statusMap[order.orderStatus] || order.orderStatus;
      if (isOnWay && order.orderStatus === 'confirmed') {
        displayStatus = 'Yolda';
      }

      return {
        id: order.orderID,
        customer: `${order.USERS.uName} ${order.USERS.uSurname}`,
        content: content,
        date: formatDate(order.orderDate),
        total: order.subTotal,
        status: displayStatus,
        address: order.ADDRESS ? order.ADDRESS.fullAddress : 'Adres bulunamadı',
        orderDetails: order.ORDER_DETAIL.map((detail) => ({
          productName: detail.PRODUCT.prodName,
          quantity: detail.oQuantity,
          unitPrice: detail.prodUnitPrice,
        })),
        paymentMethod: order.PAYMENT[0] ? order.PAYMENT[0].paymentMethod : 'Bilinmiyor',
      };
    });

    return res.json({
      success: true,
      orders: formattedOrders,
    });
  } catch (err) {
    console.error('Admin sipariş getirme hatası:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Siparişler getirilirken bir hata oluştu.' 
    });
  }
});

// Admin - Sipariş Durumu Güncelleme
app.patch('/api/admin/orders/:orderId/status', async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    // Status mapping (Türkçe'den İngilizce'ye)
    const statusMap = {
      'Beklemede': 'pending',
      'Hazırlanıyor': 'confirmed',
      'Yolda': 'confirmed', // Yolda durumu backend'de confirmed olarak saklanır
      'Teslim Edildi': 'delivered',
      'İptal Edildi': 'canceled',
    };

    const dbStatus = statusMap[status] || status;

    if (!['pending', 'confirmed', 'delivered', 'canceled'].includes(dbStatus)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Geçersiz sipariş durumu.' 
      });
    }

    // Sipariş durumunu güncelle
    const updatedOrder = await prisma.ORDERS.update({
      where: { orderID: parseInt(orderId) },
      data: { orderStatus: dbStatus },
    });

    // Eğer "Yolda" durumuna geçiliyorsa, ORDER_DETAIL'deki oPriority'yi güncelle
    if (status === 'Yolda') {
      await prisma.ORDER_DETAIL.updateMany({
        where: { orderID: parseInt(orderId) },
        data: { oPriority: 'yolda' },
      });
    }

    return res.json({
      success: true,
      message: 'Sipariş durumu güncellendi.',
      order: {
        id: updatedOrder.orderID,
        status: updatedOrder.orderStatus,
      },
    });
  } catch (err) {
    console.error('Sipariş durumu güncelleme hatası:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Sipariş durumu güncellenirken bir hata oluştu.' 
    });
  }
});

// Admin - Yeni Ürün Ekleme
app.post('/api/admin/products', async (req, res) => {
  try {
    const { name, category, price, taxRate, tag, proPhoto, description, stock } = req.body;

    // Validasyon
    if (!name || !price || !category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Ürün adı, fiyat ve kategori gereklidir.' 
      });
    }

    // Kategoriyi bul veya oluştur
    let categoryRecord = await prisma.CATEGORY.findFirst({
      where: { categoryName: category },
    });

    if (!categoryRecord) {
      categoryRecord = await prisma.CATEGORY.create({
        data: { categoryName: category },
      });
    }

    // OWNER kontrolü - default owner varsa kullan, yoksa oluştur
    const defaultOwnerName = process.env.DEFAULT_OWNER_NAME || 'admin';
    let owner = await prisma.OWNER.findUnique({
      where: { oName: defaultOwnerName },
    });

    if (!owner) {
      owner = await prisma.OWNER.create({
        data: {
          oName: defaultOwnerName,
          oPassword: process.env.DEFAULT_OWNER_PASSWORD || 'admin123',
        },
      });
    }

    // Ürünü oluştur
    const newProduct = await prisma.PRODUCT.create({
      data: {
        prodName: name,
        prodUnitPrice: parseFloat(price),
        // Frontend'den gelen stok adedini kaydet
        prodStock: stock ? parseInt(stock, 10) || 0 : 0,
        prodPhoto: proPhoto || '',
        prodLabel: tag || null,
        prodDesc: description || '',
        categoryID: categoryRecord.categoryID,
        oName: owner.oName,
      },
      include: { CATEGORY: true },
    });

    return res.status(201).json({
      success: true,
      product: {
        id: newProduct.prodID,
        name: newProduct.prodName,
        price: newProduct.prodUnitPrice,
        desc: newProduct.prodDesc,
        tag: newProduct.prodLabel || '',
        photo: newProduct.prodPhoto || '',
        category: newProduct.CATEGORY?.categoryName || '',
        stock: newProduct.prodStock,
      },
    });
  } catch (err) {
    console.error('Ürün ekleme hatası:', err);
    return res.status(500).json({ 
      success: false, 
      message: 'Ürün eklenirken bir hata oluştu.' 
    });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});