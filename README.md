# Job Board API

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)

A secure job board API with role-based authentication and CRUD operations for job postings, built with Node.js and PostgreSQL.

## Features

🔐 **Authentication**
- JWT-based user registration/login
- Role-based access control (employer/applicant)

💼 **Job Management**
- Create/edit/delete jobs (employers only)
- Browse all jobs (public)
- View job details (public)

🗃️ **Database**
- PostgreSQL relational database
- Secure password hashing
- Data validation

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL 15+
- npm 9+

### Installation
```bash
# Clone repository
git clone https://github.com/yourusername/job-board-api.git
cd job-board-api

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Start development server
npm run dev


API Documentation

Authentication

Method	Endpoint	Description

POST	/api/auth/register	Register new user
POST	/api/auth/login	Login to get JWT token

Jobs

Method	Endpoint	Description	Access
GET	/api/jobs	Get all jobs	Public
GET	/api/jobs/:id	Get single job	Public
POST	/api/jobs	Create new job	Employer only
PUT	/api/jobs/:id	Update job	Owner only
DELETE	/api/jobs/:id	Delete job	Owner only


Example Requests

Register User:

curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "employer@example.com",
    "password": "secure123",
    "role": "employer"
  }'

Create Job (Authenticated):

curl -X POST http://localhost:3000/api/jobs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Senior Developer",
    "description": "Node.js expert needed",
    "salary": 90000,
    "company": "Tech Corp",
    "location": "remote"
  }'


Database Schema

Users Table:

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(100) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('employer', 'applicant'))
);

Jobs Table:

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  salary NUMERIC NOT NULL,
  company VARCHAR(100) NOT NULL,
  location VARCHAR(50) NOT NULL CHECK (location IN ('remote', 'onsite', 'hybrid')),
  employer_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

Project Structure

src/
├── config/        # Database configuration
├── controllers/   # Business logic
├── middleware/    # Authentication
├── models/        # Database models
├── routes/        # API endpoints
└── server.js      # Application entry point

🔧 Troubleshooting

Common Issues:

Database connection:

psql -U your_db_user -d your_db_name -c "SELECT * FROM users;"

JWT errors:

Verify token in jwt.io

Check secret in .env
