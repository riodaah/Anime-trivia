import { MotionFadeIn } from '@/components/ui/MotionFadeIn';
import { Mail, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ContactPage() {
  return (
    <div className="section-container py-20">
      <MotionFadeIn>
        <div className="max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-12 text-gradient">
            Contacto
          </h1>

          <div className="card-glow p-8">
            <p className="text-gray-300 text-center mb-8">
              ¿Tienes preguntas, sugerencias o comentarios? Estamos aquí para ayudarte.
            </p>

            <div className="space-y-6">
              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-4 p-4 bg-dark-surface rounded-lg border border-gray-700"
              >
                <Mail size={24} className="text-blue-400" />
                <div>
                  <h3 className="font-semibold text-white">Email</h3>
                  <a href="mailto:contacto@luffysunny.com" className="text-blue-400 hover:text-blue-300">
                    contacto@luffysunny.com
                  </a>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-4 p-4 bg-dark-surface rounded-lg border border-gray-700"
              >
                <MessageSquare size={24} className="text-blue-400" />
                <div>
                  <h3 className="font-semibold text-white">Redes Sociales</h3>
                  <a
                    href="https://tiktok.com/@luffysunny"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 hover:text-blue-300"
                  >
                    Síguenos en TikTok
                  </a>
                </div>
              </motion.div>
            </div>

            <div className="mt-8 p-4 bg-blue-900/20 border border-blue-800 rounded-lg">
              <p className="text-sm text-gray-300">
                <strong>Nota:</strong> Por favor, ten en cuenta que podemos tardar hasta 48 horas
                en responder a tu consulta.
              </p>
            </div>
          </div>
        </div>
      </MotionFadeIn>
    </div>
  );
}


