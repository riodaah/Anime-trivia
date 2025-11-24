import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { EgoHookSection } from './components/EgoHookSection';
import { LeaderboardPreview } from './components/LeaderboardPreview';
import { BlogPreviewSection } from './components/BlogPreviewSection';
import { TikTokPromoSection } from './components/TikTokPromoSection';

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <HowItWorksSection />
      <EgoHookSection />
      <LeaderboardPreview />
      <BlogPreviewSection />
      <TikTokPromoSection />
      
      {/* Banner AdSense al final */}
      <div className="section-container pb-20">
        {/* <AdSense adSlot="1234567892" adFormat="horizontal" /> */}
        <div className="h-32 bg-dark-surface rounded-lg flex items-center justify-center text-gray-500 text-sm">
          Zona para Google AdSense (Banner final)
        </div>
      </div>
    </>
  );
}

