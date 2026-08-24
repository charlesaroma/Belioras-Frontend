import { sizeName } from '../../services/taxonomyService';
import { useAdmin } from '../../context/AdminContext';

export default function SizeSelector({ options = [], value, onChange = () => {}, compact = false }) {
  const { attributes } = useAdmin();

  return (
    <div className="flex flex-wrap gap-2" role="radiogroup">
      {options.map((id) => {
        const selected = id === value;
        const label = sizeName(attributes, id);
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(id)}
            className={`min-w-[44px] border text-center uppercase tracking-wider transition-all duration-150 ${
              compact ? 'px-2 py-1 text-[10px]' : 'px-3 py-2.5 text-xs'
            } ${
              selected
                ? 'border-espresso-700 bg-espresso-700 text-ivory-50'
                : 'border-ivory-700 bg-transparent text-espresso-500 hover:border-espresso-500'
            }`}
          >
            {label}
          </button>
        );
      })}
    </div>
  );
}
