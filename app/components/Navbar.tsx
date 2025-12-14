import Button from './Button';

export default function Navbar() {
  return (
    <nav className="w-full max-w-[1440px] mx-auto px-8 py-6 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#0ea5e9] to-[#14b8a6] flex items-center justify-center">
          <span className="text-white font-bold text-lg">🐬</span>
        </div>
        <span className="text-xl font-semibold text-gray-900">Pinagook</span>
      </div>
      
      <div className="hidden md:flex items-center gap-8">
        <a href="#features" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Features</a>
        <a href="#templates" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Templates</a>
        <a href="#pricing" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Pricing</a>
        <a href="#blog" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Blog</a>
        <a href="#contact" className="text-gray-600 hover:text-[#0ea5e9] transition-colors">Contact</a>
      </div>

      <div className="flex items-center gap-4">
        <a href="#login" className="text-gray-600 hover:text-[#0ea5e9] transition-colors hidden md:block">Log in</a>
        <Button variant="primary">Start free</Button>
      </div>
    </nav>
  );
}

