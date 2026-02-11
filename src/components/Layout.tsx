import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="layout-container">
      <header style={{ borderBottom: '1px solid #ccc', padding: '1rem' }}>
        <h1>Tibia Scout</h1>
      </header>

      <main style={{ padding: '2rem' }}>{children}</main>
    </div>
  );
}
