import { useState } from 'react';

export default function MediaUploader({ images = [], onChange }) {
  const [url, setUrl] = useState('');

  const add = () => {
    if (!url.trim()) return;
    onChange([...images, url.trim()]);
    setUrl('');
  };

  return (
    <div>
      <div className="mb-3 flex gap-2">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Paste image URL…"
          className="flex-1 border border-ivory-700 bg-ivory-50 px-3 py-2 text-sm outline-none focus:border-gold-600"
        />
        <button type="button" onClick={add} className="border border-espresso-700 px-4 text-[11px] uppercase tracking-widest text-espresso-700 transition-colors hover:bg-espresso-700 hover:text-ivory-50">
          Add
        </button>
      </div>

      {images.length > 0 && (
        <div className="grid grid-cols-4 gap-2">
          {images.map((src, i) => (
            <div key={src + i} className="group relative overflow-hidden border border-ivory-600">
              <img src={src} alt="" className="aspect-square w-full object-cover" onError={(e) => { e.target.src = 'https://via.placeholder.com/200?text=⚠'; }} />
              <button
                type="button"
                onClick={() => onChange(images.filter((_, idx) => idx !== i))}
                className="absolute right-1 top-1 hidden h-6 w-6 items-center justify-center rounded-full bg-espresso-800/80 text-xs text-ivory-50 group-hover:flex"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
