export default function DataTable({ columns = [], rows = [], keyField = 'id', actions, emptyMessage = 'No records found.' }) {
  if (!rows.length) {
    return <div className="border border-ivory-600 bg-ivory-50 px-6 py-16 text-center text-sm text-espresso-300">{emptyMessage}</div>;
  }

  return (
    <div className="overflow-x-auto border border-ivory-600 bg-ivory-50">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-ivory-600 text-left text-[10px] uppercase tracking-widest text-espresso-400">
            {columns.map((col) => (
              <th key={col.key} className="whitespace-nowrap px-4 py-3">{col.label}</th>
            ))}
            {actions && <th className="px-4 py-3 text-right">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row[keyField]} className="border-b border-ivory-400/60 transition-colors last:border-0 hover:bg-champagne-50/50">
              {columns.map((col) => (
                <td key={col.key} className="px-4 py-3 align-middle text-espresso-500">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
              {actions && <td className="px-4 py-3 text-right">{actions(row)}</td>}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
