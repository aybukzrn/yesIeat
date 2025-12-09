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
      category: p.CATEGORY?.categoryName || '',
    }));

    res.json(items);
  } catch (err) {
    console.error('Menu getirme hatası:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});