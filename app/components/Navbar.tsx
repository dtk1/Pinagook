import Link from 'next/link';
import Button from './Button';

export default function Navbar() {
  return (
    <nav className="w-full max-w-[1440px] mx-auto px-8 py-6 flex items-center justify-between">
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-[#0EA5B7] flex items-center justify-center">
          <span className="text-white font-bold text-lg">🐬</span>
        </div>
        <span className="text-xl font-semibold text-[#0F172A]">Pinagook</span>
      </Link>
      
      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-[#475569] hover:text-[#0EA5B7] transition-colors">Features</a>
        <a href="#templates" className="text-[#475569] hover:text-[#0EA5B7] transition-colors">Templates</a>
        <a href="#pricing" className="text-[#475569] hover:text-[#0EA5B7] transition-colors">Pricing</a>
        <a href="#blog" className="text-[#475569] hover:text-[#0EA5B7] transition-colors">Blog</a>
        <a href="#contact" className="text-[#475569] hover:text-[#0EA5B7] transition-colors">Contact</a>
      </div>

      <div className="flex items-center gap-4">
        <Link href="/login" className="text-[#475569] hover:text-[#0EA5B7] transition-colors hidden md:block">Log in</Link>
        <Link href="/register">
          <Button variant="primary">Start free</Button>
        </Link>
      </div>
    </nav>
  );
}

