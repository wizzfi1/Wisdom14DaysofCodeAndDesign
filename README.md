# 💼 Wisdom Job Board API

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-ORM-2F4068?logo=sequelize&logoColor=white)](https://sequelize.org/)

A secure and extensible Job Board API with role-based access, resume uploads, and application tracking, built with **Node.js**, **PostgreSQL**, **Express**, and **Sequelize**.

---

## 🚀 Features

### 🔐 Authentication & Roles
- JWT-based registration & login  
- Roles: `applicant`, `employer`, `admin`  
- Role-based access control  

### 💼 Job Management
- **Employers** can:
  - Create, update, delete job postings  
  - View applicants for their jobs  
- **Public** users can:
  - Browse all jobs  
  - View job details  

### 📄 Resume Upload & Applications
- **Applicants** can:
  - Apply to jobs with a **required resume** and optional cover letter  
  - View their submitted applications with statuses  
- **Employers** can:
  - View all applicants for their jobs with resume metadata  

### 📊 Application Tracking System (ATS)
- Applications have `status`: `pending`, `shortlisted`, `rejected`  
- Applicants can track their application statuses  
- Employers can filter by applicant status  

---

## 📁 Project Structure

```text
src/
├── config/          # DB setup (Sequelize + PostgreSQL)
├── controllers/     # Auth, job, application logic
├── middleware/      # Authentication & authorization
├── models/          # Sequelize models (User, Job, Application)
├── routes/          # API endpoints
├── uploads/         # Stored resumes & cover letters
└── server.js        # Application entrypoint



---

## ⚙️ Setup & Run

```bash
# Install dependencies
npm install

# Create .env from template
cp .env.example .env
# Edit .env with your DB credentials, JWT_SECRET, etc.

# Run migrations
npx sequelize-cli db:migrate

# Start dev server
npm run dev

📌 API Overview

### Auth Routes

| Method | Endpoint             | Access | Description         |
| ------ | -------------------- | ------ | ------------------- |
| POST   | `/api/auth/register` | Public | Register a new user |
| POST   | `/api/auth/login`    | Public | Login & receive JWT |


Job Routes

| Method | Endpoint        | Access   | Description          |
| ------ | --------------- | -------- | -------------------- |
| GET    | `/api/jobs`     | Public   | List all jobs        |
| GET    | `/api/jobs/:id` | Public   | View a single job    |
| POST   | `/api/jobs`     | Employer | Create a job posting |
| PUT    | `/api/jobs/:id` | Employer | Update a job         |
| DELETE | `/api/jobs/:id` | Employer | Delete a job         |

Application Routes

| Method | Endpoint                        | Access    | Description                            |
| ------ | ------------------------------- | --------- | -------------------------------------- |
| POST   | `/api/apply/:jobId`             | Applicant | Apply to a job with file upload        |
| GET    | `/api/my-applications`          | Applicant | View submitted applications & statuses |
| GET    | `/api/jobs/:jobId/applications` | Employer  | View applicants for a job              |


📦 File Uploads with Multer

Supported file types: .pdf, .doc, .docx

Size limit: 5 MB

Stored under:

-uploads/resumes/

-uploads/coverLetters/

📄 Sample Usage (using cURL)

🔐 Register User

curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Wisdom","email":"user@example.com","password":"Wisdomwise1!","role":"applicant"}'

📄 Apply to a Job

curl -X POST http://localhost:3001/api/apply/1 \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -F "resume=@./uploads/resumes/sample_resume.pdf" \
  -F "coverLetter=@./uploads/coverLetters/sample_cover.docx"

🧪 Testing Tips

-Use Postman, Insomnia, or curl to test endpoints

-Decode JWTs with jwt.io

-Test role-based flows using applicant and employer accounts

🧠 Skills Demonstrated

-REST API implementation

-JWT authentication and middleware

-Role-based authorization

-File uploads using Multer

-Sequelize ORM with migrations

-PostgreSQL schema design

-Basic ATS workflows (pending, shortlisted, rejected)

