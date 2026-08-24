import { colorHex } from '../../services/taxonomyService';
import { useAdmin } from '../../context/AdminContext';

export default function ColorSelector({ options = [], value, onChange = () => {}, size = 'md' }) {
  const { attributes } = useAdmin();
  const dim = size === 'sm' ? 'h-4 w-4' : 'h-6 w-6';

  return (
    <div className="flex flex-wrap items-center gap-2" role="radiogroup">
      {options.map((id) => {
        const selected = id === value;
        return (
          <button
            key={id}
            type="button"
            role="radio"
            aria-checked={selected}
            title={id}
            onClick={() => onChange(id)}
            className={`${dim} rounded-full border transition-all duration-150 ${
              selected ? 'ring-2 ring-espresso-700 ring-offset-2 ring-offset-ivory-50 border-transparent' : 'border-ivory-700 hover:scale-110'
            }`}
            style={{ backgroundColor: colorHex(attributes, id) }}
          />
        );
      })}
    </div>
  );
}
