import { useState, useEffect } from 'react';
import { Users, Plus, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import styles from '../shared/PageStyles.module.css';

export default function Customers() {
  const [customers, setCustomers] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      const res = await api.get('/customers');
      setCustomers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await api.delete(`/customers/${id}`);
        fetchCustomers();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/customers', {
        first_Name: firstName,
        last_Name: lastName,
        dob,
        phone_No: phone ? [phone] : [],
      });
      setIsModalOpen(false);
      fetchCustomers();
      setFirstName('');
      setLastName('');
      setDob('');
      setPhone('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Users size={28} className={styles.titleIcon} />
          Customers
        </h1>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Customer
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Date of Birth</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.map((c) => (
              <tr key={c.customer_ID}>
                <td>{c.customer_ID}</td>
                <td>{c.first_Name}</td>
                <td>{c.last_Name}</td>
                <td>{new Date(c.dob).toLocaleDateString()}</td>
                <td>{c.phone_No?.join(', ') || '-'}</td>
                <td>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(c.customer_ID)}>
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.overlay} onClick={() => setIsModalOpen(false)}>
          <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeBtn} onClick={() => setIsModalOpen(false)}>
              <X size={20} />
            </button>
            <h2 className={styles.modalTitle}>Add New Customer</h2>
            <form className={styles.form} onSubmit={handleAdd}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>First Name</label>
                  <input required className={styles.input} value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Last Name</label>
                  <input required className={styles.input} value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Date of Birth</label>
                  <input required type="date" className={styles.input} value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Phone Number</label>
                  <input className={styles.input} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="01xxxxxxxxx" />
                </div>
              </div>
              <button type="submit" className={styles.submitBtn}>Save Customer</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
