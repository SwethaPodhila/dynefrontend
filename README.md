⭐ ReviewIQ – Analytics Suite (Frontend)
📌 Project Overview

ReviewIQ is a React-based Product Ratings & Review Analytics Dashboard that visualizes product data using charts, tables, filters, and search functionality.

It helps analyze:

Product performance
Customer ratings
Category-wise insights
Discount distribution
Review trends

This frontend consumes REST APIs built using a Node.js + Express backend with a PostgreSQL/MySQL database.

🚀 Tech Stack
Frontend
React.js
Material UI (MUI)
Axios
Recharts / ApexCharts
📂 Project Structure
src/
│
├── components/
│   ├── Dashboard.jsx
│   ├── ProductsTable.jsx
│   ├── SummaryCard.jsx
│   ├── UploadPage.jsx
│   ├── Layout.jsx
│   ├── NavLink.jsx
│
├── pages/
├── data/
├── App.jsx
├── index.js
├── index.css

✨ Features
📊 Dashboard Analytics
Bar Chart: Products per Category
Bar Chart: Top Reviewed Products
Histogram: Discount Distribution
Bar Chart: Category-wise Average Rating
📦 Data Management
CSV / Excel file upload
Product table with pagination
Dynamic data rendering
🔍 Search & Filters
Search by Product Name
Filter by Category
Filter by Ratings / Reviews
⚡ UI Features
Responsive design using MUI
Loading indicators
Error handling states
Clean and modern dashboard UI
🔗 Backend Integration

This frontend consumes REST APIs from a Node.js + Express backend.

🌐 Base URL
const BASE_URL = "https://dynebackend-production.up.railway.app";
⚙️ Setup Instructions
1️⃣ Install Dependencies
npm install
2️⃣ Run Application
npm start
📡 API Endpoints Used
📥 Upload Data
POST /products/upload
📦 Get Products
GET /products/products
🔍 Search & Filter