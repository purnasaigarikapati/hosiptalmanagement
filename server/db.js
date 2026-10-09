import pg from 'pg';
const { Pool } = pg;

// Support Render DATABASE_URL or local env
const connectionString = process.env.DATABASE_URL || process.env.POSTGRES_URL || null;

export const isPostgresConfigured = !!connectionString;

let pool = null;

if (isPostgresConfigured) {
  const isProduction = process.env.NODE_ENV === 'production' || connectionString.includes('render.com');
  pool = new Pool({
    connectionString,
    ssl: isProduction ? { rejectUnauthorized: false } : false,
    max: 10,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });

  pool.on('error', (err) => {
    console.error('[PostgreSQL] Unexpected error on idle client:', err.message);
  });
}

/**
 * Initialize PostgreSQL tables if connected
 */
export async function initPostgresTables(initialRecords = [], initialAppointments = []) {
  if (!pool) {
    console.log('[Database] Running in In-Memory / Local Storage Mode (DATABASE_URL not configured).');
    return false;
  }

  try {
    const client = await pool.connect();
    console.log('[PostgreSQL] Connected successfully to database!');

    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(64) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        abha_id VARCHAR(64),
        blood_group VARCHAR(16),
        role VARCHAR(64),
        avatar VARCHAR(16),
        last_login TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS medical_records (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) DEFAULT 'usr-001',
        title VARCHAR(255) NOT NULL,
        category VARCHAR(128) NOT NULL,
        organ_system VARCHAR(64) NOT NULL,
        record_date DATE NOT NULL,
        doctor VARCHAR(255),
        facility VARCHAR(255),
        document_type VARCHAR(128),
        file_name VARCHAR(255),
        file_size VARCHAR(64),
        file_type VARCHAR(32),
        verification_status VARCHAR(32) DEFAULT 'verified',
        summary TEXT,
        tests JSONB DEFAULT '[]'::jsonb,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS medications (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) DEFAULT 'usr-001',
        name VARCHAR(255) NOT NULL,
        dosage VARCHAR(128) NOT NULL,
        frequency VARCHAR(128) NOT NULL,
        indication VARCHAR(255),
        prescribing_doctor VARCHAR(255),
        start_date DATE,
        refills_remaining INT DEFAULT 0,
        instructions TEXT,
        verification_status VARCHAR(32) DEFAULT 'verified',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS ai_insights (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) DEFAULT 'usr-001',
        title VARCHAR(255) NOT NULL,
        category VARCHAR(128),
        organ_system VARCHAR(64),
        priority VARCHAR(32) DEFAULT 'normal',
        review_status VARCHAR(32) DEFAULT 'reviewed',
        insight_date DATE,
        summary TEXT,
        source_doc VARCHAR(255),
        metric_value VARCHAR(128),
        flag_reason TEXT,
        action_needed TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS timeline_events (
        id VARCHAR(64) PRIMARY KEY,
        user_id VARCHAR(64) DEFAULT 'usr-001',
        event_date DATE NOT NULL,
        title VARCHAR(255) NOT NULL,
        record_type VARCHAR(128),
        organ_system VARCHAR(64),
        source_doc VARCHAR(255),
        doctor VARCHAR(255),
        facility VARCHAR(255),
        verification_status VARCHAR(32) DEFAULT 'verified',
        summary TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS appointments (
        id VARCHAR(64) PRIMARY KEY,
        token_number VARCHAR(32) NOT NULL,
        token_code VARCHAR(64) NOT NULL,
        patient_name VARCHAR(255) NOT NULL,
        age INT NOT NULL,
        gender VARCHAR(32) NOT NULL,
        phone VARCHAR(64) NOT NULL,
        weight VARCHAR(32) NOT NULL,
        doctor_id VARCHAR(64) NOT NULL,
        doctor_name VARCHAR(255) NOT NULL,
        doctor_specialty VARCHAR(255) NOT NULL,
        doctor_room VARCHAR(64),
        appointment_date DATE NOT NULL,
        time_slot VARCHAR(64) NOT NULL,
        health_description TEXT,
        queue_position INT DEFAULT 1,
        estimated_wait_minutes INT DEFAULT 15,
        status VARCHAR(32) DEFAULT 'confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Check if initial records exist
    const countRes = await client.query('SELECT COUNT(*) FROM medical_records');
    const existingCount = parseInt(countRes.rows[0].count, 10);

    if (existingCount === 0 && initialRecords.length > 0) {
      console.log(`[PostgreSQL] Seeding ${initialRecords.length} default clinical records into database...`);
      for (const rec of initialRecords) {
        await client.query(`
          INSERT INTO medical_records 
          (id, title, category, organ_system, record_date, doctor, facility, document_type, file_name, file_size, file_type, verification_status, summary, tests)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
          ON CONFLICT (id) DO NOTHING
        `, [
          rec.id,
          rec.title,
          rec.category,
          rec.organSystem,
          rec.date,
          rec.doctor,
          rec.facility,
          rec.documentType,
          rec.fileName,
          rec.fileSize,
          rec.fileType,
          rec.verificationStatus,
          rec.summary,
          JSON.stringify(rec.tests || [])
        ]);
      }
      console.log('[PostgreSQL] Clinical seed completed successfully.');
    }

    // Check if initial appointments exist
    const aptCountRes = await client.query('SELECT COUNT(*) FROM appointments');
    const existingAptCount = parseInt(aptCountRes.rows[0].count, 10);

    if (existingAptCount === 0 && initialAppointments.length > 0) {
      console.log(`[PostgreSQL] Seeding ${initialAppointments.length} default patient appointments & doctor tokens into database...`);
      for (const apt of initialAppointments) {
        await client.query(`
          INSERT INTO appointments
          (id, token_number, token_code, patient_name, age, gender, phone, weight, doctor_id, doctor_name, doctor_specialty, doctor_room, appointment_date, time_slot, health_description, queue_position, estimated_wait_minutes, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18)
          ON CONFLICT (id) DO NOTHING
        `, [
          apt.id,
          apt.tokenNumber,
          apt.tokenCode,
          apt.patientName,
          apt.age,
          apt.gender,
          apt.phone,
          apt.weight,
          apt.doctor?.id || 'doc-001',
          apt.doctor?.name || 'Dr. Arvind Rao, DM',
          apt.doctor?.specialty || 'Senior Interventional Cardiologist',
          apt.doctor?.roomNumber || apt.doctor?.room || 'Cabin 304, 3rd Floor',
          apt.date,
          apt.timeSlot,
          apt.healthDescription,
          apt.queuePosition || 1,
          apt.estimatedWaitMinutes || 15,
          apt.status ? apt.status.toLowerCase() : 'confirmed'
        ]);
      }
      console.log('[PostgreSQL] Appointment tokens seeded successfully.');
    }

    client.release();
    return true;
  } catch (err) {
    console.error('[PostgreSQL] Table initialization error:', err.message);
    return false;
  }
}

/**
 * Query helper
 */
export async function query(text, params) {
  if (!pool) return null;
  return pool.query(text, params);
}

export { pool };
