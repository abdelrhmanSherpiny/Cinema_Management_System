import { useState, useEffect } from 'react';
import { Film, Plus, Search } from 'lucide-react';
import api from '../../services/api';
import MovieCard from '../../components/MovieCard/MovieCard';
import ShowTimeList from '../../components/ShowTimeList/ShowTimeList';
import AddMovieModal from '../../components/AddMovieModal/AddMovieModal';
import BookingModal from '../../components/BookingModal/BookingModal';
import styles from './Movies.module.css';

export default function Movies({ isSupervisor }) {
  const [movies, setMovies] = useState([]);
  const [search, setSearch] = useState('');
  const [expandedMovie, setExpandedMovie] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  const fetchMovies = async () => {
    try {
      const res = await api.get('/movies');
      setMovies(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!search.trim()) {
      fetchMovies();
      return;
    }
    try {
      const res = await api.get(`/movies/search?Title=${search}`);
      setMovies(res.data);
    } catch (err) {
      setMovies([]);
    }
  };

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this movie?')) {
      try {
        await api.delete(`/movies/${id}`);
        fetchMovies();
      } catch (err) {
        console.error(err);
      }
    }
  };

  const toggleShowTimes = (movieId) => {
    setExpandedMovie(expandedMovie === movieId ? null : movieId);
  };

  const handleSelectShowTime = (data) => {
    setBookingData(data);
  };

  const handleCloseBooking = () => {
    setBookingData(null);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          <Film size={28} className={styles.titleIcon} />
          Now Showing
        </h1>
        {isSupervisor && (
          <button className={styles.addBtn} onClick={() => setShowAddModal(true)}>
            <Plus size={18} />
            Add Movie
          </button>
        )}
      </div>

      <form onSubmit={handleSearch} className={styles.searchBar}>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search movies by title..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className={styles.searchBtn}>
          <Search size={18} />
        </button>
        {search && (
          <button
            type="button"
            className={styles.clearBtn}
            onClick={() => {
              setSearch('');
              fetchMovies();
            }}
          >
            Clear
          </button>
        )}
      </form>

      <div className={styles.movieList}>
        {movies.length === 0 ? (
          <div className={styles.empty}>No movies found</div>
        ) : (
          movies.map((m) => (
            <div key={m.movie_ID}>
              <MovieCard
                movie={m}
                isExpanded={expandedMovie === m.movie_ID}
                onToggleShowTimes={toggleShowTimes}
                onDelete={handleDelete}
                isSupervisor={isSupervisor}
              />
              {expandedMovie === m.movie_ID && (
                <ShowTimeList
                  movieId={m.movie_ID}
                  movieTitle={m.title}
                  movieGenres={m.genre}
                  onSelectShowTime={handleSelectShowTime}
                />
              )}
            </div>
          ))
        )}
      </div>

      {showAddModal && (
        <AddMovieModal
          onClose={() => setShowAddModal(false)}
          onMovieAdded={fetchMovies}
        />
      )}

      {bookingData && (
        <BookingModal
          bookingData={bookingData}
          onClose={handleCloseBooking}
        />
      )}
    </div>
  );
}
