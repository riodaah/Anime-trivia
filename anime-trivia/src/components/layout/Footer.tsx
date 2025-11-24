import { Link } from 'react-router-dom';
import { siteConfig } from '@/config/siteConfig';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-dark-surface border-t border-gray-800 mt-20">
      <div className="section-container py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-xl font-bold text-gradient mb-4">LuffySunny</h3>
            <p className="text-gray-400 text-sm">
              Demuestra cuánto sabes de anime. Compite globalmente.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-semibold mb-4">Navegación</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Inicio
                </Link>
              </li>
              <li>
                <Link to="/play" className="text-gray-400 hover:text-white transition">
                  Jugar
                </Link>
              </li>
              <li>
                <Link to="/ranking" className="text-gray-400 hover:text-white transition">
                  Ranking
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/privacy-policy" className="text-gray-400 hover:text-white transition">
                  Política de Privacidad
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-gray-400 hover:text-white transition">
                  Términos y Condiciones
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="font-semibold mb-4">Información</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link to="/how-it-works" className="text-gray-400 hover:text-white transition">
                  Cómo Funciona
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-8 border-t border-gray-800 text-center text-sm text-gray-400">
          <p>© {currentYear} {siteConfig.name}. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

