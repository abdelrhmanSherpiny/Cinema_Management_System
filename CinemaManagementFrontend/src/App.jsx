import { useState, useEffect } from 'react'
import './App.css'

function App() {
  // This is React's state management (similar to managing state in Cubit)
  const [movies, setMovies] = useState([]);

  // useEffect runs automatically when the component loads
  useEffect(() => {
    // Replace this URL with your actual C# API URL
    fetch('http://localhost:5246/cms/movies')
      .then(response => response.json())
      .then(data => {
        setMovies(data); // Save the database JSON into our state
      })
      .catch(error => console.error("Error fetching movies:", error));
  }, []);

  return (
    <div>
      <h1>Cinema Movies</h1>
      <div className="movie-grid">
        {/* We loop through the state and build UI for each movie */}
        {movies.map(movie => (
          <div key={movie.movie_ID} className="movie-card">
            <h3>{movie.title}</h3>
            <p>Year: {movie.release_Year}</p>
            <p>Country: {movie.country}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App