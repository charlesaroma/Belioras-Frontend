import { Link } from 'react-router-dom';
import MegaMenuBuilder from '../components/MegaMenuBuilder';

export default function MegaMenuEditor() {
  return (
    <div>
      <header className="mb-8">
        <Link to="/dashboard/taxonomies" className="text-[11px] uppercase tracking-widest text-gold-600 hover:text-gold-700">← Taxonomies</Link>
        <h1 className="mt-2 font-display text-3xl text-espresso-700">Mega Menu Editor</h1>
      </header>
      <div className="border border-ivory-600 bg-ivory-100 p-5">
        <MegaMenuBuilder />
      </div>
    </div>
  );
}
