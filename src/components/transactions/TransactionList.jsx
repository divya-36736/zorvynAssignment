import { useState } from 'react';
import useFinanceStore from '../../store/useFinanceStore';
import { formatCurrency, formatDate, getCategoryIcon, getCategoryColor } from '../../utils/helpers';

const EMPTY_FORM = { description: '', amount: '', category: 'Food', type: 'expense', date: new Date().toISOString().split('T')[0] };

function TransactionModal({ initial, onSave, onClose }) {
  const [form, setForm] = useState(initial || EMPTY_FORM);
  const getCategories = useFinanceStore((s) => s.getCategories);
  const cats = [...new Set([...getCategories(), 'Income', 'Shopping', 'Food', 'Entertainment', 'Utilities', 'Health', 'Transport', 'Housing'])].sort();

  const handle = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{initial?.id ? 'Edit Transaction' : 'Add Transaction'}</h3>
          <button className="modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="modal-body">
          <label className="form-label">Description</label>
          <input className="form-input" name="description" value={form.description} onChange={handle} placeholder="e.g. Grocery Store" />

          <label className="form-label">Amount (₹)</label>
          <input className="form-input" name="amount" type="number" value={form.amount} onChange={handle} placeholder="0" min="0" />

          <div className="form-row">
            <div>
              <label className="form-label">Type</label>
              <select className="form-input" name="type" value={form.type} onChange={handle}>
                <option value="income">Income</option>
                <option value="expense">Expense</option>
              </select>
            </div>
            <div>
              <label className="form-label">Category</label>
              <select className="form-input" name="category" value={form.category} onChange={handle}>
                {cats.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
          </div>

          <label className="form-label">Date</label>
          <input className="form-input" name="date" type="date" value={form.date} onChange={handle} />
        </div>
        <div className="modal-footer">
          <button className="btn-ghost" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            onClick={() => {
              if (!form.description || !form.amount) return;
              onSave(form);
              onClose();
            }}
          >
            {initial?.id ? 'Save Changes' : 'Add Transaction'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function TransactionList() {
  const role = useFinanceStore((s) => s.role);
  const filters = useFinanceStore((s) => s.filters);
  const setFilter = useFinanceStore((s) => s.setFilter);
  const resetFilters = useFinanceStore((s) => s.resetFilters);
  const getFilteredTransactions = useFinanceStore((s) => s.getFilteredTransactions);
  const addTransaction = useFinanceStore((s) => s.addTransaction);
  const editTransaction = useFinanceStore((s) => s.editTransaction);
  const deleteTransaction = useFinanceStore((s) => s.deleteTransaction);
  const getCategories = useFinanceStore((s) => s.getCategories);

  const [modal, setModal] = useState(null); // null | 'add' | {transaction}
  const [page, setPage] = useState(1);
  const PER_PAGE = 10;

  const transactions = getFilteredTransactions();
  const categories = getCategories();
  const totalPages = Math.ceil(transactions.length / PER_PAGE);
  const paged = transactions.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const exportCSV = () => {
    const rows = [['Date', 'Description', 'Category', 'Type', 'Amount']];
    transactions.forEach((t) => rows.push([t.date, t.description, t.category, t.type, t.amount]));
    const csv = rows.map((r) => r.join(',')).join('\n');
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    a.download = 'transactions.csv';
    a.click();
  };

  return (
    <div className="transactions-container">
      {modal === 'add' && (
        <TransactionModal onSave={addTransaction} onClose={() => setModal(null)} />
      )}
      {modal && modal.id && (
        <TransactionModal
          initial={{ ...modal, amount: Math.abs(modal.amount) }}
          onSave={(data) => editTransaction(modal.id, data)}
          onClose={() => setModal(null)}
        />
      )}

      <div className="tx-toolbar">
        <div className="tx-filters">
          <input
            className="filter-input"
            placeholder="🔍 Search transactions..."
            value={filters.search}
            onChange={(e) => { setFilter('search', e.target.value); setPage(1); }}
          />
          
          <select className="filter-select" value={filters.type} onChange={(e) => { setFilter('type', e.target.value); setPage(1); }}>
            <option value="all">All Types</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
          <select className="filter-select" value={filters.category} onChange={(e) => { setFilter('category', e.target.value); setPage(1); }}>
            <option value="all">All Categories</option>
            {categories.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <select className="filter-select" value={filters.sortBy} onChange={(e) => setFilter('sortBy', e.target.value)}>
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
          {(filters.search || filters.type !== 'all' || filters.category !== 'all') && (
            <button className="btn-ghost small" onClick={() => { resetFilters(); setPage(1); }}>✕ Clear</button>
          )}
        </div>
        <div className="tx-actions">
          <button className="btn-ghost small" onClick={exportCSV}>↓ Export CSV</button>
          {role === 'admin' && (
            <button className="btn-primary small" onClick={() => setModal('add')}>+ Add</button>
          )}
        </div>
      </div>

      <div className="tx-count">{transactions.length} transaction{transactions.length !== 1 ? 's' : ''} found</div>

      {paged.length === 0 ? (
        <div className="empty-state large">
          <div className="empty-icon">📭</div>
          <div>No transactions found</div>
          <div className="empty-sub">Try adjusting your filters</div>
        </div>
      ) : (
        <div className="tx-table">
          <div className="tx-table-header">
            <span>Date</span>
            <span>Description</span>
            <span>Category</span>
            <span>Type</span>
            <span>Amount</span>
            {role === 'admin' && <span>Actions</span>}
          </div>
          {paged.map((tx) => (
            <div key={tx.id} className={`tx-row ${tx.type}`}>
              <span className="tx-date">{formatDate(tx.date)}</span>
              <span className="tx-desc">{tx.description}</span>
              <span className="tx-category">
                <span className="cat-chip" style={{ borderColor: getCategoryColor(tx.category) }}>
                  {getCategoryIcon(tx.category)} {tx.category}
                </span>
              </span>
              <span className={`tx-type-badge ${tx.type}`}>{tx.type}</span>
              <span className={`tx-amount ${tx.type}`}>
                {tx.type === 'income' ? '+' : '-'}{formatCurrency(tx.amount)}
              </span>
              {role === 'admin' && (
                <span className="tx-row-actions">
                  <button className="row-btn edit" onClick={() => setModal(tx)} title="Edit">✏️</button>
                  <button className="row-btn delete" onClick={() => deleteTransaction(tx.id)} title="Delete">🗑️</button>
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button className="page-btn" disabled={page === 1} onClick={() => setPage((p) => p - 1)}>‹ Prev</button>
          <span className="page-info">Page {page} of {totalPages}</span>
          <button className="page-btn" disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}>Next ›</button>
        </div>
      )}
    </div>
  );
}


