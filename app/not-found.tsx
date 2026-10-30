import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#F8FAFC] text-[#0F172A]">
      <h2 className="text-2xl font-black mb-2">Página não encontrada</h2>
      <p className="text-sm text-[#64748B] mb-4">A página que você procura não existe ou foi movida.</p>
      <Link
        href="/"
        className="px-4 py-2 bg-[#2563EB] text-white text-xs font-bold rounded-xl shadow-md hover:bg-[#1D4ED8] transition-colors"
      >
        Voltar para o Início
      </Link>
    </div>
  );
}
