import { Layout } from './components/Layout';
import './App.css';

function App() {
  return (
    <Layout>
      <h2>A sua EXIVA virtual</h2>
      <p>Este é o conteúdo principal que aparece dentro do layout.</p>

      <div className="card">
        <p>
          A estrutura já está organizada e pronta para receber novas páginas.
        </p>
      </div>
    </Layout>
  );
}

export default App;
