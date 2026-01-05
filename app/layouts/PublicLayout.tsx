import { ReactNode } from 'react';
import Navbar from '../components/Navbar';

interface PublicLayoutProps {
  children: ReactNode;
}

export default function PublicLayout({ children }: PublicLayoutProps) {
  return (
    <div className="min-h-screen bg-[#F7FAFC]">
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-sm border-b border-[#E6EEF2]">
        <Navbar />
      </header>
      <main>{children}</main>
    </div>
  );
}
