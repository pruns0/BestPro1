export interface User {
  id: string;
  name: string;
  role: 'Admin' | 'TU' | 'Coordinator' | 'Staff';
  password: string;
}

export interface Report {
  id: string;
  noSurat: string;
  hal: string;
  layanan: string;
  status: 'In Progress' | 'Completed' | 'Revision' | 'Document Verification' | 'Assigned to Staff';
  createdBy: string;
  createdAt: string;
  assignedCoordinators: string[];
  assignedStaff: string[];
  documents: UploadedFile[];
  lembarDisposisi: LembarDisposisi;
  documentVerification?: DocumentVerification;
  tasks?: Task[];
  progress: number;
  history: WorkflowHistory[];
  notes?: string;
  revisionNotes?: string;
}

export interface LembarDisposisi {
  sifat: string[];
  derajat: string[];
  noAgenda: string;
  kelompokAsalSurat: string;
  agendaSestama: string;
  dari: string;
  tglAgenda: string;
  tanggalSurat: string;
}

export interface UploadedFile {
  id: string;
  name: string;
  url: string;
  type: string;
  uploadedAt: string;
}

export interface DocumentVerification {
  [key: string]: 'Ada' | 'Tidak Ada';
}

export interface Task {
  id: string;
  staffId: string;
  items: string[];
  completed: boolean;
  completedAt?: string;
}

export interface WorkflowHistory {
  id: string;
  action: string;
  actor: string;
  timestamp: string;
  notes?: string;
}

export const LAYANAN_OPTIONS = [
  'Layanan Perpanjangan Hubungan Kerja PPPK',
  'Layanan Pemutusan Hubungan Kerja PPPK',
  'Layanan Peninjauan Masa Kerja PNS',
  'Layanan Pengangkatan PNS',
  'Layanan Pemensiunan dan Pemberhentian PNS',
  'Layanan Penerbitan SK Tugas Belajar',
  'Layanan Kenaikan Pangkat',
  'Layanan Uji Kompetensi dan Perpindahan Jabatan Fungsional',
  'Layanan Penerbitan Rekomendasi Jabatan Fungsional Binaan KLH/BPLH',
  'Layanan Kenaikan Jenjang Jabatan Fungsional',
  'Layanan Pengangkatan Kembali ke dalam Jabatan Fungsional',
  'Layanan Perpindahan Kelas Jabatan Pelaksana',
  'Layanan Pencantuman Gelar',
  'Layanan Mutasi/Alih Tugas Lingkup KLH/BPLH',
  'Layanan Penugasan PNS pada Instansi Pemerintah dan di Luar Instansi',
  'Layanan Izin untuk Melakukan Perceraian PNS',
  'Layanan Fasilitasi Penganugerahan Tanda Kehormatan oleh Presiden',
  'Layanan Cuti di Luar Tanggungan Negara (CLTN)',
  'Layanan Kartu Istri/Kartu Suami',
  'Layanan Permintaan Data Kepegawaian SIMPEG',
  'Layanan Ralat Nama/NIP pada Aplikasi SIMPEG/SIASN',
  'Layanan Pelatihan Kepemimpinan',
  'Layanan Pengelolaan LHKPN',
  'Layanan Sosialisasi Kebijakan Bidang SDM dan Organisasi',
  'Layanan Perpindahan Jabatan',
  'Layanan Pemberhentian Jabatan Fungsional',
  'Layanan Permohonan Pengambilan Sumpah PNS untuk Koordinator UPT',
  'Layanan Pelantikan Jabatan Fungsional'
];

export const COORDINATORS = [
  'Suwarti, S.H',
  'Achamd Evianto',
  'Adi Sulaksono',
  'Yosi Yosandi'
];

export const STAFF_MEMBERS = [
  'Budi Santoso', 'Sari Wijaya', 'Ahmad Fauzi', 'Dewi Kartika',
  'Eko Prasetyo', 'Fitri Handayani', 'Gunawan Susilo', 'Hesti Purnama',
  'Indra Kurniawan', 'Joko Widodo', 'Kartika Sari', 'Lestari Wulan',
  'Muhammad Ridwan', 'Nina Safitri', 'Oka Mahendra', 'Puteri Salmah',
  'Qori Rahman', 'Rita Marlina', 'Slamet Riyadi', 'Tuti Handayani',
  'Umar Bakri', 'Vina Melati', 'Wahyu Nugroho', 'Yanti Kusuma'
];

export const TODO_ITEMS = [
  'Jadwalkan/Agendakan',
  'Bahas dengan saya',
  'Untuk ditindaklanjuti',
  'Untuk diketahui',
  'Untuk dipelajari',
  'Untuk diarsipkan',
  'Koordinasi dengan unit lain',
  'Perlu persetujuan atasan',
  'Siapkan konsep jawaban',
  'Lainnya'
];

export const DOCUMENT_REQUIREMENTS: Record<string, string[]> = {
  'Layanan Perpanjangan Hubungan Kerja PPPK': [
    'SK PPPK',
    'Perjanjian Kerja PPPK',
    'SKP 1 tahun terakhir',
    'Surat Pertimbangan Perpanjangan dari Unit Kerja'
  ],
  'Layanan Pemutusan Hubungan Kerja PPPK': [
    'SK Pengangkatan PPPK',
    'Perjanjian Kerja PPPK',
    'SKP 1 tahun terakhir',
    'Surat pernyataan (disiplin & pidana)',
    'Dokumen tambahan sesuai alasan'
  ],
  'Layanan Peninjauan Masa Kerja PNS': [
    'Surat usul Kabag TU/KSBTU',
    'SK CPNS',
    'SK PNS',
    'SK Pangkat terakhir',
    'SK kontrak/angkat',
    'Paklaring',
    'Slip gaji/pengalaman kerja',
    'Ijazah saat melamar'
  ],
  'Layanan Pengangkatan PNS': [
    'SK CPNS',
    'SK PNS',
    'SK Pangkat terakhir',
    'Ijazah & transkrip',
    'DRH',
    'Rekomendasi teknis'
  ],
  'Layanan Pemensiunan dan Pemberhentian PNS': [
    'SK CPNS',
    'SK PNS',
    'SK Pangkat terakhir',
    'SKP terakhir',
    'Surat permohonan & persetujuan atasan',
    'Dokumen pensiun (format BKN)',
    'Surat bebas tanggungan'
  ],
  'Layanan Penerbitan SK Tugas Belajar': [
    'Surat usulan',
    'SK CPNS',
    'SK PNS',
    'SK Pangkat & Jabatan terakhir',
    'SKP 2 tahun terakhir',
    'Ijazah & transkrip',
    'Akreditasi prodi',
    'Surat penerimaan kampus/sponsor',
    'Perjanjian belajar'
  ],
  'Layanan Kenaikan Pangkat': [
    'Surat usul unit',
    'SK CPNS',
    'SK PNS',
    'SK Pangkat terakhir',
    'SKP 2 tahun terakhir',
    'Ijazah (untuk penyesuaian)',
    'Daftar riwayat hidup',
    'Dokumen sesuai jenis KP'
  ]
  // Add more document requirements as needed
};