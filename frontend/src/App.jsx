import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Prediction from './pages/Prediction';
import ModelInfo from './pages/ModelInfo';
import About from './pages/About';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Sidebar />

        {/* Main content */}
        <main className="lg:ml-64 min-h-screen">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pt-16 lg:pt-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/predict" element={<Prediction />} />
              <Route path="/model" element={<ModelInfo />} />
              <Route path="/about" element={<About />} />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}
