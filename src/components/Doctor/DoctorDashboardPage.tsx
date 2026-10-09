import React, { useState } from 'react';
import { 
  Stethoscope, 
  Users, 
  Clock, 
  CheckCircle2, 
  Activity, 
  Search, 
  Filter, 
  ArrowLeft, 
  Phone, 
  Scale, 
  FileText, 
  Printer, 
  ShieldCheck, 
  AlertCircle, 
  Sparkles, 
  Key, 
  UserCheck, 
  Calendar, 
  ChevronDown, 
  Heart, 
  Check, 
  X, 
  Save, 
  Share2, 
  Building2, 
  Award,
  ChevronRight,
  Eye,
  Pill,
  RefreshCw,
  LogOut
} from 'lucide-react';
import { useHealth } from '../../context/HealthContext';
import { Doctor, PatientAppointment } from '../../types/health';

interface DoctorDashboardPageProps {
  onBackToPatientView?: () => void;
}

export const DoctorDashboardPage: React.FC<DoctorDashboardPageProps> = ({ onBackToPatientView }) => {
  const { 
    currentDoctor, 
    setCurrentDoctor, 
    doctors, 
    appointments, 
    updateAppointmentStatus, 
    loginAsDoctor, 
    t,
    currentTheme,
    themeMode,
    addToast
  } = useHealth();

  // Selected filter tab: 'all' | 'waiting' | 'in_consultation' | 'completed'
  const [filterTab, setFilterTab] = useState<'all' | 'waiting' | 'in_consultation' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Doctor switcher dropdown state
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);
  const [showCredentialsModal, setShowCredentialsModal] = useState(false);

  // Active Consultation Modal / Drawer state
  const [activeConsultationPatient, setActiveConsultationPatient] = useState<PatientAppointment | null>(null);
  const [clinicalNotesInput, setClinicalNotesInput] = useState('');
  const [prescriptionInput, setPrescriptionInput] = useState('');

  // Filter appointments for the current active doctor
  const doctorAppointments = appointments.filter(a => {
    // Match by doctor id or doctor name
    return a.doctor.id === currentDoctor.id || a.doctor.name === currentDoctor.name;
  });

  // Calculate live counts
  const totalCount = doctorAppointments.length;
  const waitingCount = doctorAppointments.filter(a => a.status === 'Confirmed').length;
  const inConsultationCount = doctorAppointments.filter(a => a.status === 'In Consultation').length;
  const completedCount = doctorAppointments.filter(a => a.status === 'Completed').length;

  // Filtered list based on search and tab
  const filteredAppointments = doctorAppointments.filter(apt => {
    // Tab filtering
    if (filterTab === 'waiting' && apt.status !== 'Confirmed') return false;
    if (filterTab === 'in_consultation' && apt.status !== 'In Consultation') return false;
    if (filterTab === 'completed' && apt.status !== 'Completed') return false;

    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = apt.patientName.toLowerCase().includes(q);
      const matchToken = apt.tokenCode.toLowerCase().includes(q) || apt.tokenNumber.toLowerCase().includes(q);
      const matchPhone = apt.phone.includes(q);
      const matchDesc = apt.healthDescription.toLowerCase().includes(q);
      return matchName || matchToken || matchPhone || matchDesc;
    }
    return true;
  });

  // Current patient being actively attended (either explicitly opened or first in_consultation)
  const currentlyAttending = activeConsultationPatient || doctorAppointments.find(a => a.status === 'In Consultation');

  const handleStartConsultation = (apt: PatientAppointment) => {
    updateAppointmentStatus(apt.id, 'In Consultation');
    setActiveConsultationPatient(apt);
    setClinicalNotesInput(apt.doctorNotes || '');
    setPrescriptionInput(apt.prescriptions ? apt.prescriptions.join('\n') : '');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCompleteConsultation = (apt: PatientAppointment) => {
    const rxList = prescriptionInput.trim() 
      ? prescriptionInput.split('\n').filter(s => s.trim().length > 0)
      : apt.prescriptions;

    updateAppointmentStatus(apt.id, 'Completed', clinicalNotesInput.trim() || apt.doctorNotes || 'Consultation concluded normally. Patient advised routine follow-up.');
    
    if (activeConsultationPatient?.id === apt.id) {
      setActiveConsultationPatient(null);
    }
    addToast('success', 'Consultation Concluded', `Patient ${apt.patientName} (Token ${apt.tokenCode}) marked as Completed.`);
  };

  const handleSwitchDoctor = (doc: Doctor) => {
    setCurrentDoctor(doc);
    setShowDoctorDropdown(false);
    setActiveConsultationPatient(null);
    addToast('info', 'Doctor Switched', `Now viewing OPD roster for ${doc.name}`);
  };

  const handlePrintQueue = () => {
    window.print();
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300 pb-16">
      
      {/* 1. TOP BAR: Switch to Patient View & Credentials Modal Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-cyan-500/15">
        <div className="flex items-center gap-3">
          {onBackToPatientView && (
            <button
              onClick={onBackToPatientView}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-semibold transition group shadow-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-x-0.5 transition" />
              <span>Back to Patient Portal</span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/30 text-cyan-300 text-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
            <span className="font-semibold">Doctor Clinical Portal</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-300">OPD Shift Active</span>
          </div>
        </div>

        {/* Credentials Pill & Print Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowCredentialsModal(true)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-orange-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/40 text-amber-200 text-xs font-semibold transition shadow-sm"
          >
            <Key className="w-3.5 h-3.5 text-amber-400" />
            <span>Doctor Credentials ({currentDoctor.staffId})</span>
          </button>

          <button
            onClick={handlePrintQueue}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/80 text-xs font-medium transition"
            title="Print Today's OPD Roster"
          >
            <Printer className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Print Roster</span>
          </button>
        </div>
      </div>

      {/* 2. DOCTOR PROFILE & CABIN BANNER */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-400/30 relative overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          
          {/* Doctor Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="relative">
              <img 
                src={currentDoctor.avatar} 
                alt={currentDoctor.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-cyan-400/50 shadow-[0_0_20px_rgba(0,242,254,0.3)]"
              />
              <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center text-white shadow">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                  {currentDoctor.name}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full bg-cyan-900/50 border border-cyan-400/40 text-cyan-200 text-xs font-mono font-bold">
                  {currentDoctor.staffId}
                </span>
              </div>

              <p className="text-cyan-300 font-semibold text-sm sm:text-base flex items-center gap-1.5">
                <Stethoscope className="w-4 h-4 text-cyan-400" />
                <span>{currentDoctor.specialty}</span>
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-300 font-normal">
                <span className="flex items-center gap-1 text-slate-300">
                  <Building2 className="w-3.5 h-3.5 text-slate-400" />
                  {currentDoctor.hospital}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-emerald-400 font-medium">
                  {currentDoctor.roomNumber}
                </span>
                <span className="text-slate-500">•</span>
                <span className="text-amber-300 font-medium">
                  Fee: {currentDoctor.consultationFee}
                </span>
              </div>
            </div>
          </div>

          {/* Switch Doctor Dropdown */}
          <div className="relative w-full lg:w-auto">
            <button
              onClick={() => setShowDoctorDropdown(!showDoctorDropdown)}
              className="w-full lg:w-auto flex items-center justify-between gap-3 px-4 py-2.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800 border border-cyan-500/40 text-slate-200 text-xs font-semibold transition shadow-lg group"
            >
              <div className="flex items-center gap-2">
                <RefreshCw className="w-3.5 h-3.5 text-cyan-400 group-hover:rotate-180 transition duration-500" />
                <span>Switch Doctor Roster</span>
              </div>
              <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${showDoctorDropdown ? 'rotate-180' : ''}`} />
            </button>

            {showDoctorDropdown && (
              <div className="absolute right-0 top-full mt-2 w-full lg:w-80 rounded-2xl bg-[#080d1e] border border-cyan-500/30 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <p className="text-[11px] font-mono uppercase tracking-wider text-slate-400 px-3 py-1 font-bold">
                  Select Specialist OPD:
                </p>
                <div className="space-y-1 max-h-72 overflow-y-auto mt-1 pr-1">
                  {doctors.map(doc => (
                    <button
                      key={doc.id}
                      onClick={() => handleSwitchDoctor(doc)}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-xl text-left transition ${
                        doc.id === currentDoctor.id 
                          ? 'bg-cyan-500/20 text-cyan-200 border border-cyan-500/40 font-semibold' 
                          : 'hover:bg-slate-800/80 text-slate-300'
                      }`}
                    >
                      <img src={doc.avatar} alt={doc.name} className="w-9 h-9 rounded-lg object-cover" />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-white truncate">{doc.name}</p>
                        <p className="text-[11px] text-cyan-300/80 truncate">{doc.specialty}</p>
                        <p className="text-[10px] text-slate-400 truncate">{doc.staffId}</p>
                      </div>
                      {doc.id === currentDoctor.id && (
                        <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Credentials Quick Banner */}
        <div className="mt-6 pt-4 border-t border-cyan-500/15 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2 text-slate-300">
            <span className="font-mono text-amber-300 font-bold flex items-center gap-1.5">
              <Key className="w-3.5 h-3.5" /> Doctor Login Credentials:
            </span>
            <code className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-cyan-300 font-mono text-[11px]">
              Email: {currentDoctor.email}
            </code>
            <code className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-teal-300 font-mono text-[11px]">
              Password: {currentDoctor.password || 'Doctor@123'}
            </code>
            <code className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 text-amber-300 font-mono text-[11px]">
              Staff ID: {currentDoctor.staffId}
            </code>
          </div>

          <div className="text-[11px] font-mono text-slate-400">
            Clinic Hours: <span className="text-slate-200 font-semibold">09:00 AM - 05:00 PM</span>
          </div>
        </div>
      </div>

      {/* 3. METRIC CARDS: Total, Waiting, In-Consultation, Completed */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        {/* Total Patients */}
        <div className="glass-panel-glow rounded-2xl p-5 border border-cyan-500/20 relative overflow-hidden group hover:border-cyan-400/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">Total Scheduled</span>
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center text-cyan-300">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">{totalCount}</span>
            <span className="text-xs text-slate-400">Patients Today</span>
          </div>
          <p className="text-[11px] text-cyan-300/80 mt-2">All registered tokens for this session</p>
        </div>

        {/* Waiting in Queue */}
        <div className="glass-panel-glow rounded-2xl p-5 border border-amber-500/20 relative overflow-hidden group hover:border-amber-400/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-amber-300/90">Waiting in Queue</span>
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-300">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-amber-200 tracking-tight">{waitingCount}</span>
            <span className="text-xs text-slate-400">Next in line</span>
          </div>
          <p className="text-[11px] text-amber-300/80 mt-2">Patients ready in hospital lobby</p>
        </div>

        {/* In Consultation */}
        <div className="glass-panel-glow rounded-2xl p-5 border border-emerald-500/20 relative overflow-hidden group hover:border-emerald-400/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-emerald-300/90">In Consultation</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-400/30 flex items-center justify-center text-emerald-300">
              <Activity className="w-5 h-5 animate-pulse" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-emerald-200 tracking-tight">{inConsultationCount}</span>
            <span className="text-xs text-slate-400">Attending Now</span>
          </div>
          <p className="text-[11px] text-emerald-300/80 mt-2">Active in OPD Cabin #{currentDoctor.roomNumber.split(' ')[1] || '304'}</p>
        </div>

        {/* Completed Consultations */}
        <div className="glass-panel-glow rounded-2xl p-5 border border-teal-500/20 relative overflow-hidden group hover:border-teal-400/40 transition">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-teal-300/90">Completed Visits</span>
            <div className="w-9 h-9 rounded-xl bg-teal-500/20 border border-teal-400/30 flex items-center justify-center text-teal-300">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-teal-200 tracking-tight">{completedCount}</span>
            <span className="text-xs text-slate-400">Concluded</span>
          </div>
          <p className="text-[11px] text-teal-300/80 mt-2">Clinical notes and advice issued</p>
        </div>

      </div>

      {/* 4. ACTIVE CONSULTATION IN PROGRESS DRAWER (If any patient is being attended) */}
      {currentlyAttending && (
        <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950/40 via-slate-900/90 to-teal-950/40 border-2 border-emerald-400/50 shadow-[0_0_40px_rgba(16,185,129,0.2)] animate-in fade-in slide-in-from-top-4 duration-300">
          
          {/* Header */}
          <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-emerald-500/20">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center text-emerald-300">
                <Activity className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs uppercase tracking-wider font-bold text-emerald-400">
                    Active Clinical Consultation in Progress
                  </span>
                  <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                </div>
                <h2 className="text-xl sm:text-2xl font-extrabold text-white">
                  {currentlyAttending.patientName} • <span className="text-emerald-300 font-mono">{currentlyAttending.tokenCode}</span>
                </h2>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleCompleteConsultation(currentlyAttending)}
                className="flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs shadow-lg transition active:scale-95"
              >
                <CheckCircle2 className="w-4 h-4 text-slate-950" />
                <span>Conclude Consultation</span>
              </button>
            </div>
          </div>

          {/* Vitals Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 my-5">
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Age / Gender</span>
              <span className="text-sm font-bold text-slate-100">{currentlyAttending.age} yrs • {currentlyAttending.gender}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Weight</span>
              <span className="text-sm font-bold text-slate-100">{currentlyAttending.weight}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Blood Pressure</span>
              <span className="text-sm font-bold text-emerald-400">{currentlyAttending.vitals?.bp || '120/80 mmHg'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Heart Rate</span>
              <span className="text-sm font-bold text-cyan-300">{currentlyAttending.vitals?.pulse || '74 bpm'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Oxygen SpO2</span>
              <span className="text-sm font-bold text-teal-300">{currentlyAttending.vitals?.spo2 || '99%'}</span>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800 text-center">
              <span className="text-[10px] text-slate-400 uppercase font-mono block">Token ID</span>
              <span className="text-sm font-bold text-amber-300 font-mono">{currentlyAttending.tokenNumber}</span>
            </div>
          </div>

          {/* Patient Symptoms & Health Description */}
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-emerald-500/25 mb-5">
            <div className="flex items-center gap-2 mb-2 text-xs font-semibold text-emerald-300">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Patient Reported Symptoms & Visit Description:</span>
            </div>
            <p className="text-sm text-slate-200 leading-relaxed italic">
              "{currentlyAttending.healthDescription}"
            </p>
          </div>

          {/* Clinical Findings & Notes Input */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Doctor's Clinical Findings & Examination Notes:
              </label>
              <textarea
                value={clinicalNotesInput}
                onChange={(e) => setClinicalNotesInput(e.target.value)}
                placeholder="Record clinical observations, cardiovascular auscultation, diagnosis, and review instructions..."
                rows={3}
                className="w-full rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-slate-100 text-xs p-3 transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                Prescriptions & Medication Advice:
              </label>
              <textarea
                value={prescriptionInput}
                onChange={(e) => setPrescriptionInput(e.target.value)}
                placeholder="e.g. Atorvastatin 20mg - 1 Tab OD (Bedtime)&#10;Telmisartan 40mg - 1 Tab OD (Morning)"
                rows={3}
                className="w-full rounded-xl bg-slate-950/80 border border-slate-700/80 focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400 text-slate-100 text-xs p-3 transition font-mono"
              />
            </div>
          </div>

        </div>
      )}

      {/* 5. PATIENT APPOINTMENTS QUEUE ROSTER */}
      <div className="glass-panel-glow rounded-3xl p-6 sm:p-8 border border-cyan-500/20 shadow-xl space-y-6">
        
        {/* Controls: Filter Pills & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          
          {/* Filter Pills */}
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setFilterTab('all')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
                filterTab === 'all'
                  ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(0,242,254,0.3)]'
                  : 'bg-slate-900/80 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              All Appointments ({totalCount})
            </button>

            <button
              onClick={() => setFilterTab('waiting')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                filterTab === 'waiting'
                  ? 'bg-amber-500 text-slate-950 shadow-[0_0_15px_rgba(245,158,11,0.3)]'
                  : 'bg-slate-900/80 text-amber-300/80 hover:text-amber-200 border border-slate-800'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Waiting ({waitingCount})</span>
            </button>

            <button
              onClick={() => setFilterTab('in_consultation')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                filterTab === 'in_consultation'
                  ? 'bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                  : 'bg-slate-900/80 text-emerald-300/80 hover:text-emerald-200 border border-slate-800'
              }`}
            >
              <Activity className="w-3.5 h-3.5" />
              <span>In Consultation ({inConsultationCount})</span>
            </button>

            <button
              onClick={() => setFilterTab('completed')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                filterTab === 'completed'
                  ? 'bg-teal-500 text-slate-950 shadow-[0_0_15px_rgba(20,184,166,0.3)]'
                  : 'bg-slate-900/80 text-teal-300/80 hover:text-teal-200 border border-slate-800'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Completed ({completedCount})</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search patient, token, phone..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-900/90 border border-slate-700/80 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 text-slate-100 text-xs transition"
            />
          </div>

        </div>

        {/* Empty State */}
        {filteredAppointments.length === 0 ? (
          <div className="text-center py-12 rounded-2xl bg-slate-900/40 border border-slate-800/80">
            <Users className="w-10 h-10 text-slate-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-300">No Patient Appointments Found</h3>
            <p className="text-xs text-slate-400 max-w-md mx-auto mt-1">
              There are no patient appointments matching this filter for {currentDoctor.name}. New bookings from the Patient Appointment page will appear here immediately.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredAppointments.map((apt, index) => {
              const isWaiting = apt.status === 'Confirmed';
              const isInConsultation = apt.status === 'In Consultation';
              const isCompleted = apt.status === 'Completed';

              return (
                <div
                  key={apt.id}
                  className={`rounded-2xl p-5 border transition-all duration-200 relative overflow-hidden ${
                    isInConsultation
                      ? 'bg-emerald-950/20 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.15)]'
                      : isCompleted
                      ? 'bg-slate-900/40 border-slate-800/80 opacity-90'
                      : 'bg-slate-900/70 border-slate-700/60 hover:border-cyan-500/40'
                  }`}
                >
                  <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    
                    {/* Left: Token Badge & Patient Info */}
                    <div className="flex items-start gap-4 flex-1">
                      
                      {/* Large Token Badge */}
                      <div className="flex flex-col items-center justify-center min-w-[70px] p-2.5 rounded-2xl bg-slate-950/90 border border-cyan-400/30 text-center shadow">
                        <span className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest font-bold">TOKEN</span>
                        <span className="text-xl font-extrabold text-white tracking-tight">{apt.tokenCode}</span>
                        <span className="text-[9px] font-mono text-slate-400 mt-0.5">{apt.timeSlot}</span>
                      </div>

                      {/* Details */}
                      <div className="space-y-1.5 flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h4 className="text-base sm:text-lg font-bold text-white truncate">
                            {apt.patientName}
                          </h4>
                          
                          {/* Status Pill */}
                          {isInConsultation && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/40 text-emerald-300 text-[11px] font-bold">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                              Attending Now
                            </span>
                          )}
                          {isWaiting && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/40 text-amber-300 text-[11px] font-semibold">
                              <Clock className="w-3 h-3" />
                              Queue #{apt.queuePosition}
                            </span>
                          )}
                          {isCompleted && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/40 text-teal-300 text-[11px] font-semibold">
                              <CheckCircle2 className="w-3 h-3" />
                              Completed
                            </span>
                          )}

                          <span className="text-xs text-slate-400 font-mono">
                            {apt.tokenNumber}
                          </span>
                        </div>

                        {/* Demographics Strip */}
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-300">
                          <span>{apt.age} yrs • {apt.gender}</span>
                          <span className="text-slate-600">•</span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <Scale className="w-3.5 h-3.5 text-slate-400" />
                            {apt.weight}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="flex items-center gap-1 text-slate-300">
                            <Phone className="w-3.5 h-3.5 text-slate-400" />
                            {apt.phone}
                          </span>
                          <span className="text-slate-600">•</span>
                          <span className="flex items-center gap-1 text-cyan-300 font-mono">
                            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
                            {apt.date}
                          </span>
                        </div>

                        {/* Symptoms Callout Box */}
                        <div className="mt-2.5 p-3 rounded-xl bg-slate-950/60 border border-slate-800 text-xs text-slate-200">
                          <span className="font-semibold text-cyan-300 mr-1.5">Symptoms / Health Query:</span>
                          <span className="italic">{apt.healthDescription}</span>
                        </div>

                        {/* Doctor Notes if Completed */}
                        {apt.doctorNotes && (
                          <div className="mt-1.5 p-2.5 rounded-xl bg-teal-950/30 border border-teal-500/30 text-xs text-teal-200">
                            <span className="font-semibold text-teal-300 mr-1">Doctor's Clinical Notes:</span>
                            <span>{apt.doctorNotes}</span>
                          </div>
                        )}
                      </div>

                    </div>

                    {/* Right: Doctor Actions */}
                    <div className="flex flex-wrap items-center gap-2.5 self-end lg:self-center shrink-0">
                      
                      {isWaiting && (
                        <button
                          onClick={() => handleStartConsultation(apt)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-400 hover:from-cyan-400 hover:to-teal-300 text-slate-950 font-bold text-xs shadow-md transition active:scale-95"
                        >
                          <Stethoscope className="w-4 h-4 text-slate-950" />
                          <span>Attend Patient</span>
                        </button>
                      )}

                      {isInConsultation && (
                        <button
                          onClick={() => handleCompleteConsultation(apt)}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs shadow-md transition active:scale-95"
                        >
                          <CheckCircle2 className="w-4 h-4 text-slate-950" />
                          <span>Conclude Visit</span>
                        </button>
                      )}

                      {isCompleted && (
                        <span className="px-3 py-1.5 rounded-xl bg-teal-950/50 border border-teal-500/30 text-teal-300 text-xs font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Consultation Finished
                        </span>
                      )}

                      {!isCompleted && (
                        <button
                          onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                          className="p-2 rounded-xl bg-slate-900 hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 border border-slate-800 transition"
                          title="Mark Absent / Cancel"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}

                    </div>

                  </div>
                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* 6. CREDENTIALS MODAL: Full Reference of All Doctor Accounts */}
      {showCredentialsModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setShowCredentialsModal(false)}
        >
          <div 
            className="w-full max-w-2xl bg-[#080d1e] rounded-3xl p-6 sm:p-8 border border-cyan-400/40 shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setShowCredentialsModal(false)}
              className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900 border border-slate-700 text-slate-400 hover:text-white flex items-center justify-center shadow transition"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
                <Key className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-white">Doctor Portal Access Credentials</h3>
                <p className="text-xs text-slate-400">Use any of the accounts below to log in or switch doctor profiles directly.</p>
              </div>
            </div>

            <div className="space-y-3 max-h-96 overflow-y-auto pr-1">
              {doctors.map(doc => (
                <div 
                  key={doc.id}
                  className="p-4 rounded-2xl bg-slate-900/80 border border-slate-700/80 hover:border-cyan-500/40 transition flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    <img src={doc.avatar} alt={doc.name} className="w-11 h-11 rounded-xl object-cover border border-cyan-400/30" />
                    <div>
                      <h4 className="text-sm font-bold text-white">{doc.name}</h4>
                      <p className="text-xs text-cyan-300">{doc.specialty}</p>
                      <div className="flex items-center gap-2 mt-1 font-mono text-[11px] text-slate-400">
                        <span className="text-amber-300">Email: {doc.email}</span>
                        <span>•</span>
                        <span className="text-emerald-300">Pass: {doc.password || 'Doctor@123'}</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      handleSwitchDoctor(doc);
                      setShowCredentialsModal(false);
                    }}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500 text-cyan-300 hover:text-slate-950 border border-cyan-400/40 text-xs font-bold transition shrink-0"
                  >
                    <span>Login / Switch</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-800 text-center">
              <button
                onClick={() => setShowCredentialsModal(false)}
                className="px-6 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold transition"
              >
                Close Reference
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
