import { useState } from 'react';
import { Film, X } from 'lucide-react';
import api from '../../services/api';
import styles from './AddMovieModal.module.css';

export default function AddMovieModal({ onClose, onMovieAdded }) {
  const [title, setTitle] = useState('');
  const [year, setYear] = useState('');
  const [duration, setDuration] = useState('');
  const [country, setCountry] = useState('');
  const [genres, setGenres] = useState('');
  const [posterUrl, setPosterUrl] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/movies', {
        title,
        release_Year: parseInt(year),
        duration: duration.includes(':') ? duration : '02:00:00',
        country,
        poster_URL: posterUrl,
        genre: genres.split(',').map((g) => g.trim()),
        actors: [],
      });
      onMovieAdded();
      onClose();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <X size={20} />
        </button>

        <h2 className={styles.title}>
          <Film size={22} className={styles.titleIcon} />
          Add New Movie
        </h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Title</label>
            <input
              required
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Movie title"
            />
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Release Year</label>
              <input
                required
                type="number"
                className={styles.input}
                value={year}
                onChange={(e) => setYear(e.target.value)}
                placeholder="2024"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Duration (HH:MM:SS)</label>
              <input
                required
                className={styles.input}
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                placeholder="02:30:00"
              />
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Country</label>
              <input
                required
                className={styles.input}
                value={country}
                onChange={(e) => setCountry(e.target.value)}
                placeholder="USA"
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Genres (comma separated)</label>
              <input
                required
                className={styles.input}
                value={genres}
                onChange={(e) => setGenres(e.target.value)}
                placeholder="Action, Sci-Fi"
              />
            </div>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Poster URL</label>
            <input
              className={styles.input}
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="https://image.tmdb.org/..."
            />
          </div>

          <button type="submit" className={styles.submitBtn}>
            Save Movie
          </button>
        </form>
      </div>
    </div>
  );
}
