import React from "react";

type Column<T> = {
  key: keyof T | string;
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
    <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm bg-white dark:bg-slate-800/50">
      <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-700">
        <thead className="bg-slate-50 dark:bg-slate-800">
          <tr>
            {columns.map((col) => (
              <th
                key={String(col.key)}
                className={`px-4 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide ${col.className ?? ""}`}
              >
                {col.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-sm text-slate-500 dark:text-slate-400"
              >
                No data found
              </td>
            </tr>
          ) : (
            data.map((row, idx) => (
              <tr
                key={idx}
                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={String(col.key)}
                    className={`px-4 py-3 text-sm text-slate-700 dark:text-slate-300 ${col.className ?? ""}`}
                  >
                    {col.render ? col.render(row) : (col.key in row ? String(row[col.key as keyof T]) : "")}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminTable;
