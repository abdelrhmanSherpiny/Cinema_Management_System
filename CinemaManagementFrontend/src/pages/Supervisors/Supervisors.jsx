import { useState, useEffect } from 'react';
import { ShieldAlert, Plus, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import styles from '../shared/PageStyles.module.css';

export default function Supervisors() {
  const [supervisors, setSupervisors] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [salary, setSalary] = useState('');
  const [hallNo, setHallNo] = useState('');

  useEffect(() => {
    fetchSupervisors();
  }, []);

  const fetchSupervisors = async () => {
    try {
      const res = await api.get('/supervisors');
      setSupervisors(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await api.delete(`/supervisors/${id}`);
        fetchSupervisors();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/supervisors', {
        first_Name: firstName,
        last_Name: lastName,
        salary: parseInt(salary),
        hall_No: parseInt(hallNo),
      });
      setIsModalOpen(false);
      fetchSupervisors();
      setFirstName('');
      setLastName('');
      setSalary('');
      setHallNo('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <ShieldAlert size={28} className={styles.titleIcon} />
          Supervisors
        </h1>
        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          <Plus size={18} />
          Add Supervisor
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Salary</th>
              <th>Hall</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {supervisors.map((s) => (
              <tr key={s.supervisor_ID}>
                <td>{s.supervisor_ID}</td>
                <td>{s.first_Name}</td>
                <td>{s.last_Name}</td>
                <td>${s.salary}</td>
                <td><span className={styles.badge}>Hall {s.hall_No}</span></td>
                <td>
                  <button className={styles.deleteBtn} onClick={() => handleDelete(s.supervisor_ID)}>
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
            <h2 className={styles.modalTitle}>Add New Supervisor</h2>
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
                  <label className={styles.label}>Salary</label>
                  <input required type="number" className={styles.input} value={salary} onChange={(e) => setSalary(e.target.value)} />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>Hall Number</label>
                  <input required type="number" className={styles.input} value={hallNo} onChange={(e) => setHallNo(e.target.value)} />
                </div>
              </div>
              <button type="submit" className={styles.submitBtn}>Save Supervisor</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
