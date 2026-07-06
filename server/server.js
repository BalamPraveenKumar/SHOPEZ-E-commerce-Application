require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');

// Import routes
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const cartRoutes = require('./routes/cartRoutes');
const orderRoutes = require('./routes/orderRoutes');

// Import models for seeding
const Admin = require('./models/Admin');
const Product = require('./models/Product');
const Category = require('./models/Category');
const Banner = require('./models/Banner');

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
  seedAdminAndData();
});

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// API Routes mounting
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'SHOPEZ E-Commerce API is running smoothly' });
});

// Centralized error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error details:', err.stack);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error'
  });
});

// Seed default Admin and sample products/categories if collection is empty
async function seedAdminAndData() {
  try {
    // 1. Seed Admin
    const adminCount = await Admin.countDocuments({});
    if (adminCount === 0) {
      console.log('Seeding default Admin user...');
      await Admin.create({
        username: 'admin',
        password: 'adminpassword123' // Plain password, will be hashed by pre-save hook
      });
      console.log('Default Admin seeded successfully (admin / adminpassword123)');
    }

    // 2. Seed Categories
    const categoryCount = await Category.countDocuments({});
    if (categoryCount === 0) {
      console.log('Seeding default categories...');
      await Category.insertMany([
        { categoryName: 'Apparel', image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80' },
        { categoryName: 'Footwear', image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=400&q=80' },
        { categoryName: 'Accessories', image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=400&q=80' }
      ]);
      console.log('Default categories seeded successfully.');
    }

    // 3. Seed Banners
    const bannerCount = await Banner.countDocuments({});
    if (bannerCount === 0) {
      console.log('Seeding default banners...');
      await Banner.insertMany([
        { title: 'Summer Collection 2026', image: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80' },
        { title: 'Exclusive Activewear Sale', image: 'https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1200&q=80' }
      ]);
      console.log('Default banners seeded successfully.');
    }

    // 4. Seed Products
    // Clean up any invalid products (no image, empty image, or image not starting with http/https) from database
    console.log('Cleaning up products with invalid image URLs...');
    await Product.deleteMany({
      $or: [
        { mainImg: { $exists: false } },
        { mainImg: null },
        { mainImg: '' },
        { mainImg: { $not: /^https?:\/\// } }
      ]
    });

    await Product.deleteMany({});
    console.log('Seeding sample products (200+)...');

    const apparelImages = [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539109136881-3be0616acf4b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1539185441755-769473a23570?w=600&auto=format&fit=crop&q=80'
    ];

    const footwearImages = [
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600&auto=format&fit=crop&q=80'
    ];

    const accessoriesImages = [
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1575413558062-ee1c8a94be5b?w=600&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&auto=format&fit=crop&q=80'
    ];

    const productsToInsert = [];
    const categoriesList = ['Apparel', 'Footwear', 'Accessories'];
    const gendersList = ['men', 'women', 'unisex', 'kids'];
    const adjectivesList = ['Premium', 'Classic', 'Retro', 'Vintage', 'Modern', 'Slim Fit', 'Cozy', 'Activewear', 'Athletic', 'Casual'];
    const colorsList = ['Black', 'Blue', 'White', 'Red', 'Gray', 'Brown', 'Green', 'Yellow', 'Pink', 'Orange'];

    const itemNamesList = {
      'Apparel': ['Hoodie', 'Denim Jacket', 'Summer Dress', 'Gym T-Shirt', 'Running Shorts', 'Cotton Chinos', 'Winter Overcoat', 'Cargo Pants'],
      'Footwear': ['Running Shoes', 'High-Top Sneakers', 'Leather Boots', 'Walking Loafers', 'Training Trainers', 'Sport Sandals'],
      'Accessories': ['Minimalist Watch', 'Travel Backpack', 'Sports Sunglasses', 'Knit Scarf', 'Fitness Band', 'Leather Wallet', 'Woolen Beanie']
    };

    const imageMapList = {
      'Apparel': apparelImages,
      'Footwear': footwearImages,
      'Accessories': accessoriesImages
    };

    const sizeMapList = {
      'Apparel': ['S', 'M', 'L', 'XL'],
      'Footwear': ['6', '7', '8', '9', '10'],
      'Accessories': ['Free Size']
    };

    // Generate 70 items per category to create a total of 210 products
    for (const cat of categoriesList) {
      const imgs = imageMapList[cat];
      const names = itemNamesList[cat];
      const sizes = sizeMapList[cat];

      for (let i = 1; i <= 70; i++) {
        const adj = adjectivesList[i % adjectivesList.length];
        const color = colorsList[i % colorsList.length];
        const name = names[i % names.length];
        const title = `${adj} ${color} ${name} v${i}`;
        const mainImg = imgs[i % imgs.length];
        const gender = gendersList[i % gendersList.length];
        const price = Math.round(399 + (i * 35) + (i % 3) * 110);
        const discount = i % 5 === 0 ? 10 : (i % 7 === 0 ? 15 : (i % 9 === 0 ? 25 : 0));
        
        productsToInsert.push({
          title,
          description: `This high-quality ${title} is designed with premium fabrics and modern cuts. Featuring extreme durability, ultimate comfort, and a contemporary aesthetic suitable for active or casual lifestyles.`,
          mainImg,
          carousel: [mainImg],
          category: cat,
          gender,
          sizes,
          price,
          discount
        });
      }
    }

    await Product.insertMany(productsToInsert);
    console.log('Sample products seeded successfully (210 products).');
  } catch (error) {
    console.error('Error seeding data:', error);
  }
}

// Start Server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
