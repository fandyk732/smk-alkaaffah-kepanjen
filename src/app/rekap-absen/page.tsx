import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Software Rekap Absensi | SMK Al Kaaffah Kepanjen',
  description: 'Portal Resmi Layanan Rekap Absensi Guru dan Karyawan SMK Al Kaaffah Kepanjen.',
};

export default function RekapAbsenPage() {
  const targetUrl = "https://rekap-absen-alkaaffah.vercel.app";

  return (
    <div className="w-full min-h-[85vh] bg-slate-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl border border-slate-100 p-6 sm:p-8 text-center space-y-6">
        
        {/* Icon & Badge */}
        <div className="mx-auto w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center text-3xl shadow-inner">
          📋
        </div>

        {/* Info Title */}
        <div className="space-y-2">
          <h1 className="text-xl font-bold text-slate-800">
            Sistem Rekap Absensi
          </h1>
          <p className="text-xs text-slate-500 leading-relaxed">
            Layanan pencatatan & monitoring kehadiran Guru & Karyawan SMK Al Kaaffah Kepanjen.
          </p>
        </div>

        {/* Security Notice Box */}
        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 text-left text-xs text-slate-600 space-y-2">
          <div className="flex items-center gap-2 font-semibold text-slate-700">
            <span>🔒</span>
            <span>Akses Aplikasi Aman</span>
          </div>
          <p>
            Demi keamanan sesi data dan kebijakan privasi browser, aplikasi ini dibuka langsung melalui portal server resmi Tata Usaha.
          </p>
        </div>

        {/* Action Button */}
        <a
          href={targetUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 px-6 rounded-xl shadow-lg shadow-emerald-600/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
        >
          <span>Masuk ke Sistem Rekap Absensi</span>
          <span className="text-lg">↗</span>
        </a>

        {/* Footer info */}
        <p className="text-[11px] text-slate-400">
          Tim Tata Usaha © SMK Al Kaaffah Kepanjen
        </p>

      </div>
    </div>
  );
}