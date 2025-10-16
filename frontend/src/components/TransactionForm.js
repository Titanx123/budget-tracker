import React, { useEffect, useState } from 'react';
import { createTransaction, updateTransaction, fetchCategories, fetchTransaction } from '../services/api';
import { useNavigate, useParams } from 'react-router-dom';

function TransactionForm() {
  const [amount, setAmount] = useState('');
  const [vendor, setVendor] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    fetchCategories()
      .then(data => setCategories(data.results || []))
      .catch(console.error);

    if (id) {
      fetchTransaction(id)
        .then(data => {
          setAmount(data.amount);
          setVendor(data.vendor || '');
          setCategory(data.category || '');
          setDate(data.date ? data.date.split('T')[0] : '');
          setDescription(data.description || '');
        })
        .catch(console.error);
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!category) {
      setError('Please select a category');
      return;
    }
    if (!date) {
      setError('Please select a valid date');
      return;
    }
    if (!amount || isNaN(parseFloat(amount))) {
      setError('Please enter a valid amount');
      return;
    }
    if (!description) {
      setError('Please enter description');
      return;
    }

    setLoading(true);
    setError('');

    // Get type from selected category
    const selectedCategoryType = categories.find(c => c.id === parseInt(category))?.type || 'expense';

    const payload = {
      amount: parseFloat(amount),
      vendor,
      category,
      date,
      description,
      type: selectedCategoryType,
    };

    try {
      if (id) {
        await updateTransaction(id, payload);
      } else {
        await createTransaction(payload);
      }
      navigate('/transactions');
    } catch (err) {
      let errorMessage = '';
      if (typeof err === 'string') {
        errorMessage = err;
      } else if (err?.response?.data) {
        errorMessage = JSON.stringify(err.response.data);
      } else if (err.message) {
        errorMessage = err.message;
      } else {
        errorMessage = JSON.stringify(err);
      }
      setError('Error saving transaction: ' + errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: 400, margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2>{id ? 'Edit Transaction' : 'Add Transaction'}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <form onSubmit={handleSubmit}>

        <label>Amount</label><br />
        <input
          type="number"
          step="0.01"
          value={amount}
          onChange={e => setAmount(e.target.value)}
          required
          disabled={loading}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <label>Vendor</label><br />
        <input
          type="text"
          value={vendor}
          onChange={e => setVendor(e.target.value)}
          disabled={loading}
          placeholder="Optional"
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <label>Category</label><br />
        <select
          value={category}
          onChange={e => setCategory(e.target.value)}
          required
          disabled={loading}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        >
          <option value="">-- Select Category --</option>
          {categories.map(c => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>

        <label>Description</label><br />
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
          disabled={loading}
          style={{ width: '100%', padding: '8px', marginBottom: '10px' }}
        />

        <label>Date</label><br />
        <input
          type="date"
          value={date}
          onChange={e => setDate(e.target.value)}
          required
          disabled={loading}
          style={{ width: '100%', padding: '8px', marginBottom: '20px' }}
        />

        <button
          type="submit"
          disabled={loading}
          style={{
            backgroundColor: '#3b82f6',
            color: 'white',
            padding: '10px 16px',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          {loading ? 'Saving...' : 'Save Transaction'}
        </button>

        <button
          type="button"
          disabled={loading}
          onClick={() => navigate('/transactions')}
          style={{
            marginLeft: '10px',
            padding: '10px 16px',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          Cancel
        </button>

      </form>
    </div>
  );
}

export default TransactionForm;
