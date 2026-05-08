import { useState, useEffect } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import api from '../../services/api';
import styles from './SupervisorLogin.module.css';

export default function SupervisorLogin({ onClose, onSelect }) {
  const [supervisors, setSupervisors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSupervisors = async () => {
      try {
        const res = await api.get('/supervisors');
        setSupervisors(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSupervisors();
  }, []);

  const getInitials = (first, last) => {
    return `${first?.[0] || ''}${last?.[0] || ''}`.toUpperCase();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className={styles.title}>
          <ShieldAlert size={24} className={styles.titleIcon} />
          Supervisor Login
        </h2>
        <p className={styles.subtitle}>Select your profile to access admin features</p>

        {loading ? (
          <div className={styles.loading}>Loading supervisors...</div>
        ) : (
          <div className={styles.supervisorList}>
            {supervisors.map((s) => (
              <button
                key={s.supervisor_ID}
                className={styles.supervisorItem}
                onClick={() => onSelect(s)}
              >
                <div className={styles.avatar}>
                  {getInitials(s.first_Name, s.last_Name)}
                </div>
                <div className={styles.supervisorInfo}>
                  <div className={styles.supervisorItemName}>
                    {s.first_Name} {s.last_Name}
                  </div>
                  <div className={styles.supervisorItemHall}>Hall {s.hall_No}</div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
