# 🚀 Deploying ALTRIX HEALTH to Render with PostgreSQL

This guide walks you through deploying **ALTRIX HEALTH — AI Health Intelligence Command Center** to **Render** with a **Managed PostgreSQL Database**.

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
5. Click **Apply**.
6. Render will build the Vite frontend, start the Express backend, initialize the PostgreSQL tables (`users`, `medical_records`, `medications`, `ai_insights`, `timeline_events`), and deploy your application live!

---

## 🛠 Option 2: Manual Deploy on Render

If you prefer to configure manually:

### Step 1: Create a PostgreSQL Database on Render
1. Go to **Dashboard** -> **New +** -> **PostgreSQL**.
2. **Name:** `altrix-health-db`
3. **Database:** `altrix_health`
4. **User:** `altrix_admin`
5. **Region:** Oregon (or closest to you)
6. **Plan:** Free
7. Click **Create Database**.
8. Once created, copy the **Internal Database URL** (or External Database URL).

### Step 2: Create the Web Service
1. In the Render Dashboard, click **New +** -> **Web Service**.
2. Connect your GitHub repository:
   ```
   https://github.com/purnasaigarikapati/hosiptalmanagement.git
   ```
3. Configure the service:
   - **Name:** `altrix-health`
   - **Region:** Same region as your database (e.g., Oregon)
   - **Branch:** `main`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free
4. Add Environment Variables under **Advanced**:
   - `NODE_ENV`: `production`
   - `DATABASE_URL`: *(Paste the PostgreSQL connection string from Step 1)*
   - `GEMINI_API_KEY`: *(Optional: your Google Gemini API key for live clinical AI chat)*
5. Click **Deploy Web Service**.

---

## 🧪 Database Health & Verification

Once deployed, you can verify your PostgreSQL connection in real time:

- Open your Render app URL: `https://<your-subdomain>.onrender.com/api/db/status`
- Response:
```json
{
  "configured": true,
  "provider": "PostgreSQL (Render Cloud)",
  "status": "Connected",
  "recordCount": 7,
  "urlConfigured": true
}
```

The server automatically runs `CREATE TABLE IF NOT EXISTS` migrations on boot and pre-seeds the clinical graph if the database is newly initialized.
