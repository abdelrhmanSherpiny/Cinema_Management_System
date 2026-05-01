using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using CinemaManagementAPI.Models;

namespace CinemaManagementAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly string _connectionString;

        public MoviesController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        // 1. GET ALL: api/movies
        [HttpGet]
        public IActionResult GetAllMovies()
        {
            List<Movie> moviesList = new List<Movie>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Movie;";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            moviesList.Add(new Movie
                            {
                                Movie_ID = Convert.ToInt32(reader["Movie_ID"]),
                                Title = reader["Title"].ToString(),
                                Release_Year = Convert.ToInt32(reader["Release_Year"]),
                                Duration = (TimeSpan)reader["Duration"],
                                Country = reader["Country"].ToString()
                            });
                        }
                    }
                }
            }
            return Ok(moviesList);
        }

        // 2. GET BY ID (With Parameter): api/movies/1
        [HttpGet("{id}")]
        public IActionResult GetMovieById(int id)
        {
            Movie movie = null;

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                // We use @id as a safe placeholder
                string query = "SELECT * FROM Movie WHERE Movie_ID = @id;";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    // Here we link the C# variable 'id' to the SQL placeholder '@id'
                    cmd.Parameters.AddWithValue("@id", id);
                    conn.Open();

                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        if (reader.Read()) // We only expect one row, so we use 'if' instead of 'while'
                        {
                            movie = new Movie
                            {
                                Movie_ID = Convert.ToInt32(reader["Movie_ID"]),
                                Title = reader["Title"].ToString(),
                                Release_Year = Convert.ToInt32(reader["Release_Year"]),
                                Duration = (TimeSpan)reader["Duration"],
                                Country = reader["Country"].ToString()
                            };
                        }
                    }
                }
            }

            // If the database didn't find the ID, return a 404 Not Found error
            if (movie == null)
            {
                return NotFound($"Movie with ID {id} not found.");
            }

            return Ok(movie);
        }

        // 3. POST (Insert): api/movies
        [HttpPost]
        public IActionResult AddMovie([FromBody] Movie newMovie)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"INSERT INTO Movie (Movie_ID, Title, Release_Year, Duration, Country) 
                                 VALUES (@Movie_ID, @Title, @Release_Year, @Duration, @Country);";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    // Map the incoming JSON object to the SQL parameters
                    cmd.Parameters.AddWithValue("@Movie_ID", newMovie.Movie_ID);
                    cmd.Parameters.AddWithValue("@Title", newMovie.Title);
                    cmd.Parameters.AddWithValue("@Release_Year", newMovie.Release_Year);
                    cmd.Parameters.AddWithValue("@Duration", newMovie.Duration);
                    cmd.Parameters.AddWithValue("@Country", newMovie.Country);

                    conn.Open();
                    // ExecuteNonQuery is used for Insert, Update, Delete. It returns the number of rows affected.
                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected > 0)
                    {
                        return Ok("Movie added successfully.");
                    }
                    else
                    {
                        return BadRequest("Failed to add the movie.");
                    }
                }
            }
        }

        // 4. PUT (Update): api/movies/1
        [HttpPut("{id}")]
        public IActionResult UpdateMovie(int id, [FromBody] Movie updatedMovie)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE Movie 
                                 SET Title = @Title, Release_Year = @Release_Year, 
                                     Duration = @Duration, Country = @Country 
                                 WHERE Movie_ID = @id;";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@Title", updatedMovie.Title);
                    cmd.Parameters.AddWithValue("@Release_Year", updatedMovie.Release_Year);
                    cmd.Parameters.AddWithValue("@Duration", updatedMovie.Duration);
                    cmd.Parameters.AddWithValue("@Country", updatedMovie.Country);

                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"Movie with ID {id} not found.");
                    }
                }
            }
            return Ok($"Movie with ID {id} updated successfully.");
        }

        // 5. DELETE: api/movies/1
        [HttpDelete("{id}")]
        public IActionResult DeleteMovie(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Movie WHERE Movie_ID = @id;";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);

                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"Movie with ID {id} not found.");
                    }
                }
            }
            return Ok($"Movie with ID {id} deleted successfully.");
        }

        // GET: api/movies/search?minYear=2010&country=USA
        [HttpGet("search")]
        public IActionResult SearchMovies([FromQuery] int? minYear, [FromQuery] string? country)
        {
            List<Movie> moviesList = new List<Movie>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                // 1. The Base Query. We use "WHERE 1=1" as a clever trick. 
                // 1=1 is always true, which makes it easy to safely append "AND..." statements later.
                string query = "SELECT * FROM Movie WHERE 1=1";

                // 2. Build the query dynamically based on what the user provided
                if (minYear.HasValue)
                {
                    query += " AND Release_Year >= @MinYear";
                }

                if (!string.IsNullOrEmpty(country))
                {
                    query += " AND Country = @Country";
                }

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    // 3. Only inject the parameters if they were actually used in the query
                    if (minYear.HasValue)
                    {
                        cmd.Parameters.AddWithValue("@MinYear", minYear.Value);
                    }

                    if (!string.IsNullOrEmpty(country))
                    {
                        cmd.Parameters.AddWithValue("@Country", country);
                    }

                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            moviesList.Add(new Movie
                            {
                                Movie_ID = Convert.ToInt32(reader["Movie_ID"]),
                                Title = reader["Title"].ToString(),
                                Release_Year = Convert.ToInt32(reader["Release_Year"]),
                                Duration = (TimeSpan)reader["Duration"],
                                Country = reader["Country"].ToString()
                            });
                        }
                    }
                }
            }

            if (moviesList.Count == 0)
            {
                return NotFound("No movies matched your search criteria.");
            }

            return Ok(moviesList);
        }
    }
}