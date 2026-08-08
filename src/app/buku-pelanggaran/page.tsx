import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Buku Pelanggaran Siswa | SMK Al Kaaffah',
  description: 'Sistem Informasi Layanan Buku Pelanggaran Siswa SMK Al Kaaffah Kepanjen.',
};

export default function BukuPelanggaranPage() {
  const targetUrl = "https://bukupelanggaransiswaak.freedev.app/login.php";

  return (
    <div className="w-full min-h-screen bg-slate-50 flex flex-col">
      {/* Header Kecil / Breadcrumb Opsional */}
      <div className="bg-white border-b px-4 py-3 sm:px-8 flex items-center justify-between shadow-sm">
        <h1 className="text-lg font-bold text-slate-800">
          Sistem Buku Pelanggaran Siswa
        </h1>
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md font-medium transition"
        >
          Buka di Tab Baru ↗
        </a>
      </div>

      {/* Frame Container */}
      <div className="flex-1 w-full relative min-h-[calc(100vh-60px)]">
        <iframe
          src={targetUrl}
          title="Buku Pelanggaran Siswa SMK Al Kaaffah"
          className="absolute top-0 left-0 w-full h-full border-0"
          // Permission standar agar form/login di dalam iframe berjalan lancar
          allow="geolocation; microphone; camera; clipboard-write;"
          sandbox="allow-forms allow-modals allow-popups allow-same-origin allow-scripts"
        />
      </div>
    </div>
  );
}