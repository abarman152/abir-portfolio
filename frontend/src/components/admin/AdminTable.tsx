'use client';

import { motion } from 'framer-motion';
import { Pencil, Trash2, Plus } from 'lucide-react';

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
}

interface Props<T extends { id: string }> {
  title: string;
  data: T[];
  columns: Column<T>[];
  onAdd: () => void;
  onEdit: (item: T) => void;
  onDelete: (id: string) => void;
  loading?: boolean;
}

export default function AdminTable<T extends { id: string }>({
  title, data, columns, onAdd, onEdit, onDelete, loading,
}: Props<T>) {
  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text)' }}>{title}</h1>
          <p style={{ color: 'var(--text-3)', fontSize: '0.875rem', marginTop: '0.2rem' }}>
            {data.length} item{data.length !== 1 ? 's' : ''}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={onAdd}
          style={{
            display: 'flex', alignItems: 'center', gap: '0.5rem',
            padding: '0.6rem 1.25rem', borderRadius: '10px',
            background: 'linear-gradient(135deg, var(--accent), var(--accent))',
            color: 'white', border: 'none', cursor: 'pointer',
            fontSize: '0.875rem', fontWeight: 600,
            boxShadow: '0 4px 14px var(--border)',
          }}
        >
          <Plus size={15} /> Add New
        </motion.button>
      </div>

      <div style={{
        borderRadius: '16px', overflow: 'hidden',
        border: '1px solid var(--border)',
        background: 'var(--bg-card)',
      }}>
        {loading ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-3)' }}>Loading...</div>
        ) : data.length === 0 ? (
          <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-3)' }}>
            No items yet. Click &quot;Add New&quot; to get started.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-3)' }}>
                  {columns.map((col) => (
                    <th key={col.key} style={{
                      padding: '0.875rem 1rem', textAlign: 'left',
                      fontSize: '0.75rem', fontWeight: 700,
                      color: 'var(--text-3)', textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}>
                      {col.label}
                    </th>
                  ))}
                  <th style={{ padding: '0.875rem 1rem', width: '80px' }} />
                </tr>
              </thead>
              <tbody>
                {data.map((row, i) => (
                  <motion.tr
                    key={row.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: i * 0.04 }}
                    style={{
                      borderBottom: '1px solid var(--border)',
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--bg-3)')}
                    onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
                  >
                    {columns.map((col) => (
                      <td key={col.key} style={{
                        padding: '0.875rem 1rem',
                        fontSize: '0.875rem', color: 'var(--text)',
                        maxWidth: '260px',
                      }}>
                        <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {col.render ? col.render(row) : String((row as Record<string, unknown>)[col.key] ?? '')}
                        </div>
                      </td>
                    ))}
                    <td style={{ padding: '0.875rem 1rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => onEdit(row)}
                          style={{
                            width: 30, height: 30, borderRadius: '8px', border: 'none',
                            background: 'var(--accent-dim)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: 'var(--accent)',
                          }}
                        >
                          <Pencil size={13} />
                        </button>
                        <button
                          onClick={() => {
                            if (confirm('Delete this item?')) onDelete(row.id);
                          }}
                          style={{
                            width: 30, height: 30, borderRadius: '8px', border: 'none',
                            background: 'rgba(239,68,68,0.1)', cursor: 'pointer',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#ef4444',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
