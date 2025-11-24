import { Link } from 'react-router-dom';
import { siteConfig } from '@/config/siteConfig';
import { Github, Twitter, Mail, Heart, Sparkles, Shield, FileText, Phone } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { PolicyModal } from '@/components/ui/PolicyModal';

const TikTokIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

const PrivacyContent = () => (
  <div className="prose prose-invert max-w-none">
    <h3 className="text-2xl font-bold text-white mb-4">Política de Privacidad</h3>
    <p className="text-gray-300 mb-4">
      En LuffySunny, nos tomamos muy en serio la privacidad de nuestros usuarios. Esta política describe cómo recopilamos, usamos y protegemos tu información.
    </p>
    <h4 className="text-xl font-semibold text-white mb-3">1. Información que Recopilamos</h4>
    <p className="text-gray-300 mb-4">
      Recopilamos información que nos proporcionas directamente, como tu nombre de usuario, país y puntuaciones del juego. También recopilamos información automáticamente sobre tu uso del sitio mediante cookies y tecnologías similares.
    </p>
    <h4 className="text-xl font-semibold text-white mb-3">2. Uso de la Información</h4>
    <p className="text-gray-300 mb-4">
      Utilizamos la información para proporcionar y mejorar nuestros servicios, mostrar rankings, personalizar tu experiencia y comunicarnos contigo.
    </p>
    <h4 className="text-xl font-semibold text-white mb-3">3. Google AdSense</h4>
    <p className="text-gray-300 mb-4">
      Este sitio utiliza Google AdSense para mostrar anuncios. Google puede usar cookies para ofrecer anuncios basados en tus intereses. Puedes obtener más información en la política de privacidad de Google.
    </p>
    <h4 className="text-xl font-semibold text-white mb-3">4. Protección de Datos</h4>
    <p className="text-gray-300 mb-4">
      Implementamos medidas de seguridad para proteger tu información contra acceso no autorizado, alteración o destrucción.
    </p>
  </div>
);

const TermsContent = () => (
  <div className="prose prose-invert max-w-none">
    <h3 className="text-2xl font-bold text-white mb-4">Términos y Condiciones</h3>
    <p className="text-gray-300 mb-4">
      Al utilizar LuffySunny, aceptas estos términos y condiciones. Por favor, léelos cuidadosamente.
    </p>
    <h4 className="text-xl font-semibold text-white mb-3">1. Uso del Servicio</h4>
    <p className="text-gray-300 mb-4">
      LuffySunny es una plataforma de trivia de anime. Debes tener al menos 13 años para usar este servicio. Te comprometes a usar el sitio de manera responsable y legal.
    </p>
    <h4 className="text-xl font-semibold text-white mb-3">2. Contenido del Usuario</h4>
    <p className="text-gray-300 mb-4">
      Al enviar tu nombre de usuario y puntuaciones, nos otorgas permiso para mostrarlos públicamente en los rankings.
    </p>
    <h4 className="text-xl font-semibold text-white mb-3">3. Propiedad Intelectual</h4>
    <p className="text-gray-300 mb-4">
      Todo el contenido de anime, incluyendo imágenes y preguntas, es propiedad de sus respectivos dueños. Este sitio es solo con fines educativos y de entretenimiento.
    </p>
    <h4 className="text-xl font-semibold text-white mb-3">4. Limitación de Responsabilidad</h4>
    <p className="text-gray-300 mb-4">
      LuffySunny se proporciona "tal cual". No garantizamos que el servicio esté libre de errores o interrupciones.
    </p>
  </div>
);

