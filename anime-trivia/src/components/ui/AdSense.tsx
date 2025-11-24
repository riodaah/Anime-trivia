import { useEffect } from 'react';

interface AdSenseProps {
  adSlot: string;
  adFormat?: 'auto' | 'horizontal' | 'vertical' | 'rectangle';
  style?: React.CSSProperties;
  className?: string;
}

/**
 * Componente para mostrar anuncios de Google AdSense
 * 
 * IMPORTANTE: Reemplaza 'ca-pub-XXXXXXXXXX' con tu Publisher ID de AdSense
 * Obtén tu ID en: https://www.google.com/adsense/
 * 
 * Uso:
 * <AdSense adSlot="1234567890" adFormat="auto" />
 */
export const AdSense = ({ 
  adSlot, 
  adFormat = 'auto',
  style,
  className = ''
}: AdSenseProps) => {
  useEffect(() => {
    try {
      // Cargar script de AdSense si no existe
      if (!window.adsbygoogle) {
        const script = document.createElement('script');
        script.src = 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXX';
        script.async = true;
        script.crossOrigin = 'anonymous';
        document.head.appendChild(script);
      }

      // Inicializar anuncio
      window.adsbygoogle = window.adsbygoogle || [];
      window.adsbygoogle.push({});
    } catch (error) {
      console.error('Error loading AdSense:', error);
    }
  }, []);

  return (
    <div className={`adsense-container ${className}`} style={style}>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-XXXXXXXXXX" // REEMPLAZAR con tu Publisher ID
        data-ad-slot={adSlot}
        data-ad-format={adFormat}
        data-full-width-responsive="true"
      />
    </div>
  );
};

// Declaración de tipos para TypeScript
declare global {
  interface Window {
    adsbygoogle?: Array<Record<string, unknown>>;
  }
}

