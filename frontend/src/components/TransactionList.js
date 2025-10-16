import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTransactions, deleteTransaction, fetchCategories } from '../services/api';
function TransactionsList() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  const [filters, setFilters] = useState({
    start_date: '',
    end_date: '',
    category: '',
    min_amount: '',
    max_amount: '',
  });

  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    setError(null);

    const params = {
      page,
      page_size: pageSize,
    };

    Object.entries(filters).forEach(([key, value]) => {
      if (value) params[key] = value;
    });

    fetchTransactions(params)
      .then(data => {
        setTransactions(data.results || []);
        setTotalPages(Math.ceil(data.count / pageSize) || 1);
      })
      .catch(err => setError(err.toString()))
      .finally(() => setLoading(false));
  }, [page, pageSize, filters]);

  useEffect(() => {
    fetchCategories()
      .then(data => setCategories(data.results || []))
      .catch(console.error);
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await deleteTransaction(id);
        setTransactions(transactions.filter(txn => txn.id !== id));
      } catch (err) {
        alert('Error deleting transaction: ' + err);
      }
    }
  };

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    setPage(1);
  };

  const handlePageChange = newPage => {
    if (newPage > 0 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (loading) return <p>Loading transactions...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div className="transactions-container">
      <h2>Transactions</h2>

      {/* Add Transaction Button */}
      <button
        onClick={() => navigate('/transactions/add')}
        style={{
          backgroundColor: '#10b981',
          color: 'white',
          padding: '8px 12px',
          borderRadius: '4px',
          border: 'none',
          cursor: 'pointer',
          marginBottom: '15px',
          fontWeight: 'bold'
        }}
      >
        + Add Transaction
      </button>

      {/* Filters */}
      <div className="transactions-filters" style={{ marginBottom: 20 }}>
        <label>
          Start Date:
          <input type="date" name="start_date" value={filters.start_date} onChange={handleFilterChange} />
        </label>

        <label>
          End Date:
          <input type="date" name="end_date" value={filters.end_date} onChange={handleFilterChange} />
        </label>

        <label>
          Category:
          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">All</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </label>

        {/* <label>
          Min Amount:
          <input type="number" name="min_amount" value={filters.min_amount} onChange={handleFilterChange} />
        </label>

        <label>
          Max Amount:
          <input type="number" name="max_amount" value={filters.max_amount} onChange={handleFilterChange} />
        </label> */}
      </div>

      <table className="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Vendor</th>
            <th>Category</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr><td colSpan="5">No transactions found.</td></tr>
          ) : transactions.map(txn => (
            <tr key={txn.id}>
              <td>{new Date(txn.date).toLocaleDateString()}</td>
              <td>{txn.vendor}</td>
              <td>{txn.category_name || txn.category?.name}</td>
              <td style={{ color: parseFloat(txn.amount) >= 0 ? 'green' : 'red' }}>
                {parseFloat(txn.amount).toFixed(2)}
              </td>
              <td className="actions">
                <button
                  onClick={() => navigate(`/transactions/edit/${txn.id}`)}
                  style={{ backgroundColor: '#3b82f6', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(txn.id)}
                  style={{ marginLeft: 10, backgroundColor: '#ef4444', color: 'white', border: 'none', padding: '6px 12px', borderRadius: '4px', cursor: 'pointer' }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="pagination-controls">
        <button onClick={() => handlePageChange(page - 1)} disabled={page === 1}>Previous</button>
        <span>{page} / {totalPages}</span>
        <button onClick={() => handlePageChange(page + 1)} disabled={page === totalPages}>Next</button>
      </div>
    </div>
  );
}

export default TransactionsList;
