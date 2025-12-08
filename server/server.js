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