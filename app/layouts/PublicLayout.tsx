import { ReactNode } from 'react';
import Navbar from '../components/Navbar';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-gray-100">
        <Navbar />
      </header>
      <main>{children}</main>
    </div>
  );
}

