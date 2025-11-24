import { MotionFadeIn } from '@/components/ui/MotionFadeIn';
import { siteConfig } from '@/config/siteConfig';

export default function PrivacyPolicyPage() {
  return (
    <div className="section-container py-20">
      <MotionFadeIn>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gradient">
            Política de Privacidad
          </h1>

          <div className="card-glow p-8 space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Información que Recopilamos</h2>
              <p>
                En {siteConfig.name}, recopilamos la siguiente información:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
                <li>Nickname proporcionado por el usuario</li>
                <li>Puntuaciones de juego</li>
                <li>Datos de navegación y uso del sitio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Uso de la Información</h2>
              <p>
                Utilizamos la información recopilada para:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
                <li>Mostrar rankings y tablas de posiciones</li>
                <li>Mejorar la experiencia del usuario</li>
                <li>Analizar el uso del sitio</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Cookies y Tecnologías Similares</h2>
              <p>
                Utilizamos cookies y tecnologías similares para mejorar la funcionalidad del sitio
                y personalizar la experiencia del usuario.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Google AdSense</h2>
              <p>
                Este sitio utiliza Google AdSense para mostrar anuncios. Google puede usar cookies
                para personalizar anuncios según tus intereses. Puedes optar por no recibir anuncios
                personalizados visitando la configuración de anuncios de Google.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Seguridad</h2>
              <p>
                Implementamos medidas de seguridad para proteger tu información, pero ningún método
                de transmisión por Internet es 100% seguro.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. Contacto</h2>
              <p>
                Si tienes preguntas sobre esta política de privacidad, puedes contactarnos a través
                de nuestra página de <a href="/contact" className="text-blue-400 hover:text-blue-300">contacto</a>.
              </p>
            </section>

            <section>
              <p className="text-sm text-gray-400 mt-8">
                Última actualización: {new Date().toLocaleDateString('es-ES', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </section>
          </div>
        </div>
      </MotionFadeIn>
    </div>
  );
}


