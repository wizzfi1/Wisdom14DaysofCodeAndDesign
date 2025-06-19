# 🚀 File Upload API with Node.js & PostgreSQL

<div align="center">
  <img src="https://img.shields.io/badge/Node.js-18+-339933?logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white" alt="Express">
  <img src="https://img.shields.io/badge/PostgreSQL-15+-4169E1?logo=postgresql&logoColor=white" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/JWT-Auth-000000?logo=json-web-tokens" alt="JWT">
</div>

A secure backend API for handling file uploads with authentication and role-based access control.

## ✨ Features

| Feature | Description |
|---------|-------------|
| 🔐 Authentication | JWT-based register/login system |
| 📁 File Handling | Upload single/multiple files with Multer |
| 👥 User Roles | User and Admin role differentiation |
| 🛡️ Security | Password hashing with bcryptjs |
| 💾 Database | PostgreSQL for data persistence |

## 🛠️ Installation

# Install dependencies
npm install

🌐 API Reference
Authentication

POST /api/auth/register

POST /api/auth/login

File Operations

POST /api/upload

GET /api/files

## 📁 Project Structure

```
wisdom-upload-api/
│
├── src/
│   │
│   ├── config/        » Database configuration
│   ├── controllers/   » Business logic
│   ├── middleware/    » Authentication
│   ├── models/        » Data models
│   ├── routes/        » API endpoints
│   ├── app.js         » Express configuration
│   └── server.js      » Server entry point
│
├── uploads/           ▼ File storage
├── .env.example       ▼ Environment template
└── package.json       ▼ Dependencies
```


💻 Development

# Run in development mode (with auto-restart)
npm run dev

# Run in production mode
npm start

# Format code
npm run format
🤝 Contributing
Fork the project

Create your feature branch (git checkout -b feature/AmazingFeature)

Commit your changes (git commit -m 'Add amazing feature')

Push to the branch (git push origin feature/AmazingFeature)

Open a Pull Request

# Configure environment
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev
