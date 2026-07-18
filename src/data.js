export const seedStudents = [
  { id:'s1', nis:'5001', nisn:'0123456789', nik:'3201010101150001', gender:'P', name:'Aqilah Mahfuzhah Djawas', birthPlace:'Bandung', birthDate:'2015-04-12', parent:'Fahmi Djawas', phone:'081234567890', address:'Bandung, Jawa Barat' },
  { id:'s2', nis:'5002', nisn:'0123456790', nik:'3201010201150002', gender:'L', name:'Raka Pratama', birthPlace:'Cimahi', birthDate:'2015-06-23', parent:'Budi Pratama', phone:'081234567891', address:'Cimahi, Jawa Barat' },
  { id:'s3', nis:'5003', nisn:'0123456791', nik:'3201010301150003', gender:'P', name:'Naila Putri', birthPlace:'Sumedang', birthDate:'2015-08-04', parent:'Siti Aminah', phone:'081234567892', address:'Sumedang, Jawa Barat' }
]

export const seedAttendance = [
  { id:'a1', date:'2026-07-13', studentId:'s1', status:'Hadir', note:'' },
  { id:'a2', date:'2026-07-13', studentId:'s2', status:'Sakit', note:'Surat orang tua' },
  { id:'a3', date:'2026-07-13', studentId:'s3', status:'Hadir', note:'' }
]

export const seedGrades = [
  { id:'g1', studentId:'s1', subject:'Matematika', type:'UH', score:88, semester:'Ganjil', note:'Baik' },
  { id:'g2', studentId:'s1', subject:'Bahasa Indonesia', type:'Praktik', score:92, semester:'Ganjil', note:'Sangat baik' },
  { id:'g3', studentId:'s2', subject:'Matematika', type:'UH', score:78, semester:'Ganjil', note:'Perlu latihan' }
]

export const initialSettings = {
  school:'SD Negeri Contoh', className:'5B', teacher:'Wali Kelas 5B', year:'2026/2027',
  teacherUsername:'guru', teacherPassword:'kelas5b', accent:'#155e75'
}
