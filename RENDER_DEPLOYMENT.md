# 🚀 Deploying ALTRIX HEALTH to Render with PostgreSQL

This guide provides instructions for deploying **ALTRIX HEALTH — AI Health Intelligence Command Center & Doctor OPD Portal** to **Render** with a **Managed PostgreSQL Database**.

---

## ⚡ Option 1: Automatic 1-Click Blueprint Deploy (Recommended)

Render can automatically provision both your **Node.js Web Service** and **PostgreSQL Database** together using the included [`render.yaml`](./render.yaml).

1. Go to your **[Render Dashboard](https://dashboard.render.com/)**.
2. Click **New +** in the top navigation bar and select **Blueprint**.
3. Connect your GitHub repository:
   ```
   https://github.com/purnasaigarikapati/hosiptalmanagement.git
   ```
4. Render will detect the `render.yaml` file automatically:
   - **Web Service:** `altrix-health` (Free Node.js plan)
   - **Database:** `altrix-health-db` (Free PostgreSQL instance)
   - **Environment Variable:** `DATABASE_URL` linked directly from the database connection string.
   - **Build Command:** `npm install --include=dev && npm run build`
   - **Start Command:** `npm start`
5. Click **Apply**.
6. Render will automatically build the Vite frontend SPA, start the Express backend on port `10000`, run database migrations for all tables (`users`, `medical_records`, `medications`, `ai_insights`, `timeline_events`, `appointments`), and launch your application live!

---

## 🛠 Option 2: Manual Deploy on Render

If you prefer to configure manually step-by-step:

### Step 1: Create a PostgreSQL Database on Render
1. In the Render Dashboard, click **New +** -> **PostgreSQL**.
2. Set configuration:
   - **Name:** `altrix-health-db`
   - **Database:** `altrix_health`
   - **User:** `altrix_admin`
   - **Region:** Oregon (or region closest to you)
   - **Plan:** Free
3. Click **Create Database**.
4. Once created, copy the **Internal Database URL** (e.g. `postgresql://altrix_admin:...@dpg-...-a/altrix_health`).

### Step 2: Create the Web Service
1. In the Render Dashboard, click **New +** -> **Web Service**.
2. Connect your repository: `https://github.com/purnasaigarikapati/hosiptalmanagement.git`.
3. Configure the service:
   - **Name:** `altrix-health`
   - **Region:** Same region as your database (e.g., Oregon)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install --include=dev && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free
4. Add Environment Variables under **Advanced**:
   - `NODE_ENV`: `production`
   - `NPM_CONFIG_PRODUCTION`: `false`
   - `DATABASE_URL`: *(Paste the PostgreSQL connection string from Step 1)*
   - `GEMINI_API_KEY`: *(Optional: Google Gemini API key for live clinical AI Copilot)*
5. Click **Deploy Web Service**.

---

## 🧪 Database Health & Verification

Once deployed on Render, verify your live PostgreSQL database:

- Open your app URL: `https://<your-subdomain>.onrender.com/api/db/status`
- Example Response:
```json
{
  "configured": true,
  "provider": "PostgreSQL (Render Cloud)",
  "status": "Connected",
  "recordCount": 7,
  "appointmentCount": 5,
  "urlConfigured": true
}
```

- Open the health check: `https://<your-subdomain>.onrender.com/api/health`
- Response:
```json
{
  "status": "online",
  "system": "ALTRIX HEALTH — AI Health Intelligence Engine",
  "version": "2.0.0",
  "timestamp": "2026-10-09T16:30:00.000Z"
}
```

---

## 🔐 Doctor Portal Credentials on Render

You can log in to the **Doctor OPD Portal** on Render using these pre-configured accounts:

| Doctor Name | Department & Specialty | Login Email | Password | Staff ID | OPD Cabin |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Dr. Arvind Rao, DM** | Cardiology & Interventional | `dr.arvind@altrixhealth.com` | `Doctor@123` | `DOC-CARDIO-001` | Cabin 304, 3rd Floor |
| **Dr. Ramesh Babu, MD** | Endocrinology & Diabetes | `dr.ramesh@altrixhealth.com` | `Doctor@123` | `DOC-ENDO-004` | Cabin 412, 4th Floor |
| **Dr. Anita Verma, MD** | Clinical Pathology & Lab | `dr.anita@altrixhealth.com` | `Doctor@123` | `DOC-PATH-003` | Room 105, Ground Floor |
| **Dr. Frank Meten, MS, MCh** | Orthopedics & Joint Surgery | `dr.frank@altrixhealth.com` | `Doctor@123` | `DOC-ORTHO-006` | Cabin 502, 5th Floor |
| **Dr. Diana Grand, FACC** | Clinical Cardiology (Echo) | `dr.diana@altrixhealth.com` | `Doctor@123` | `DOC-CARDIO-002` | Room 210, 2nd Floor |
| **Dr. Mary Shelton, MD** | Pulmonology & Respiratory | `dr.mary@altrixhealth.com` | `Doctor@123` | `DOC-PULMO-005` | Cabin 118, 1st Floor |

---

## 🌐 Routes Supported in Render Production

- `/` — AI Health Intelligence Command Center & Living Health Map
- `/doctor` or `/doctor-dashboard` — Doctor OPD Patient Queue & Consultation Desk
- `/appointments` — Patient Hospital Appointment Booking & Digital Attendance Token Passes
- `/login` — Full Page Login with Patient / Doctor Portal Switcher
- `/signup` — Full Page Registration with ABHA ID Generation
- `/api/appointments` — REST API for patient tokens and queue status
- `/api/records` — Clinical EHR records repository
- `/api/db/status` — Live Render PostgreSQL status endpoint
