import { useState } from 'react';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { useAdmin } from '../../context/AdminContext';
import Button from '../../components/common/Button';

function uid(prefix) {
  return `${prefix}-${Math.random().toString(36).slice(2, 8)}`;
}

/* ---- normalize: {children:[{children:[…]}]} ⇄ original shape (sections hold `items`) ---- */
function toUniform(items) {
  return (items || []).map((n) => {
    let children;
    if (Array.isArray(n.items)) children = n.items; // section node
    else if (Array.isArray(n.children)) children = n.children;
    const label = typeof n.label === 'string' ? n.label : n.title || '';
    // Preserve storefront-only fields (nav position, tiles, slug)
    return { ...pick(n, ['nav', 'tiles', 'slug']), id: n.id, label, url: n.url || '', children: toUniform(children) };
  });
}

function pick(obj = {}, keys = []) {
  return keys.reduce((acc, k) => (obj[k] !== undefined ? { ...acc, [k]: obj[k] } : acc), {});
}

function fromUniform(nodes) {
  return nodes.map((top) => ({
    ...pick(top, ['nav', 'tiles', 'slug']),
    id: top.id,
    label: top.label,
    url: top.url,
    // Child may be a section (has sub-children) or a bare link
    children: top.children.map((sec) =>
      sec.children.length
        ? {
            id: sec.id,
            title: sec.label,
            items: sec.children.map((c) => ({
              ...pick(c, ['nav', 'tiles', 'slug']),
              id: c.id,
              label: c.label,
              slug: (c.url || c.slug || '').replace(/^\//, ''),
              url: c.url || `/${(c.slug || '').replace(/^\//, '')}`,
            })),
          }
        : {
            ...pick(sec, ['nav', 'tiles']),
            id: sec.id,
            label: sec.label,
            slug: (sec.url || sec.slug || '').replace(/^\//, ''),
            url: sec.url || `/${(sec.slug || '').replace(/^\//, '')}`,
          },
    ),
  }));
}

function updateNode(nodes, id, patch) {
  return nodes.map((n) =>
    n.id === id ? { ...n, ...patch } : { ...n, children: updateNode(n.children, id, patch) },
  );
}

function removeNode(nodes, id) {
  return nodes.filter((n) => n.id !== id).map((n) => ({ ...n, children: removeNode(n.children, id) }));
}

function addChild(nodes, parentId, child) {
  return nodes.map((n) =>
    n.id === parentId
      ? { ...n, children: [...n.children, child] }
      : { ...n, children: addChild(n.children, parentId, child) },
  );
}

function moveRelative(nodes, id, delta) {
  const idx = nodes.findIndex((n) => n.id === id);
  if (idx !== -1) {
    const j = idx + delta;
    if (j < 0 || j >= nodes.length) return nodes;
    const copy = [...nodes];
    [copy[idx], copy[j]] = [copy[j], copy[idx]];
    return copy;
  }
  return nodes.map((n) => ({ ...n, children: moveRelative(n.children, id, delta) }));
}

function extractAndRemove(nodes, id) {
  let picked = null;
  const strip = (list) =>
    list.reduce((acc, n) => {
      if (n.id === id) {
        picked = n;
        return acc;
      }
      acc.push({ ...n, children: strip(n.children) });
      return acc;
    }, []);
  const rest = strip(nodes);
  return { node: picked, rest };
}

function insertAfter(nodes, targetId, node) {
  const idx = nodes.findIndex((n) => n.id === targetId);
  if (idx !== -1) {
    const copy = [...nodes];
    copy.splice(idx + 1, 0, node);
    return copy;
  }
  return nodes.map((n) => ({ ...n, children: insertAfter(n.children, targetId, node) }));
}

/* ---------------- Row ---------------- */
function NodeRow({ node, depth, index, siblings, actions }) {
  const [editing, setEditing] = useState(false);
  const [label, setLabel] = useState(node.label);
  const [url, setUrl] = useState(node.url);
  const [expanded, setExpanded] = useState(true);

  const { draggingId, setDraggingId } = actions;
  const hasChildren = node.children.length > 0;

  const saveEdit = () => {
    actions.onUpdate(node.id, { label: label.trim() || node.label, url: url.trim() || '/' });
    setEditing(false);
  };

  return (
    <li
      draggable={!editing}
      onDragStart={() => setDraggingId(node.id)}
      onDragEnd={() => setDraggingId(null)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={() => {
        if (draggingId && draggingId !== node.id) actions.onDrop(draggingId, node.id);
        setDraggingId(null);
      }}
      className={draggingId === node.id ? 'opacity-40' : ''}
    >
      <div className="group flex cursor-grab items-center gap-2 border border-ivory-600 bg-ivory-50 px-3 py-2 hover:border-espresso-300" style={{ marginLeft: depth * 22 }}>
        <span className="select-none text-espresso-200" title="Drag">⠿</span>

        {hasChildren && !editing && (
          <button
            type="button"
            title={expanded ? 'Collapse' : 'Expand'}
            onClick={() => setExpanded((v) => !v)}
            className="shrink-0 text-espresso-300 transition-colors hover:text-gold-600"
          >
            <KeyboardArrowDownIcon
              sx={{ fontSize: 18 }}
              className={`transition-transform duration-200 ${expanded ? '' : '-rotate-90'}`}
            />
          </button>
        )}

        {editing ? (
          <div className="flex flex-1 flex-wrap items-center gap-2 py-0.5">
            <input value={label} onChange={(e) => setLabel(e.target.value)} autoFocus onKeyDown={(e) => e.key === 'Enter' && saveEdit()} className="min-w-32 flex-1 border border-ivory-700 px-2 py-1 text-xs outline-none focus:border-gold-600" />
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="/url" className="w-48 border border-ivory-700 px-2 py-1 font-mono text-[11px] outline-none focus:border-gold-600" />
            <button type="button" onClick={saveEdit} className="text-xs font-medium text-success">Save</button>
            <button type="button" onClick={() => setEditing(false)} className="text-xs text-espresso-300">Cancel</button>
          </div>
        ) : (
          <>
            <div className="flex min-w-0 flex-1 items-baseline gap-3">
              <span className={`truncate ${depth === 0 ? 'font-display text-sm' : 'text-xs'} text-espresso-700`}>{node.label}</span>
              <span className="truncate font-mono text-[10px] text-espresso-200">{node.url}</span>
              {node.children.length > 0 && <span className="shrink-0 text-[9px] uppercase tracking-widest text-champagne-600">{node.children.length} sub</span>}
            </div>
            <div className="hidden shrink-0 gap-1 text-sm text-espresso-300 group-hover:flex">
              <button type="button" title="Rename" onClick={() => setEditing(true)} className="px-1 hover:text-gold-600">✎</button>
              <button type="button" title="Add sub-item" onClick={() => actions.onAddChild(node.id)} className="px-1 hover:text-gold-600">＋</button>
              <button type="button" title="Move up" disabled={index === 0} onClick={() => actions.onMoveUp(node.id)} className="px-1 text-xs hover:text-espresso-600 disabled:opacity-30">▲</button>
              <button type="button" title="Move down" disabled={index === siblings.length - 1} onClick={() => actions.onMoveDown(node.id)} className="px-1 text-xs hover:text-espresso-600 disabled:opacity-30">▼</button>
              <button type="button" title="Delete" onClick={() => actions.onDelete(node.id)} className="px-1 text-xs hover:text-error">✕</button>
            </div>
          </>
        )}
      </div>

      {hasChildren && expanded && (
        <ul className="mt-2 space-y-2">
          {node.children.map((child, ci) => (
            <NodeRow key={child.id} node={child} depth={depth + 1} index={ci} siblings={node.children} actions={actions} />
          ))}
        </ul>
      )}
    </li>
  );
}

/* ---------------- Builder ---------------- */
export default function MegaMenuBuilder() {
  const { navigation, updateNavigation } = useAdmin();
  const [tree, setTree] = useState(() => toUniform(navigation?.items || []));
  const [savedFlash, setSavedFlash] = useState(false);
  const [draggingId, setDraggingId] = useState(null);

  const actions = {
    draggingId,
    setDraggingId,
    onUpdate: (id, patch) => setTree((t) => updateNode(t, id, patch)),
    onDelete: (id) => setTree((t) => removeNode(t, id)),
    onAddChild: (parentId) =>
      setTree((t) => addChild(t, parentId, { id: uid('nav'), label: 'New Link', url: '/', children: [] })),
    onMoveUp: (id) => setTree((t) => moveRelative(t, id, -1)),
    onMoveDown: (id) => setTree((t) => moveRelative(t, id, 1)),
    onDrop: (dragId, targetId) =>
      setTree((t) => {
        const { node, rest } = extractAndRemove(t, dragId);
        if (!node) return t;
        return insertAfter(rest, targetId, node);
      }),
  };

  const addTopLevel = () =>
    setTree((t) => [...t, { id: uid('nav'), label: 'New Section', url: '/', children: [] }]);

  const save = () => {
    updateNavigation(fromUniform(tree));
    setSavedFlash(true);
    setTimeout(() => setSavedFlash(false), 2000);
  };

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <p className="text-xs text-espresso-400">
          Drag a row onto another to reorder · hover for rename / add / delete · saving updates the storefront menu instantly.
        </p>
        <div className="flex items-center gap-4">
          {savedFlash && <span className="animate-pulse text-xs font-medium text-success">Saved ✓ Storefront menu updated</span>}
          <Button variant="ghost" size="sm" onClick={addTopLevel}>+ Top-level item</Button>
          <Button variant="primary" size="md" onClick={save}>Save Menu</Button>
        </div>
      </div>

      <ul className="space-y-3">
        {tree.map((top, i) => (
          <NodeRow key={top.id} node={top} depth={0} index={i} siblings={tree} actions={actions} />
        ))}
      </ul>
    </div>
  );
}
