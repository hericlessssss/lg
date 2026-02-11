import { Layout } from './components/Layout';
import './App.css';

function App() {
  return (
    <Layout>
      {/* Aqui estava o erro: tinha um <h2> extra antes */}
      <h2 className="text-3xl font-bold text-blue-600 underline">
        A sua EXIVA virtual
      </h2>
      
      <p>Este é o conteúdo principal que aparece dentro do layout.</p>

      <div className="mt-6 p-4 bg-gray-800 rounded-xl border border-gray-700 shadow-lg">
  <p className="text-gray-300">
    A estrutura já está organizada e pronta para receber novas páginas.
  </p>
</div>
    </Layout>
  );
}

export default App;