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
      category: p.CATEGORY?.categoryName || '',
    }));

    res.json(items);
  } catch (err) {
    console.error('Menu getirme hatası:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// Admin - Yeni Ürün Ekleme
app.post('/api/admin/products', async (req, res) => {
  try {
    const { name, category, price, taxRate, tag, proPhoto, stockStatus, description } = req.body;

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

    // Stok durumunu sayıya çevir
    const stock = stockStatus === 'Stokta Var' ? 10 : 0;

    // Ürünü oluştur
    const newProduct = await prisma.PRODUCT.create({
      data: {
        prodName: name,
        prodUnitPrice: parseFloat(price),
        prodStock: stock,
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