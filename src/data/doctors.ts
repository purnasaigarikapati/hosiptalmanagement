import { Doctor } from '../types/health';

export const DOCTORS: Doctor[] = [
  {
    id: 'doc-001',
    name: 'Dr. Arvind Rao, DM',
    specialty: 'Senior Interventional Cardiologist',
    department: 'Cardiovascular Sciences',
    hospital: 'Care Heart Institute & Apollo Health City',
    roomNumber: 'Cabin 304, 3rd Floor (Cardio Wing)',
    experience: '18+ Years Experience',
    rating: 4.9,
    consultationFee: '₹1,200',
    avatar: 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=150&auto=format&fit=crop&q=80',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    timeSlots: [
      '09:00 AM', '09:30 AM', '10:15 AM', '11:00 AM', 
      '11:45 AM', '02:30 PM', '03:15 PM', '04:00 PM', '05:00 PM'
    ]
  },
  {
    id: 'doc-002',
    name: 'Dr. Diana Grand, FACC',
    specialty: 'Clinical Cardiologist & Echocardiography Specialist',
    department: 'Non-Invasive Cardiology',
    hospital: 'Apollo Health City Diagnostics',
    roomNumber: 'Room 210, 2nd Floor (Echo Lab)',
    experience: '14+ Years Experience',
    rating: 4.95,
    consultationFee: '₹1,000',
    avatar: 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&auto=format&fit=crop&q=80',
    availableDays: ['Mon', 'Wed', 'Thu', 'Fri'],
    timeSlots: [
      '09:30 AM', '10:00 AM', '10:45 AM', '11:30 AM', 
      '02:00 PM', '02:45 PM', '03:30 PM', '04:15 PM'
    ]
  },
  {
    id: 'doc-003',
    name: 'Dr. Anita Verma, MD',
    specialty: 'Pathologist & Metabolic Consultant',
    department: 'Clinical Pathology & Endocrinology',
    hospital: 'Apollo Health City Diagnostics',
    roomNumber: 'Room 105, Ground Floor (Pathology Wing)',
    experience: '16+ Years Experience',
    rating: 4.88,
    consultationFee: '₹800',
    avatar: 'https://images.unsplash.com/photo-1594824813583-a442a5c4e976?w=150&auto=format&fit=crop&q=80',
    availableDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    timeSlots: [
      '08:30 AM', '09:15 AM', '10:00 AM', '11:00 AM', 
      '01:30 PM', '02:15 PM', '03:00 PM', '04:00 PM'
    ]
  },
  {
    id: 'doc-004',
    name: 'Dr. Ramesh Babu, MD',
    specialty: 'Senior Consultant Endocrinologist',
    department: 'Diabetes & Metabolism Care',
    hospital: 'MaxCure Center for Endocrinology',
    roomNumber: 'Cabin 412, 4th Floor',
    experience: '20+ Years Experience',
    rating: 4.92,
    consultationFee: '₹1,500',
    avatar: 'https://images.unsplash.com/photo-1537368910025-700350fe46c7?w=150&auto=format&fit=crop&q=80',
    availableDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    timeSlots: [
      '10:00 AM', '10:30 AM', '11:15 AM', '12:00 PM', 
      '03:00 PM', '03:45 PM', '04:30 PM', '05:15 PM'
    ]
  },
  {
    id: 'doc-005',
    name: 'Dr. Mary Shelton, MD',
    specialty: 'Pulmonologist & Respiratory Specialist',
    department: 'Pulmonary & Sleep Medicine',
    hospital: 'Yashoda Super Specialty Hospital',
    roomNumber: 'Cabin 118, 1st Floor (Pulmonology)',
    experience: '15+ Years Experience',
    rating: 4.85,
    consultationFee: '₹1,100',
    avatar: 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=150&auto=format&fit=crop&q=80',
    availableDays: ['Tue', 'Wed', 'Fri', 'Sat'],
    timeSlots: [
      '09:00 AM', '09:45 AM', '10:30 AM', '11:30 AM', 
      '02:00 PM', '03:00 PM', '04:00 PM'
    ]
  },
  {
    id: 'doc-006',
    name: 'Dr. Frank Meten, MS, MCh',
    specialty: 'Senior Orthopedic & Joint Surgeon',
    department: 'Orthopedics & Sports Medicine',
    hospital: 'Star Hospitals Orthopedic Center',
    roomNumber: 'Cabin 502, 5th Floor (Surgical Suite)',
    experience: '22+ Years Experience',
    rating: 4.96,
    consultationFee: '₹1,600',
    avatar: 'https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=150&auto=format&fit=crop&q=80',
    availableDays: ['Mon', 'Wed', 'Thu', 'Sat'],
    timeSlots: [
      '10:15 AM', '11:00 AM', '11:45 AM', 
      '02:30 PM', '03:15 PM', '04:00 PM', '05:00 PM'
    ]
  }
];
