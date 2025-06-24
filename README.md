# 💼 Wisdom Job Board API

[![Node.js](https://img.shields.io/badge/Node.js-18%2B-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-4.x-000000?logo=express&logoColor=white)](https://expressjs.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15%2B-4169E1?logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Sequelize](https://img.shields.io/badge/Sequelize-ORM-2F4068?logo=sequelize&logoColor=white)](https://sequelize.org/)

A secure and extensible Job Board API with role-based access, resume uploads, and application tracking, built with **Node.js**, **PostgreSQL**, **Express**, and **Sequelize**.

---

## 🚀 Features

### 🔐 Authentication
- JWT-based signup/login
- Role-based access: `applicant`, `employer`, `admin`
- Secure password hashing (bcrypt)

### 💼 Job Management
- Employers can `create`, `edit`, and `delete` jobs
- Public job listings and details
- Association with employers

### 📄 Applications & File Upload
- Applicants can apply to jobs via `/api/apply/:jobId`
- Upload **resume** (required) and **cover letter** (optional)
- Files are validated (`PDF` / `DOC` / `DOCX` only)
- Resume paths stored, along with submission metadata
- Prevents duplicate applications (optional logic)

---

## 🗃️ Database Schema

### Users
```sql
CREATE TYPE enum_users_role AS ENUM ('user', 'employer', 'admin');

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role enum_users_role DEFAULT 'user'
);

Jobs

CREATE TABLE jobs (
  id SERIAL PRIMARY KEY,
  title VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  salary INTEGER,
  company VARCHAR(100),
  location VARCHAR(50),
  jobType VARCHAR(50),
  requirements TEXT,
  status VARCHAR(20) DEFAULT 'active',
  employer_id INTEGER REFERENCES users(id) ON DELETE CASCADE
);

Applications

CREATE TABLE applications (
  id SERIAL PRIMARY KEY,
  applicant_id INTEGER REFERENCES users(id),
  job_id INTEGER REFERENCES jobs(id),
  resume_path VARCHAR(255),
  cover_letter_path VARCHAR(255),
  submitted_at TIMESTAMP
);


🛠️ Installation


# Clone the project
git clone https://github.com/yourusername/job-board-api.git
cd job-board-api

# Install dependencies
npm install

# Setup environment
cp .env.example .env
# 👉 Update DB credentials and JWT_SECRET

# Start dev server
npm run dev


📬 API Endpoints

Authentication

| Method | Endpoint             | Description         |
| ------ | -------------------- | ------------------- |
| POST   | `/api/auth/register` | Register user       |
| POST   | `/api/auth/login`    | Login and get token |


Jobs

| Method | Endpoint        | Description     | Access         |
| ------ | --------------- | --------------- | -------------- |
| GET    | `/api/jobs`     | View all jobs   | Public         |
| GET    | `/api/jobs/:id` | View single job | Public         |
| POST   | `/api/jobs`     | Create new job  | Employer only  |
| PUT    | `/api/jobs/:id` | Update job      | Job owner only |
| DELETE | `/api/jobs/:id` | Delete job      | Job owner only |

Applications

✅ Register (Applicant)

curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "secure123",
    "role": "user"
  }'

✅ Apply to Job with Resume

curl -X POST http://localhost:3001/api/apply/1 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -F "resume=@./uploads/resumes/resume.docx" \
  -F "coverLetter=@./uploads/coverLetters/letter.pdf"

📁 Project Structure

src/
├── config/            # DB config
├── controllers/       # Route handlers
├── middleware/        # Auth / validation
├── models/            # Sequelize models
├── routes/            # API endpoints
├── uploads/           # Resume + coverLetter storage
└── server.js          # API entry point

🧰 Troubleshooting

role enum conflict: Drop conflicting enums manually via psql

curl file error: Ensure correct path + filename

POST /apply/:jobId fails? Ensure the job exists and applicant is authenticated

🔒 Security Notes

All sensitive routes are protected using JWT

Passwords are hashed before DB storage

File uploads are filtered & size-limited
