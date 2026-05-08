import { useState, useEffect } from 'react';
import { Calendar } from 'lucide-react';
import api from '../../services/api';
import styles from './ShowTimeList.module.css';

export default function ShowTimeList({ movieId, movieTitle, movieGenres, onSelectShowTime }) {
  const [showTimes, setShowTimes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShowTimes = async () => {
      try {
        const res = await api.get(`/showtimes/movie/${movieId}`);
        setShowTimes(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchShowTimes();
  }, [movieId]);

  const formatTime = (timeStr) => {
    if (!timeStr) return '';
    const parts = timeStr.split(':');
    const h = parseInt(parts[0]);
    const m = parts[1];
    const ampm = h >= 12 ? 'PM' : 'AM';
    const displayH = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${displayH}:${m} ${ampm}`;
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const handleSelect = (st) => {
    onSelectShowTime({
      showTime: st,
      movieTitle,
      movieId,
      movieGenres,
    });
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading show times...</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Calendar size={16} className={styles.headerIcon} />
        Available Show Times
      </div>

      {showTimes.length === 0 ? (
        <div className={styles.empty}>No show times available for this movie.</div>
      ) : (
        <div className={styles.showTimeGrid}>
          {showTimes.map((st) => (
            <button
              key={st.show_No}
              className={styles.showTimePill}
              onClick={() => handleSelect(st)}
            >
              <span className={styles.pillTime}>{formatTime(st.start_Time)}</span>
              <span className={styles.pillDate}>{formatDate(st.date)}</span>
              <span className={styles.pillHall}>Hall {st.hall?.hall_No}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
