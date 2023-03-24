import Navigation from '@/components/nav';
import { ReactNode } from 'react';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  );
}
