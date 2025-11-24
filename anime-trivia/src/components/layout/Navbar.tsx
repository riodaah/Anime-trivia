import { Link, useLocation } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState, useEffect } from 'react';

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { scrollY } = useScroll();
  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ["rgba(10, 10, 15, 0)", "rgba(10, 10, 15, 0.95)"]
  );

  const navLinks = [
    { path: '/', label: 'Inicio' },
    { path: '/play', label: 'Jugar' },
    { path: '/ranking', label: 'Ranking' },
    { path: '/blog', label: 'Blog' },
  ];

  const isActive = (path: string) => location.pathname === path;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <motion.nav
      style={{ backgroundColor }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'backdrop-blur-xl border-b border-white/10 shadow-2xl' : 'backdrop-blur-sm'
      }`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo con imagen del sombrero */}
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
              transition={{ duration: 0.6 }}
              className="relative w-10 h-10 rounded-lg overflow-hidden shadow-lg group-hover:shadow-yellow-500/50"
            >
              <img 
                src="/logo192.png" 
                alt="LuffySunny Logo" 
                className="w-full h-full object-cover"
              />
            </motion.div>
            <motion.span
              className="text-xl font-black hidden sm:block"
              whileHover={{ scale: 1.05 }}
            >
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Luffy
              </span>
              <span className="text-white">Sunny</span>
            </motion.span>
          </Link>

          {/* Desktop Menu con efectos glass */}
          <div className="hidden md:flex items-center space-x-1">
            {navLinks.filter(link => link.path !== '/play').map((link, index) => (
              <Link
                key={link.path}
                to={link.path}
                className="relative group"
              >
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`relative px-3 py-2 rounded-lg text-sm font-semibold transition-all duration-300 ${
                    isActive(link.path)
                      ? 'text-white'
                      : 'text-gray-300 hover:text-white'
                  }`}
                >
                  {isActive(link.path) && (
                    <motion.div
                      layoutId="navbar-bg"
                      className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg shadow-lg"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  {!isActive(link.path) && (
                    <div className="absolute inset-0 bg-white/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}
                  <span className="relative z-10">{link.label}</span>
                  
                  {isActive(link.path) && (
                    <motion.div
                      className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-white rounded-full"
                      layoutId="navbar-dot"
                    />
                  )}
                </motion.div>
              </Link>
            ))}
            
            {/* Botón JUGAR grande y llamativo */}
            <Link to="/play">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`relative overflow-hidden px-6 py-2.5 ml-2 rounded-xl font-black text-base shadow-xl transition-all duration-300 ${
                  isActive('/play')
                    ? 'bg-gradient-to-r from-yellow-500 to-orange-600 text-white shadow-yellow-500/50'
                    : 'bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-green-500/50 hover:shadow-green-500/70'
                }`}
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                  <span>JUGAR</span>
                </span>
                <motion.div
                  className="absolute inset-0 bg-white/20"
                  animate={{ 
                    x: ['-100%', '100%'],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    repeatDelay: 1,
                  }}
                />
              </motion.button>
            </Link>
          </div>

          {/* Mobile Menu Button con animación */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className="md:hidden text-white p-2 rounded-lg hover:bg-white/10 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            <motion.div
              animate={{ rotate: isOpen ? 180 : 0 }}
              transition={{ duration: 0.3 }}
            >
              {isOpen ? <X size={28} /> : <Menu size={28} />}
            </motion.div>
          </motion.button>
        </div>

        {/* Mobile Menu mejorado */}
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden py-4 border-t border-white/10"
          >
            {navLinks.map((link, index) => (
              <motion.div
                key={link.path}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                {link.path === '/play' ? (
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className="block mx-4 my-2 px-6 py-4 rounded-2xl font-black text-lg text-center bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-lg"
                  >
                    <span className="flex items-center justify-center space-x-2">
                      <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                      <span>JUGAR AHORA</span>
                    </span>
                  </Link>
                ) : (
                  <Link
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={`block px-4 py-3 rounded-lg font-semibold transition-all ${
                      isActive(link.path)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    {link.label}
                  </Link>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
};

