import HeroBanner from './sections/HeroBanner';
import Hero from './sections/Hero';
import CategoryGrid from './sections/CategoryGrid';
import FeaturedCollection from './sections/FeaturedCollection';
import NewArrivalsCarousel from './sections/NewArrivalsCarousel';
import InstagramFeed from './sections/InstagramFeed';

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <Hero />
      <CategoryGrid />
      <FeaturedCollection />
      <NewArrivalsCarousel />
      <InstagramFeed />
    </div>
  );
}
