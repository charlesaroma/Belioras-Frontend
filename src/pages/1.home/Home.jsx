import HeroBanner from '../../components/home/HeroBanner';
import CategoryGrid from '../../components/home/CategoryGrid';
import FeaturedCollection from '../../components/home/FeaturedCollection';
import NewArrivalsCarousel from '../../components/home/NewArrivalsCarousel';
import InstagramFeed from '../../components/home/InstagramFeed';

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
