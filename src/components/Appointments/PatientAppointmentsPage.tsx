import React, { useState } from 'react';
import { 
  Calendar, 
  Clock, 
  User, 
  Phone, 
  Scale, 
  FileText, 
  CheckCircle2, 
  Printer, 
  Sparkles, 
  AlertCircle, 
  Stethoscope, 
  Building2, 
  MapPin, 
  QrCode, 
  Share2, 
  ArrowRight, 
  Check, 
  X, 
  CalendarCheck,
  ShieldCheck,
  Activity,
  Heart
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { Doctor, PatientAppointment } from '../../types/health';

interface PatientAppointmentsPageProps {
  onBackToDashboard?: () => void;
}

export const PatientAppointmentsPage: React.FC<PatientAppointmentsPageProps> = ({ onBackToDashboard }) => {
  const { 
    doctors, 
    appointments, 
    bookAppointment, 
    cancelAppointment, 
    user, 
    currentTheme,
    themeMode,
    t 
  } = useHealth();

  // Tab: 'book' or 'tokens'
  const [activeTab, setActiveTab] = useState<'book' | 'tokens'>('book');

  // Form states
  const [patientName, setPatientName] = useState(user?.name || 'Sai Garikapati');
  const [age, setAge] = useState<number>(28);
  const [gender, setGender] = useState<'Male' | 'Female' | 'Other'>('Male');
  const [phone, setPhone] = useState('+91 98480 12345');
  const [weight, setWeight] = useState('72 kg');
  const [selectedDoctorId, setSelectedDoctorId] = useState<string>(doctors[0]?.id || '');
  const [appointmentDate, setAppointmentDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  });
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string>(doctors[0]?.timeSlots[1] || '10:15 AM');
  const [healthDescription, setHealthDescription] = useState(
    'Seeking routine cardiovascular & metabolic checkup. Experiencing mild evening fatigue and requesting review of recent HbA1c (6.8%) and lipid values.'
  );

  // Newly generated token state for immediate celebratory focus
  const [justGeneratedToken, setJustGeneratedToken] = useState<PatientAppointment | null>(null);

  const selectedDoctor = doctors.find(d => d.id === selectedDoctorId) || doctors[0];

  const handleDoctorChange = (docId: string) => {
    setSelectedDoctorId(docId);
    const doc = doctors.find(d => d.id === docId);
    if (doc && doc.timeSlots.length > 0) {
      setSelectedTimeSlot(doc.timeSlots[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) return;

    const newApt = bookAppointment({
      patientName: patientName.trim(),
      age: Number(age) || 25,
      gender,
      phone: phone.trim() || '+91 98765 43210',
      weight: weight.trim() || '70 kg',
      doctor: selectedDoctor,
      date: appointmentDate,
      timeSlot: selectedTimeSlot,
      healthDescription: healthDescription.trim() || 'General health consultation and medical review.'
    });

    setJustGeneratedToken(newApt);
    setActiveTab('tokens');
  };

  const handlePrintToken = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* ================= PAGE HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-cyan-500/15">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500/20 to-blue-500/20 border border-cyan-400/40 flex items-center justify-center text-cyan-400 shadow-glow-cyan">
              <CalendarCheck className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white flex items-center gap-2">
                Patient Hospital Appointments
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono font-medium bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                  Live Token Desk
                </span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                Book a doctor consultation, select available time slots, and generate your verifiable hospital attendance token.
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher & Dashboard Return */}
        <div className="flex items-center gap-2.5">
          <div className="flex items-center bg-slate-900/90 p-1 rounded-2xl border border-slate-750 text-xs">
            <button
              onClick={() => setActiveTab('book')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium transition ${
                activeTab === 'book'
                  ? 'bg-blue-600 text-white shadow-[0_0_15px_rgba(37,99,235,0.4)]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Appointment</span>
            </button>
            <button
              onClick={() => setActiveTab('tokens')}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl font-medium transition ${
                activeTab === 'tokens'
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <QrCode className="w-3.5 h-3.5" />
              <span>My Tokens ({appointments.length})</span>
            </button>
          </div>

          {onBackToDashboard && (
            <button
              onClick={onBackToDashboard}
              className="px-3.5 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700/80 text-xs text-slate-300 hover:text-white transition"
            >
              Back to Overview
            </button>
          )}
        </div>
      </div>

      {/* ================= TAB 1: BOOKING FORM ================= */}
      {activeTab === 'book' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Main Appointment Booking Form (8 Cols) */}
          <div className="lg:col-span-8 glass-panel rounded-3xl p-6 sm:p-8 border border-cyan-500/25 shadow-2xl space-y-6">
            
            <div className="flex items-center justify-between pb-4 border-b border-cyan-500/15">
              <div>
                <h2 className="text-base sm:text-lg font-bold text-white">
                  Patient Consultation Request
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Enter patient vitals and health description to issue an official clinic token.
                </p>
              </div>
              <span className="text-xs font-mono text-cyan-400 bg-cyan-950/60 px-2.5 py-1 rounded-lg border border-cyan-800/50">
                Step 1 of 2
              </span>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Patient Name & Age */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                <div className="sm:col-span-8">
                  <label className="block text-xs font-mono uppercase text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
                    <User className="w-3.5 h-3.5 text-cyan-400" /> Patient Full Name *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={patientName}
                    onChange={(e) => setPatientName(e.target.value)}
                    placeholder="Enter patient full name"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-mono uppercase text-slate-400 font-semibold mb-1.5">
                    Age (Years) *
                  </label>
                  <input 
                    type="number" 
                    min={1} 
                    max={120}
                    required
                    value={age}
                    onChange={(e) => setAge(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>
              </div>

              {/* Row 2: Gender, Phone Number, Weight */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                
                {/* Gender Selector */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-semibold mb-1.5">
                    Gender *
                  </label>
                  <div className="grid grid-cols-3 gap-1.5 bg-slate-900/80 p-1 rounded-xl border border-slate-700/80">
                    {(['Male', 'Female', 'Other'] as const).map((g) => (
                      <button
                        key={g}
                        type="button"
                        onClick={() => setGender(g)}
                        className={`py-1.5 rounded-lg text-xs font-medium transition ${
                          gender === g 
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                            : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-cyan-400" /> Phone Number *
                  </label>
                  <input 
                    type="tel" 
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98480 XXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

                {/* Weight */}
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
                    <Scale className="w-3.5 h-3.5 text-cyan-400" /> Patient Weight *
                  </label>
                  <input 
                    type="text" 
                    required
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    placeholder="e.g. 72 kg"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition"
                  />
                </div>

              </div>

              {/* Row 3: Select Doctor */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 font-semibold mb-2 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Stethoscope className="w-3.5 h-3.5 text-cyan-400" /> Choose Hospital Specialist Doctor *
                  </span>
                  <span className="text-[11px] text-cyan-400 font-normal">
                    {doctors.length} Doctors Available
                  </span>
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-60 overflow-y-auto pr-1">
                  {doctors.map((doc) => {
                    const isSelected = selectedDoctorId === doc.id;
                    return (
                      <div
                        key={doc.id}
                        onClick={() => handleDoctorChange(doc.id)}
                        className={`p-3 rounded-2xl border transition cursor-pointer flex items-start gap-3 group ${
                          isSelected
                            ? 'bg-slate-800/90 border-cyan-400 shadow-glow-cyan ring-1 ring-cyan-400/40'
                            : 'bg-slate-900/60 hover:bg-slate-850 border-slate-800 text-slate-300'
                        }`}
                      >
                        <img 
                          src={doc.avatar} 
                          alt={doc.name} 
                          className="w-10 h-10 rounded-xl object-cover shrink-0 ring-1 ring-cyan-500/30"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between">
                            <h4 className="text-xs font-bold text-white group-hover:text-cyan-300 truncate">
                              {doc.name}
                            </h4>
                            {isSelected && <Check className="w-3.5 h-3.5 text-cyan-400 shrink-0" />}
                          </div>
                          <p className="text-[11px] text-cyan-300/90 truncate mt-0.5">{doc.specialty}</p>
                          <p className="text-[10px] text-slate-400 truncate mt-0.5 flex items-center gap-1">
                            <MapPin className="w-2.5 h-2.5 text-slate-400" /> {doc.roomNumber}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Row 4: Appointment Date & Available Time Slots */}
              <div className="grid grid-cols-1 sm:grid-cols-12 gap-4">
                
                {/* Date Picker */}
                <div className="sm:col-span-5">
                  <label className="block text-xs font-mono uppercase text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-cyan-400" /> Appointment Date *
                  </label>
                  <input 
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={appointmentDate}
                    onChange={(e) => setAppointmentDate(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition"
                  />
                  <p className="text-[10px] text-slate-400 mt-1">
                    Doctor is available on {selectedDoctor.availableDays.join(', ')}
                  </p>
                </div>

                {/* Available Time Slots of Doctor */}
                <div className="sm:col-span-7">
                  <label className="block text-xs font-mono uppercase text-slate-400 font-semibold mb-1.5 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" /> Available Time Slots for {selectedDoctor.name} *
                  </label>
                  
                  <div className="grid grid-cols-3 gap-2 max-h-36 overflow-y-auto pr-1">
                    {selectedDoctor.timeSlots.map((slot) => {
                      const isSelected = selectedTimeSlot === slot;
                      return (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => setSelectedTimeSlot(slot)}
                          className={`py-2 px-2 rounded-xl text-xs font-mono font-medium transition text-center border ${
                            isSelected
                              ? 'bg-blue-600 text-white border-blue-400 shadow-[0_0_12px_rgba(37,99,235,0.4)]'
                              : 'bg-slate-900/70 hover:bg-slate-800 text-slate-300 border-slate-800'
                          }`}
                        >
                          {slot}
                        </button>
                      );
                    })}
                  </div>
                </div>

              </div>

              {/* Row 5: Description for the Health (Symptoms Box) */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 font-semibold mb-1.5 flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-cyan-400" /> Health Description & Symptoms Box *
                  </span>
                  <span className="text-[10px] text-slate-400 font-normal">
                    Visible to the attending doctor
                  </span>
                </label>
                <textarea
                  required
                  rows={3}
                  value={healthDescription}
                  onChange={(e) => setHealthDescription(e.target.value)}
                  placeholder="Describe your health symptoms, medical concerns, duration of discomfort, previous medications, or questions for the doctor..."
                  className="w-full p-3.5 rounded-2xl bg-slate-900/80 border border-slate-700/80 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 transition resize-none leading-relaxed"
                />
              </div>

              {/* Submit CTA */}
              <div className="pt-2 flex items-center justify-between gap-4">
                <div className="flex items-center gap-2 text-xs text-slate-400">
                  <ShieldCheck className="w-4 h-4 text-teal-400" />
                  <span>Instant verified token generated for hospital entry.</span>
                </div>

                <button
                  type="submit"
                  className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-blue-600 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-bold text-xs sm:text-sm shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition"
                >
                  <Sparkles className="w-4 h-4 text-cyan-100" />
                  <span>Generate Hospital Appointment Token</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

            </form>
          </div>

          {/* Right Live Preview / Selected Doctor Summary (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Selected Specialist Info Card */}
            <div className="p-6 rounded-3xl glass-panel-glow border border-cyan-500/30 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                <span className="text-xs font-mono uppercase text-slate-400 font-semibold">
                  Consultation Target
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-teal-500/10 text-teal-300 border border-teal-500/30">
                  Verified Specialist
                </span>
              </div>

              <div className="flex items-start gap-3.5">
                <img 
                  src={selectedDoctor.avatar} 
                  alt={selectedDoctor.name} 
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-cyan-500/40 shadow-lg"
                />
                <div>
                  <h3 className="text-sm font-bold text-white leading-tight">
                    {selectedDoctor.name}
                  </h3>
                  <p className="text-xs text-cyan-400 mt-0.5">{selectedDoctor.specialty}</p>
                  <p className="text-[11px] text-slate-400 mt-1">{selectedDoctor.department}</p>
                </div>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-850 text-xs">
                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-cyan-400" /> Hospital:
                  </span>
                  <span className="font-medium text-right max-w-[180px] truncate">{selectedDoctor.hospital}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-cyan-400" /> Clinic Room:
                  </span>
                  <span className="font-mono text-cyan-300 font-bold">{selectedDoctor.roomNumber}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Experience:</span>
                  <span className="font-medium">{selectedDoctor.experience}</span>
                </div>

                <div className="flex items-center justify-between text-slate-300">
                  <span className="text-slate-400">Consultation Fee:</span>
                  <span className="font-bold text-white">{selectedDoctor.consultationFee}</span>
                </div>
              </div>
            </div>

            {/* Quick Helper Notice */}
            <div className="p-5 rounded-2xl bg-cyan-950/20 border border-cyan-500/25 space-y-2">
              <h4 className="text-xs font-bold text-cyan-300 flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-cyan-400" /> Patient Token Attendance Rules
              </h4>
              <ul className="text-[11px] text-slate-300 space-y-1.5 list-disc list-inside leading-relaxed">
                <li>Present this digital token at the hospital registration desk or OPD counter.</li>
                <li>Your queue position and live estimated call time update automatically.</li>
                <li>Bring previous diagnostic test reports or show them directly in Altrix Health.</li>
              </ul>
            </div>

          </div>

        </div>
      )}

      {/* ================= TAB 2: TOKENS & APPOINTMENTS PASS ================= */}
      {activeTab === 'tokens' && (
        <div className="space-y-8">
          
          {appointments.length === 0 ? (
            <div className="p-12 text-center glass-panel rounded-3xl border border-slate-800 space-y-4">
              <Calendar className="w-12 h-12 text-slate-500 mx-auto" />
              <h3 className="text-base font-bold text-white">No Hospital Appointments Scheduled</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                You have not booked any hospital consultations yet. Use the booking tab to select a doctor and generate your attendance token.
              </p>
              <button
                onClick={() => setActiveTab('book')}
                className="px-5 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition"
              >
                Book Consultation Now
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white">
                    Active Patient Consultation Tokens ({appointments.length})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Show this digital pass to the clinic receptionist or doctor to attend your consultation.
                  </p>
                </div>

                <button
                  onClick={handlePrintToken}
                  className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 text-xs font-medium text-slate-200 transition"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Print All Tokens</span>
                </button>
              </div>

              {/* Render Each Appointment as an Authentic Hospital Token Pass */}
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {appointments.map((apt) => (
                  <div 
                    key={apt.id}
                    className="relative rounded-3xl overflow-hidden glass-panel-glow border border-cyan-500/40 shadow-2xl transition duration-200 hover:border-cyan-400 flex flex-col"
                  >
                    
                    {/* Top Token Banner */}
                    <div className="p-5 bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 text-white flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-[10px] font-mono uppercase tracking-widest bg-black/30 px-2 py-0.5 rounded font-bold">
                            ALTRIX HOSPITAL PASS
                          </span>
                          <span className="text-[10px] font-mono bg-white/20 px-2 py-0.5 rounded">
                            {apt.status}
                          </span>
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black font-mono tracking-tight mt-1">
                          {apt.tokenCode} • {apt.tokenNumber}
                        </h3>
                      </div>

                      {/* Queue Badge */}
                      <div className="text-right">
                        <span className="text-[10px] font-mono text-blue-100 uppercase">Queue Position</span>
                        <div className="text-xl font-extrabold font-mono text-cyan-100">
                          #{apt.queuePosition} <span className="text-xs font-normal">in line</span>
                        </div>
                      </div>
                    </div>

                    {/* Token Body: Patient & Doctor Verification Details */}
                    <div className="p-6 space-y-5 bg-slate-950/70 flex-1">
                      
                      {/* Grid: Patient Details vs Doctor Details */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-800">
                        
                        {/* Patient Information Box */}
                        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
                            <User className="w-3 h-3 text-cyan-400" /> Patient Details
                          </span>
                          <div>
                            <p className="text-sm font-bold text-white">{apt.patientName}</p>
                            <p className="text-xs text-slate-300 mt-0.5">
                              {apt.age} Yrs • {apt.gender} • {apt.weight}
                            </p>
                            <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                              Phone: {apt.phone}
                            </p>
                          </div>
                        </div>

                        {/* Doctor Consultation Box */}
                        <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                          <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1">
                            <Stethoscope className="w-3 h-3 text-cyan-400" /> Attending Doctor
                          </span>
                          <div>
                            <p className="text-sm font-bold text-cyan-300">{apt.doctor.name}</p>
                            <p className="text-xs text-slate-300 mt-0.5">{apt.doctor.specialty}</p>
                            <p className="text-[11px] text-slate-400 mt-0.5 font-mono">
                              {apt.doctor.roomNumber}
                            </p>
                          </div>
                        </div>

                      </div>

                      {/* Appointment Time & Hospital Location Bar */}
                      <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-cyan-950/20 border border-cyan-500/25 text-xs">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-cyan-400" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-mono block">Date & Time</span>
                            <span className="font-bold text-white">{apt.date} at {apt.timeSlot}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Building2 className="w-4 h-4 text-cyan-400" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-mono block">Facility</span>
                            <span className="font-medium text-slate-200">{apt.doctor.hospital}</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-teal-400" />
                          <div>
                            <span className="text-[10px] text-slate-400 uppercase font-mono block">Est. Wait</span>
                            <span className="font-mono text-teal-300 font-bold">~{apt.estimatedWaitMinutes} mins</span>
                          </div>
                        </div>
                      </div>

                      {/* Health Description (Symptoms Box) as specified */}
                      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-mono uppercase text-slate-400 font-bold flex items-center gap-1.5">
                          <FileText className="w-3 h-3 text-cyan-400" /> Health Description & Symptoms
                        </span>
                        <p className="text-xs text-slate-300 leading-relaxed italic">
                          "{apt.healthDescription}"
                        </p>
                      </div>

                      {/* Verification QR / Barcode Strip */}
                      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-xl bg-white text-black">
                            <QrCode className="w-8 h-8" />
                          </div>
                          <div>
                            <span className="text-[10px] font-mono text-slate-400 uppercase block">Verification Code</span>
                            <span className="text-xs font-mono font-bold text-white tracking-widest">{apt.tokenNumber}</span>
                            <span className="text-[10px] text-teal-400 block mt-0.5">✓ Ready for Doctor Attendance</span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            onClick={handlePrintToken}
                            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition"
                            title="Print this Token"
                          >
                            <Printer className="w-4 h-4" />
                          </button>
                          
                          {apt.status === 'Confirmed' && (
                            <button
                              onClick={() => cancelAppointment(apt.id)}
                              className="px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs font-medium transition"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>

                    </div>

                  </div>
                ))}
              </div>

            </div>
          )}

        </div>
      )}

    </div>
  );
};
