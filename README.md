# MediLink+ Wellbeing Integrated System

A scalable, modular, role-based web application designed for rural healthcare kiosk-to-chemist medicine distribution, integrated with health tracking features.

## 🚀 Features

- **Auth Module**: Secure role-based login (Kiosk, Chemist, Admin) with JWT.
- **Kiosk Module**: Prescription upload, medicine search, and wellbeing tracking.
- **Chemist Module**: Order fulfillment, inventory management, and store verification.
- **Admin Module**: User approvals, system analytics, and global database control.
- **Wellbeing Integration**: BMI tracking and health biometrics for village patients (merged from Wellbeing-app).

## 🛠 Tech Stack

- **Frontend**: React.js, Tailwind CSS, Lucide Icons, Axios, React Router.
- **Backend**: Node.js, Express.js, MongoDB (Mongoose), Multer, JWT, Bcrypt.

## 📂 Project Structure

```text
/client                 # React frontend
  /src/components       # Reusable UI components
  /src/pages           # Dashboard & Auth pages
  /src/context         # Auth State management
/server                 # Express backend
  /models               # Mongoose schemas
  /controllers          # API logic
  /routes               # API endpoints
  /middleware           # Auth & Upload guards
  /uploads              # Prescription storage
```

## ⚙️ Setup Instructions

### 1. Backend Setup
1. Navigate to `/server`.
2. Install dependencies: `npm install`.
3. Create a `.env` file based on `.env.example`:
   ```bash
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/medilink
   JWT_SECRET=your_secret_key
   ```
4. Seed the database (Optional): `node seed.js`.
5. Start the server: `npm run dev`.

### 2. Frontend Setup
1. Navigate to `/client`.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.
4. Open `http://localhost:5173` in your browser.

## 🧪 Credentials for Testing (after seeding)

- **Admin**: `admin@medilink.com` / `password123`
- **Chemist**: `chemist@citypharma.com` / `password123`
- **Kiosk**: `kiosk@village1.com` / `password123`

## 🛡 Security Features

- Encrypted passwords using Bcrypt.
- Protected API routes via JWT Middleware.
- Role-specific access control (Kiosk cannot access Admin panels).
- Secure file upload validation for PDF/Images.
