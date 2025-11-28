import React from "react";

type Column<T> = {
  key: keyof T;
  label: string;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

type AdminTableProps<T> = {
  columns: Column<T>[];
  data: T[];
};

export function AdminTable<T extends Record<string, any>>({ columns, data }: AdminTableProps<T>) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-100 shadow-md bg-white">
      <table className="min-w-full divide-y divide-slate-100">
        <thead className="bg-slate-50">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 text-left text-xs font-semibold text-slate-600 uppercase ${col.className ?? ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {data.map((row, idx) => (
            <tr key={idx} className="hover:bg-slate-50/60">
              {columns.map((col) => (
                <td key={String(col.key)} className={`px-4 py-3 text-sm text-slate-700 ${col.className ?? ""}`}>
                  {col.render ? col.render(row) : String(row[col.key])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
