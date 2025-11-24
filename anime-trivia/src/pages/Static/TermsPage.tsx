import { MotionFadeIn } from '@/components/ui/MotionFadeIn';
import { siteConfig } from '@/config/siteConfig';

export default function TermsPage() {
  return (
    <div className="section-container py-20">
      <MotionFadeIn>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-8 text-gradient">
            Términos y Condiciones
          </h1>

          <div className="card-glow p-8 space-y-6 text-gray-300 leading-relaxed">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">1. Aceptación de los Términos</h2>
              <p>
                Al acceder y usar {siteConfig.name}, aceptas cumplir con estos términos y condiciones.
                Si no estás de acuerdo, no uses el sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">2. Uso del Servicio</h2>
              <p>El servicio está destinado para uso personal y no comercial. No debes:</p>
              <ul className="list-disc list-inside mt-2 space-y-2 ml-4">
                <li>Intentar manipular o hacer trampa en el juego</li>
                <li>Usar bots o scripts automatizados</li>
                <li>Publicar contenido ofensivo o inapropiado</li>
                <li>Violar cualquier ley o regulación</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">3. Contenido del Usuario</h2>
              <p>
                Al proporcionar un nickname, eres responsable de que no infrinja derechos de terceros
                ni sea ofensivo o inapropiado.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">4. Propiedad Intelectual</h2>
              <p>
                Todo el contenido del sitio, incluyendo pero no limitado a texto, gráficos, logos,
                y software, es propiedad de {siteConfig.name} o sus licenciantes.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">5. Limitación de Responsabilidad</h2>
              <p>
                {siteConfig.name} no se hace responsable de daños directos, indirectos, incidentales
                o consecuentes resultantes del uso o la imposibilidad de usar el servicio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">6. Modificaciones</h2>
              <p>
                Nos reservamos el derecho de modificar estos términos en cualquier momento.
                Los cambios entrarán en vigor al publicarse en el sitio.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-white">7. Contacto</h2>
              <p>
                Para preguntas sobre estos términos, contáctanos a través de nuestra página de
                <a href="/contact" className="text-blue-400 hover:text-blue-300"> contacto</a>.
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



