import { useState } from 'react';
import Checkbox from '../../components/common/Checkbox';
import MediaUploader from './MediaUploader';
import Button from '../../components/common/Button';
import { useAdmin } from '../../context/AdminContext';

const FIELD = 'w-full border border-ivory-700 bg-ivory-50 px-3 py-2.5 text-sm outline-none transition-colors focus:border-gold-600 placeholder:text-espresso-200';
const LABEL = 'mb-1.5 block text-[10px] font-semibold uppercase tracking-[0.22em] text-espresso-500';

const TAG_CHECKS = ['tag:new', 'tag:bestseller', 'tag:featured'];

export default function ProductForm({ initial, onSubmit, onCancel }) {
  const { attributes } = useAdmin();

  const [form, setForm] = useState(() => ({
    name: '',
    price: '',
    compareAtPrice: '',
    stock: 10,
    description: '',
    sizes: [],
    colors: [],
    images: [],
    ...initial,
    tags: [...(initial?.tags || [])],
  }));
  const [error, setError] = useState('');

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const toggleIn = (key) => (id) =>
    setForm((f) => ({
      ...f,
      [key]: f[key].includes(id) ? f[key].filter((v) => v !== id) : [...f[key], id],
    }));

  const toggleTag = (tag) =>
    setForm((f) => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter((t) => t !== tag) : [...f.tags, tag] }));

  const toggleDimension = (dim) => (id) =>
    setForm((f) => {
      const token = `${dim}:${id}`;
      return { ...f, tags: f.tags.includes(token) ? f.tags.filter((tg) => tg !== token) : [...f.tags, token] };
    });

  const dimensionTags = (dim) => form.tags.filter((t) => t.startsWith(`${dim}:`)).map((t) => t.slice(dim.length + 1));

  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.price || !form.images.length) {
      setError('Name, price and at least one image are required.');
      return;
    }
    onSubmit({
      ...form,
      name: form.name.trim(),
      slug:
        form.slug ||
        form.name.trim().toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-'),
      price: Number(form.price),
      compareAtPrice: form.compareAtPrice ? Number(form.compareAtPrice) : null,
      stock: Number(form.stock) || 0,
    });
  };

  const DIMENSIONS = ['fabric', 'occasion', 'style', 'hair'];

  return (
    <form onSubmit={submit} className="grid gap-10 lg:grid-cols-[1fr_340px]">
      {/* Left column */}
      <div className="space-y-8">
        <section>
          <h3 className="mb-4 font-display text-lg text-espresso-700">Basics</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className={LABEL}>Product name *</label>
              <input value={form.name} onChange={set('name')} className={FIELD} placeholder="e.g. Scarlet Gala Gown" />
            </div>
            <div>
              <label className={LABEL}>Price (EUR) *</label>
              <input type="number" min="0" step="0.01" value={form.price} onChange={set('price')} className={FIELD} />
            </div>
            <div>
              <label className={LABEL}>Compare-at price</label>
              <input type="number" min="0" step="0.01" value={form.compareAtPrice ?? ''} onChange={set('compareAtPrice')} className={FIELD} />
            </div>
            <div>
              <label className={LABEL}>Stock</label>
              <input type="number" min="0" value={form.stock} onChange={set('stock')} className={FIELD} />
            </div>
            <div className="sm:col-span-2">
              <label className={LABEL}>Description</label>
              <textarea rows={4} value={form.description} onChange={set('description')} className={`${FIELD} resize-y`} />
            </div>
          </div>
        </section>

        <section>
          <h3 className="mb-4 font-display text-lg text-espresso-700">Media *</h3>
          <MediaUploader images={form.images} onChange={(images) => setForm((f) => ({ ...f, images }))} />
        </section>

        <section>
          <h3 className="mb-4 font-display text-lg text-espresso-700">Attributes</h3>

          {/* Sizes */}
          <div className="mb-6">
            <p className={LABEL}>Sizes</p>
            <div className="flex flex-wrap gap-x-6">
              {attributes.size.values.map((s) => (
                <Checkbox key={s.id} label={s.name} checked={form.sizes.includes(s.id)} onChange={() => toggleIn('sizes')(s.id)} />
              ))}
            </div>
          </div>

          {/* Colors */}
          <div className="mb-6">
            <p className={LABEL}>Colours</p>
            <div className="flex flex-wrap gap-2">
              {attributes.color.values.map((c) => {
                const selected = form.colors.includes(c.id);
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => toggleIn('colors')(c.id)}
                    title={c.name}
                    className={`h-7 w-7 rounded-full border transition-all ${
                      selected ? 'ring-2 ring-espresso-700 ring-offset-2' : 'border-ivory-700 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                );
              })}
            </div>
          </div>

          {/* Dynamic dimensions */}
          {DIMENSIONS.map((dim) => (
            <div key={dim} className="mb-6">
              <p className={LABEL}>{attributes[dim]?.label?.en || dim}</p>
              <div className="flex flex-wrap gap-x-5">
                {(attributes[dim]?.values || []).map((v) => (
                  <Checkbox
                    key={v.id}
                    label={v.name}
                    checked={dimensionTags(dim).includes(v.id)}
                    onChange={() => toggleDimension(dim)(v.id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </section>
      </div>

      {/* Right column */}
      <aside className="space-y-8">
        <section className="border border-ivory-600 bg-ivory-50 p-5">
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-espresso-500">Merchandising</h3>
          <div className="space-y-1">
            {TAG_CHECKS.map((tag) => (
              <Checkbox
                key={tag}
                label={tag.replace('tag:', '').replace(/^\w/, (c) => c.toUpperCase())}
                checked={form.tags.includes(tag)}
                onChange={() => toggleTag(tag)}
              />
            ))}
          </div>
        </section>

        <section className="border border-ivory-600 bg-ivory-50 p-5">
          <h3 className="mb-4 text-[11px] font-semibold uppercase tracking-[0.25em] text-espresso-500">Summary</h3>
          <ul className="space-y-1.5 text-xs text-espresso-400">
            <li>{form.sizes.length} sizes · {form.colors.length} colours</li>
            <li>{form.images.length} image(s)</li>
            <li>{form.tags.filter((t) => !t.includes(':') || t.startsWith('tag:')).length} merch tags</li>
            <li>
              Attribute tokens:{' '}
              <span className="font-mono">{form.tags.filter((t) => /^(fabric|occ|style|hair|len|color|cat):/.test(t)).length}</span>
            </li>
          </ul>
        </section>

        {error && <p className="text-xs text-error">{error}</p>}

        <div className="space-y-3">
          <Button type="submit" variant="primary" size="lg" className="w-full">Save product</Button>
          {onCancel && (
            <Button type="button" variant="ghost" size="md" className="w-full" onClick={onCancel}>Cancel</Button>
          )}
        </div>
      </aside>
    </form>
  );
}
