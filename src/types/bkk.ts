export interface Vacancy {
  id: string;
  title: string;
  company: string;
  location: string;
  targetJurusan: string[];
  description: string;
  deadline: string;
  status: string;
  createdAt?: any;
}

export interface Application {
  id: string;
  vacancyId?: string;
  jobId?: string;
  vacancyTitle?: string;
  nama?: string;
  fullName?: string;
  name?: string;
  namaLengkap?: string;
  email?: string;
  whatsapp?: string;
  phone?: string;
  noHp?: string;
  jurusan?: string;
  tahunLulus?: string;
  linkCv?: string;
  cvLink?: string;
  cvUrl?: string;
  cv?: string;
  fileCv?: string;
  resumeUrl?: string;
  driveCvLink?: string;
  driveLink?: string;
  link?: string;
  createdAt?: any;
}