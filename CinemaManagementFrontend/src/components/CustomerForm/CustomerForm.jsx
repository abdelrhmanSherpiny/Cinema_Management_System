import { useState, useEffect } from 'react';
import { Users, UserPlus } from 'lucide-react';
import api from '../../services/api';
import styles from './CustomerForm.module.css';

export default function CustomerForm({ selectedCustomer, onSelectCustomer, onCustomerCreated }) {
  const [tab, setTab] = useState('existing');
  const [customers, setCustomers] = useState([]);
  const [search, setSearch] = useState('');

  // New customer form
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

  const handleCreateCustomer = async (e) => {
    e.preventDefault();
    try {
      await api.post('/customers', {
        first_Name: firstName,
        last_Name: lastName,
        dob,
        phone_No: phone ? [phone] : [],
      });
      // Refetch customers and switch to existing tab
      const res = await api.get('/customers');
      setCustomers(res.data);
      // Select the newly created customer (last one)
      const newCustomer = res.data[res.data.length - 1];
      if (newCustomer) {
        onSelectCustomer(newCustomer);
        onCustomerCreated && onCustomerCreated(newCustomer);
      }
      setTab('existing');
      setFirstName('');
      setLastName('');
      setDob('');
      setPhone('');
    } catch (err) {
      console.error(err);
    }
  };

  const filteredCustomers = customers.filter((c) => {
    const fullName = `${c.first_Name} ${c.last_Name}`.toLowerCase();
    return fullName.includes(search.toLowerCase());
  });

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>
        <Users size={18} className={styles.titleIcon} />
        Customer
      </h3>

      <div className={styles.tabs}>
        <button
          className={`${styles.tab} ${tab === 'existing' ? styles.tabActive : ''}`}
          onClick={() => setTab('existing')}
        >
          Existing Customer
        </button>
        <button
          className={`${styles.tab} ${tab === 'new' ? styles.tabActive : ''}`}
          onClick={() => setTab('new')}
        >
          <UserPlus size={14} />
          New Customer
        </button>
      </div>

      {tab === 'existing' ? (
        <>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Search customers..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <div className={styles.customerList}>
            {filteredCustomers.map((c) => (
              <button
                key={c.customer_ID}
                className={`${styles.customerItem} ${
                  selectedCustomer?.customer_ID === c.customer_ID
                    ? styles.customerItemSelected
                    : ''
                }`}
                onClick={() => onSelectCustomer(c)}
              >
                <div>
                  <div className={styles.customerName}>
                    {c.first_Name} {c.last_Name}
                  </div>
                  <div className={styles.customerDetail}>
                    {c.phone_No?.join(', ') || 'No phone'}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </>
      ) : (
        <form className={styles.form} onSubmit={handleCreateCustomer}>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>First Name</label>
              <input
                required
                className={styles.input}
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Last Name</label>
              <input
                required
                className={styles.input}
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </div>
          </div>
          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Date of Birth</label>
              <input
                required
                type="date"
                className={styles.input}
                value={dob}
                onChange={(e) => setDob(e.target.value)}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                className={styles.input}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="01xxxxxxxxx"
              />
            </div>
          </div>
          <button type="submit" className={styles.submitBtn}>
            Create & Select Customer
          </button>
        </form>
      )}
    </div>
  );
}
