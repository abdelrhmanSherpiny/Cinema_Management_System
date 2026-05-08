import { useState } from 'react';
import { Film, Clock, Globe, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import styles from './MovieCard.module.css';

export default function MovieCard({ movie, isExpanded, onToggleShowTimes, onDelete, isSupervisor }) {
  const [imgError, setImgError] = useState(false);
  const hasPoster = movie.poster_URL && !imgError;

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.movieCard}>
        {/* Poster Section */}
        <div className={styles.posterSection}>
          {hasPoster ? (
            <img
              className={styles.posterImage}
              src={movie.poster_URL}
              alt={movie.title}
              loading="lazy"
              onError={() => setImgError(true)}
            />
          ) : (
            <div className={styles.posterFallback}>
              <Film size={40} />
              <span>No Poster</span>
            </div>
          )}
        </div>

        {/* Content Section */}
        <div className={styles.movieContent}>
          <div className={styles.movieHeader}>
            <h2 className={styles.movieTitle}>{movie.title}</h2>
            <span className={styles.movieInfo}>
              {movie.release_Year} • {movie.country}
            </span>
          </div>

          <div className={styles.genreTags}>
            {movie.genre?.map((g, i) => (
              <span key={i} className={styles.genreTag}>{g}</span>
            ))}
          </div>

          <div className={styles.movieMeta}>
            <span className={styles.metaItem}>
              <Clock size={14} />
              {movie.duration}
            </span>
            <span className={styles.metaItem}>
              <Globe size={14} />
              {movie.country}
            </span>
          </div>

          <div className={styles.actions}>
            <button
              className={`${styles.showTimesBtn} ${isExpanded ? styles.showTimesBtnActive : ''}`}
              onClick={() => onToggleShowTimes(movie.movie_ID)}
            >
              {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              Show Times
            </button>
            {isSupervisor && (
              <button
                className={styles.deleteBtn}
                onClick={() => onDelete(movie.movie_ID)}
              >
                <Trash2 size={14} />
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