export const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [privacyOpen, setPrivacyOpen] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);

  const socialLinks = [
    { icon: <TikTokIcon />, href: 'https://tiktok.com/@payasin889', label: 'TikTok', color: 'hover:text-pink-400' },
    { icon: <Twitter size={20} />, href: '#', label: 'Twitter', color: 'hover:text-blue-400' },
    { icon: <Github size={20} />, href: '#', label: 'GitHub', color: 'hover:text-purple-400' },
    { icon: <Mail size={20} />, href: '#', label: 'Email', color: 'hover:text-green-400' },
  ];

  return (
    <>
      <footer className="relative overflow-hidden bg-gradient-to-b from-dark-bg to-dark-surface border-t border-white/10 mt-20 py-16">
        {/* Efectos de fondo */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl" />
        </div>

        <div className="section-container relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
            {/* Columna 1: Logo y descripción (5 cols) */}
            <div className="md:col-span-5">
              <motion.div
                whileHover={{ scale: 1.05 }}
                className="flex items-center space-x-3 mb-6"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  <Sparkles size={24} className="text-white" />
                </div>
                <h3 className="text-3xl font-black">
                  <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    {siteConfig.name}
                  </span>
                </h3>
              </motion.div>
              <p className="text-gray-400 mb-6 leading-relaxed">
                La mejor plataforma de trivia de anime. Pon a prueba tus conocimientos y compite con jugadores de todo el mundo. ¡Conviértete en el rey de los piratas del anime! 🏴‍☠️
              </p>
              <div className="flex space-x-4">
                {socialLinks.map((social) => (
                  <motion.a
                    key={social.label}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className={`p-3 rounded-xl bg-white/5 text-gray-400 ${social.color} transition-colors backdrop-blur-sm border border-white/10`}
                    aria-label={social.label}
                  >
                    {social.icon}
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Columna 2: Enlaces rápidos (3 cols) */}
            <div className="md:col-span-3">
              <h4 className="font-bold mb-6 text-white text-lg flex items-center space-x-2">
                <Sparkles size={18} className="text-blue-400" />
                <span>Enlaces</span>
              </h4>
              <ul className="space-y-3">
                {[
                  { to: '/', label: 'Inicio' },
                  { to: '/play', label: 'Jugar Ahora' },
                  { to: '/ranking', label: 'Rankings' },
                  { to: '/blog', label: 'Blog de Anime' },
                  { to: '/how-it-works', label: 'Cómo Funciona' },
                ].map((link) => (
                  <li key={link.to}>
                    <Link
                      to={link.to}
                      className="text-gray-400 hover:text-blue-400 transition-colors flex items-center space-x-2 group"
                    >
                      <span className="w-0 group-hover:w-2 h-0.5 bg-blue-400 transition-all duration-300" />
                      <span>{link.label}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Columna 3: Legal (4 cols) */}
            <div className="md:col-span-4">
              <h4 className="font-bold mb-6 text-white text-lg flex items-center space-x-2">
                <Shield size={18} className="text-purple-400" />
                <span>Legal & Contacto</span>
              </h4>
              <ul className="space-y-3">
                <li>
                  <button
                    onClick={() => setPrivacyOpen(true)}
                    className="text-gray-400 hover:text-purple-400 transition-colors flex items-center space-x-2 group"
                  >
                    <FileText size={16} className="text-gray-500 group-hover:text-purple-400" />
                    <span>Política de Privacidad</span>
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setTermsOpen(true)}
                    className="text-gray-400 hover:text-purple-400 transition-colors flex items-center space-x-2 group"
                  >
                    <FileText size={16} className="text-gray-500 group-hover:text-purple-400" />
                    <span>Términos y Condiciones</span>
                  </button>
                </li>
                <li>
                  <Link
                    to="/contact"
                    className="text-gray-400 hover:text-purple-400 transition-colors flex items-center space-x-2 group"
                  >
                    <Phone size={16} className="text-gray-500 group-hover:text-purple-400" />
                    <span>Contacto</span>
                  </Link>
                </li>
              </ul>

              {/* Newsletter/CTA */}
              <div className="mt-8 p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10">
                <p className="text-sm text-gray-300 mb-3">
                  ¿Quieres recibir actualizaciones?
                </p>
                <a
                  href="https://tiktok.com/@payasin889"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300 font-semibold flex items-center space-x-1"
                >
                  <span>Síguenos en TikTok</span>
                  <TikTokIcon />
                </a>
              </div>
            </div>
          </div>

          {/* Bottom bar */}
          <div className="border-t border-white/10 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <p className="text-gray-400 text-sm flex items-center space-x-2">
                <span>© {currentYear} {siteConfig.name}.</span>
                <span className="hidden md:inline">•</span>
                <span className="flex items-center space-x-1">
                  Hecho con <Heart size={14} className="text-red-500 mx-1" /> para los fans del anime
                </span>
              </p>
              <div className="flex items-center space-x-4 text-sm text-gray-400">
                <span className="px-3 py-1 rounded-full bg-white/5 border border-white/10">
                  v1.0.0
                </span>
                <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 border border-green-500/30 flex items-center space-x-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                  <span>En línea</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <PolicyModal
        isOpen={privacyOpen}
        onClose={() => setPrivacyOpen(false)}
        title="Política de Privacidad"
      >
        <PrivacyContent />
      </PolicyModal>

      <PolicyModal
        isOpen={termsOpen}
        onClose={() => setTermsOpen(false)}
        title="Términos y Condiciones"
      >
        <TermsContent />
      </PolicyModal>
    </>
  );
};

