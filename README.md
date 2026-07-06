# ShopEZ E-Commerce Application

ShopEZ is a full-stack e-commerce web application featuring a React-based frontend powered by Vite and a robust Node.js/Express backend integrated with MongoDB. The application provides an interactive customer experience along with a fully functional admin dashboard for inventory and platform administration.

---

## 🚀 Key Features

### **Customer Portal**
- **Authentication**: Email/Password register & login with JWT-based protection.
- **Home & Banners**: Responsive homepage featuring dynamic sliding promo banners.
- **Product Exploration**: Search, filter by categories, view detailed product pages with image galleries and availability tags.
- **Interactive Cart**: Real-time cart calculations (subtotals, shipping, final pricing).
- **Checkout & Orders**: Secure checkout forms and complete tracking of past and current orders.
- **Profile Management**: Personal details, shipping address, and password updates.

### **Admin Dashboard**
- **Overview Metrics**: Total sales, overall orders, total users, and product count.
- **Product Management**: Create, update, view, and delete products (fields: name, description, price, categories, image URLs, stock status).
- **Category Management**: Edit, structure, and create custom product categories.
- **Banner Configuration**: Upload/link promotional banners for the front-page carousel.
- **Order Control**: Manage order statuses (e.g., Pending, Shipped, Delivered) and view customer transaction details.

---

## 🛠️ Technology Stack

### **Frontend**
- **React 19**
- **Vite** (Next-gen frontend tooling)
- **React Router Dom 7** (Declarative routing)
- **Axios** (HTTP client)
- **Vanilla CSS** (Custom, highly optimized stylesheets)

### **Backend**
- **Node.js** & **Express**
- **MongoDB** (Object data modeling via **Mongoose**)
- **JSON Web Tokens (JWT)** (Session authentication)
- **Bcrypt.js** (Secure password hashing)
- **Cors** & **Dotenv**

---

## 📂 Project Structure

```text
ShopEZ  E-commerce Application/
├── client/                     # Frontend Application (React + Vite)
│   ├── public/                 # Static assets
│   ├── src/
│   │   ├── assets/             # Images & static assets
│   │   ├── components/         # Reusable layouts (Navbar, Footer, ProtectedRoute)
│   │   ├── context/            # Global state (AuthContext, CartContext)
│   │   ├── pages/              # Views (Home, Login, AdminDashboard, etc.)
│   │   ├── App.jsx             # Root React App component and Router routes
│   │   ├── index.css           # Global core design tokens & styles
│   │   └── main.jsx            # Application entrypoint
│   └── package.json            # Client dependencies
│
└── server/                     # Backend API (Express + MongoDB)
    ├── config/                 # Database connection configurations
    ├── controllers/            # Controller logic for all API routes
    ├── middleware/             # Request interceptors (Auth validation, Admin checks)
    ├── models/                 # Mongoose schemas (User, Product, Category, Order, Cart, Admin)
    ├── routes/                 # Express route definitions
    ├── .env                    # Environment credentials (Git-ignored)
    ├── server.js               # Express server entry point
    └── package.json            # Server dependencies
```

---

## ⚙️ Setup and Installation

### **Prerequisites**
- Node.js (version 18 or above recommended)
- MongoDB (Local installation or MongoDB Atlas URI)

### **1. Clone the repository**
```bash
git clone <repository-url>
cd "ShopEZ  E-commerce Application"
```

### **2. Setup Backend Server**
1. Navigate to the `server/` directory:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure environment variables. Create a `.env` file inside the `server/` directory with the following variables:
   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_uri
   JWT_SECRET=your_jwt_secret_key
   ```
4. Start the backend development server:
   ```bash
   npm run dev
   ```
   *The server will start running on [http://localhost:5000](http://localhost:5000).*

### **3. Setup Frontend Client**
1. Navigate to the `client/` directory:
   ```bash
   cd ../client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the client development server:
   ```bash
   npm run dev
   ```
   *The web application will open automatically, or you can access it at [http://localhost:5173](http://localhost:5173).*

---

## 🔑 Default Accounts (For Testing)
Ask the system administrator for predefined user/admin test credentials or register as a new client through the Signup page.
