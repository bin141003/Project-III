# 🛒 WEB Bán đồ công nghệ


## 📌 Introduction

Đây là hệ thống **Bán đồ công nghệ** được xây dựng bằng:

* **Frontend:** ReactJS
* **Backend:** Node.js + Express
* **Database:** MongoDB
* **Payment:** Braintree Sandbox

Các chức năng chính:

* Đăng ký / Đăng nhập
* Xem danh sách sản phẩm
* Xem chi tiết sản phẩm
* Thêm vào giỏ hàng
* Thanh toán online (Braintree)
* Quản lý sản phẩm (Admin)

---

## ⚙️ Prerequisites

Cài đặt trước:

* Node.js (Node 16 hoặc 18)
* MongoDB (local hoặc MongoDB Atlas)
* NPM hoặc Yarn

Kiểm tra:

```bash
node -v
npm -v
```

---

## 🔑 Environment Variables (.env)

Tạo file `.env` trong thư mục **server**

```bash
DATABASE=mongodb://127.0.0.1:27017/ecommerce

BRAINTREE_MERCHANT_ID=your_merchant_id
BRAINTREE_PUBLIC_KEY=your_public_key
BRAINTREE_PRIVATE_KEY=your_private_key
```

---

## 🔑 Getting Braintree API Keys

Để bật chức năng thanh toán:

### Các bước:

1. Truy cập:

https://www.braintreepayments.com/

2. Tạo tài khoản Sandbox:

https://sandbox.braintreegateway.com/

3. Sau khi login:

```
Account → Settings → API → API Keys
```

4. Copy:

* Merchant ID
* Public Key
* Private Key

5. Dán vào `.env`

Ví dụ:

```bash
BRAINTREE_MERCHANT_ID=abc123
BRAINTREE_PUBLIC_KEY=xyz456
BRAINTREE_PRIVATE_KEY=secret789
```

---

## 📦 Installation

Cài dependencies cho **client**

```bash
cd client
npm install
```

Cài dependencies cho **server**

```bash
cd server
npm install
```

---

## ▶️ Running the Project

### Start backend

```bash
cd server
npm run start:dev
```

---

### Start frontend

Mở terminal mới:

```bash
cd client
npm run start
```

---

### Truy cập:

```
http://localhost:3000
```

---

## ☁️ Deploy Backend to Render

### Bước 1 — Tạo tài khoản Render

https://render.com/

---

### Bước 2 — Kết nối GitHub

Cho phép Render truy cập repo.

---

### Bước 3 — Tạo Web Service

Chọn repo của bạn.

---

### Bước 4 — Sử dụng MongoDB Atlas

Lấy MongoDB URL dạng:

```bash
mongodb+srv://username:password@cluster.mongodb.net/ecommerce
```

Thay vào `.env`:

```bash
DATABASE=mongodb+srv://username:password@cluster.mongodb.net/ecommerce
```

---

### Bước 5 — Deploy

Render sẽ tự build và chạy server.

---

## 🌐 Deploy Frontend

Bạn có thể dùng:

* Vercel
* Netlify

---

## 📁 Project Structure

```
project-root/
│
├── client/        # React frontend
│
├── server/        # Node.js backend
│
├── README.md
│
└── .gitignore
```

---

## 👨‍💻 Author

**Name:** Trịnh Văn Bin
**Student ID:** 20215530

---
