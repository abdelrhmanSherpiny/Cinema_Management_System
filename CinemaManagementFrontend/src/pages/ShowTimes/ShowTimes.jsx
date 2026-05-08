import { useState, useEffect } from 'react';
import { Calendar, Plus, Trash2, X } from 'lucide-react';
import api from '../../services/api';
import styles from '../shared/PageStyles.module.css';

export default function ShowTimes({ isSupervisor }) {
  const [showtimes, setShowtimes] = useState([]);
  const [movies, setMovies] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [movieId, setMovieId] = useState('');
  const [hallNo, setHallNo] = useState('');

  useEffect(() => {
    fetchShowtimes();
    fetchMovies();
  }, []);

  const fetchShowtimes = async () => {
    try {
      const res = await api.get('/showtimes');
      setShowtimes(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMovies = async () => {
    try {
      const res = await api.get('/movies');
      setMovies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure?')) {
      try {
        await api.delete(`/showtimes/${id}`);
        fetchShowtimes();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/showtimes', {
        date,
        start_Time: time.includes(':') && time.length === 5 ? `${time}:00` : time,
        movie: { movie_ID: parseInt(movieId) },
        hall: { hall_No: parseInt(hallNo) },
      });
      setIsModalOpen(false);
      fetchShowtimes();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Calendar size={28} className={styles.titleIcon} />
          Show Times
        </h1>
        {isSupervisor && (
          <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
            <Plus size={18} />
            Add Show Time
          </button>
        )}
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Movie</th>
              <th>Date</th>
              <th>Time</th>
              <th>Hall</th>
              {isSupervisor && <th>Actions</th>}
            </tr>
          </thead>
          <tbody>
            {showtimes.map((st) => (
              <tr key={st.show_No}>
                <td>{st.show_No}</td>
                <td>{st.movie?.title}</td>
                <td>{new Date(st.date).toLocaleDateString()}</td>
                <td>{st.start_Time}</td>
                <td><span className={styles.badge}>Hall {st.hall?.hall_No}</span></td>
                {isSupervisor && (
                  <td>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(st.show_No)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                )}
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
            <h2 className={styles.modalTitle}>Add New Show Time</h2>
            <form className={styles.form} onSubmit={handleAdd}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Movie</label>
                <select required className={styles.input} value={movieId} onChange={(e) => setMovieId(e.target.value)}>
                  <option value="">Select Movie</option>
                  {movies.map((m) => (
                    <option key={m.movie_ID} value={m.movie_ID}>{m.title}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Date</label>
                <input required type="date" className={styles.input} value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Time</label>
                <input required type="time" className={styles.input} value={time} onChange={(e) => setTime(e.target.value)} />
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Hall Number</label>
                <input required type="number" className={styles.input} value={hallNo} onChange={(e) => setHallNo(e.target.value)} />
              </div>
              <button type="submit" className={styles.submitBtn}>Save Show Time</button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
