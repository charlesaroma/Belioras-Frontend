import { useDynamicNav } from '../../context/DynamicNavContext';
import MegaMenuAccordion from './MegaMenuAccordion';

/* Desktop hover flyout — floating-panel chrome around the shared
   MegaMenuAccordion content (also used inline by MobileNav). */
export default function DynamicMegaMenu() {
  const { hoveredItem, setHoveredId } = useDynamicNav();

  if (!hoveredItem) return null;

  return (
    <div className="border-t border-ivory-600 bg-ivory-50 shadow-xl">
      <div className="mx-auto max-w-[1400px] px-6 py-14 lg:px-10">
        <MegaMenuAccordion item={hoveredItem} onNavigate={() => setHoveredId(null)} />
      </div>
    </div>
  );
}
