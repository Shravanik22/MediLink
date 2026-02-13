# MediLink + Wellbeing Integrated System (v2.0)
## Rural Healthcare Ecosystem Master Build

MediLink is a production-ready MERN stack application designed to bridge the healthcare gap in rural areas by integrating pharmacy distribution with patient vital monitoring.

### 🌟 Core Ecosystem Modules

#### **1. Patient Wellbeing (Integrated)**
- **HealthRecord Matrix**: Automated BMI calculation, Sugar/BP tracking, and heart rate monitoring.
- **Risk Detection**: Automatic "Epidemiological Flags" (Normal/High Risk) based on biometric data.
- **History Visualizer**: Historical trend charts for patients and population analytics for admins.

#### **2. Kiosk Terminal (Village Interface)**
- **Prescription Digilization**: Secure OCR-style upload (Image/PDF) with visual confirmation.
- **Pharmacy Marketplace**: Real-time search across verified chemists with cost comparison and rating selection.
- **Emergency Priority**: 15-minute dispatch timer for critical medication requests.
- **Order Tracking**: Comprehensive lifecycle (Pending → Delivered) with digital invoice downloads.

#### **3. Chemist Command Center**
- **Smart Queue**: Priority-based order management (Emergency orders always on top).
- **Inventory Vault**: Soft-deletion, low-stock alerts, and batch/expiry monitoring.
- **Generic Suggestions**: Proactively suggest generic alternatives during verification.
- **Revenue Analytics**: Daily/Monthly sales reports with most-sold medicine performance.

#### **4. Admin Master Console**
- **Node Verification**: Secure approval/blocking of pharmacy nodes and village kiosks.
- **Financial Intelligence**: Cross-network revenue trends and growth analytics.
- **Population Health**: Anonymized epidemiological charts showing regional health risks.
- **System Integrity**: Centralized complaint resolution and security monitoring.

### 🛡 Security & Hardening
- **JWT Auth**: Role-based access control (RBAC).
- **API Protection**: Rate limiting, Helmet headers, and Winston persistent logging.
- **Validation**: Strict Joi schema enforcement for all data entries.

### 🚀 Technical Stack
- **Frontend**: React (Vite), Tailwind CSS, Framer Motion, Recharts, Lucide Icons.
- **Backend**: Node.js, Express, MongoDB/Mongoose.
- **Real-time**: Socket.io for instant order/emergency notifications.
- **Files**: Multer for encrypted prescription storage.

### 📦 Installation
```bash
# Server
cd server
npm install
npm run dev

# Client
cd client
npm install
npm run dev
```

### 📂 Directory Structure
- `/server/models`: Consolidated User, Medicine, Order, HealthRecord, etc.
- `/server/controllers`: Logic isolation for Health, Sales, and Master Control.
- `/client/src/pages`: Premium role-specific dashboards.
- `/client/src/components`: Reusable UI modules (WellbeingTracker, StatCards).

---
*Created for Regional Healthcare Deployment.*
