import { Link } from 'react-router-dom';
import { Home, Search } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFoundPage() {
  return (
    <div className="section-container py-20 min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-2xl mx-auto"
      >
        <div className="mb-8">
          <Search size={120} className="text-gray-600 mx-auto mb-4" />
          <h1 className="text-6xl md:text-8xl font-bold text-gradient mb-4">404</h1>
          <h2 className="text-3xl md:text-4xl font-semibold mb-4">Página no encontrada</h2>
          <p className="text-gray-400 text-lg mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="space-x-4">
          <Link to="/" className="btn-primary inline-flex items-center space-x-2">
            <Home size={20} />
            <span>Volver al Inicio</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}



