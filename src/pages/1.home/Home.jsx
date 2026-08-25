import HeroBanner from './sections/HeroBanner';
import CategoryGrid from './sections/CategoryGrid';
import FeaturedCollection from './sections/FeaturedCollection';
import NewArrivalsCarousel from './sections/NewArrivalsCarousel';
import InstagramFeed from './sections/InstagramFeed';

export default function Home() {
  return (
    <div>
      <HeroBanner />
      <CategoryGrid />
      <FeaturedCollection />
      <NewArrivalsCarousel />
      <InstagramFeed />
    </div>
  );
}
