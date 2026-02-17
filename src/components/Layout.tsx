import { Outlet } from 'react-router-dom';

export function Layout() {
  return (
    <div className="layout-container">
      <header style={{ borderBottom: '1px solid #ccc', padding: '1rem' }}>
        <h1>Tibia Scout</h1>
      </header>

      <main style={{ padding: '2rem' }}>
        {/* O Outlet é onde as páginas Login, Register e Dashboard serão renderizadas */}
        <Outlet />
      </main>
    </div>
  );
}
