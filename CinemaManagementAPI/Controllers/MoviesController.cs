using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using CinemaManagementAPI.Models;

namespace CinemaManagementAPI.Controllers
{
    [Route("cms/[controller]")]
    [ApiController]
    public class MoviesController : ControllerBase
    {
        private readonly string _connectionString;

        public MoviesController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet]
        public IActionResult GetAllMovies()
        {
            List<Movie> moviesList = new List<Movie>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string movie_query = "SELECT m.Movie_ID, m.Title, m.Release_Year, m.Duration, m.Country, STRING_AGG(g.Genre, ', ') AS GenresCSV FROM Movie m LEFT JOIN Genre_Of_Movie g ON m.Movie_ID = g.Movie_ID GROUP BY m.Movie_ID, m.Title, m.Release_Year, m.Duration, m.Country ORDER by Release_Year DESC;";
                using (SqlCommand movie_cmd = new SqlCommand(movie_query, conn))
                {
                    conn.Open();
                    using (SqlDataReader movie_reader = movie_cmd.ExecuteReader())
                    {
                        while (movie_reader.Read())
                        {
                            moviesList.Add(new Movie
                            {
                                Movie_ID = Convert.ToInt32(movie_reader["Movie_ID"]),
                                Title = movie_reader["Title"].ToString(),
                                Release_Year = Convert.ToInt32(movie_reader["Release_Year"]),
                                Duration = (TimeSpan)movie_reader["Duration"],
                                Country = movie_reader["Country"].ToString(),
                                Genre = movie_reader["GenresCSV"].ToString().Split(',').Select(s => s.Trim()).ToList()
                            });

                        }
                    }
                }

                foreach (var movie in moviesList)
                {
                    string actor_query = "SELECT a.Actor_ID, a.First_Name, a.Last_Name, a.Nationality, a.DOB FROM Stars_In s INNER JOIN Actor a ON a.Actor_ID = s.Actor_ID AND s.Movie_ID = @Movie_ID;";
                    using (SqlCommand actor_cmd = new SqlCommand(actor_query, conn))
                    {
                        actor_cmd.Parameters.AddWithValue("@Movie_ID", movie.Movie_ID);

                        using (SqlDataReader actor_reader = actor_cmd.ExecuteReader())
                        {

                            while (actor_reader.Read())
                            {
                                movie.Actors.Add(new Actor
                                {
                                    Actor_ID = Convert.ToInt32(actor_reader["Actor_ID"]),
                                    First_Name = actor_reader["First_Name"].ToString(),
                                    Last_Name = actor_reader["Last_Name"].ToString(),
                                    Nationality = actor_reader["Nationality"].ToString(),
                                    DOB = Convert.ToDateTime(actor_reader["DOB"])
                                });
                            }
                        }
                    }

                }

            }
            return Ok(moviesList);
        }

        [HttpGet("search")]
        public IActionResult SearchMovies([FromQuery] string? Title, [FromQuery] string? Genre)
        {
            List<Movie> moviesList = new List<Movie>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {

                string query = "SELECT * FROM (SELECT m.Movie_ID, m.Title, m.Release_Year, m.Duration, m.Country,STRING_AGG(g.Genre, ', ') AS GenresCSV FROM Movie m LEFT JOIN Genre_Of_Movie g  ON m.Movie_ID = g.Movie_ID  GROUP BY m.Movie_ID, m.Title, m.Release_Year, m.Duration, m.Country)  AS Movies_With_Genres WHERE 1=1";

                if (!string.IsNullOrEmpty(Title))
                {
                    query += " AND Title LIKE '%" + Title + "%'";
                }

                if (!string.IsNullOrEmpty(Genre))
                {
                    query += " AND GenresCSV LIKE '%" + Genre + "%'";
                }

                query += " ORDER BY Release_Year DESC;";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    if (!string.IsNullOrEmpty(Title))
                    {
                        cmd.Parameters.AddWithValue("@Title", Title);
                    }

                    if (!string.IsNullOrEmpty(Genre))
                    {
                        cmd.Parameters.AddWithValue("@Genre", Genre);
                    }

                    conn.Open();
                    using (SqlDataReader movie_reader = cmd.ExecuteReader())
                    {
                        while (movie_reader.Read())
                        {
                            moviesList.Add(new Movie
                            {
                                Movie_ID = Convert.ToInt32(movie_reader["Movie_ID"]),
                                Title = movie_reader["Title"].ToString(),
                                Release_Year = Convert.ToInt32(movie_reader["Release_Year"]),
                                Duration = (TimeSpan)movie_reader["Duration"],
                                Country = movie_reader["Country"].ToString(),
                                Genre = movie_reader["GenresCSV"].ToString().Split(',').Select(s => s.Trim()).ToList()
                            });
                        }
                    }
                }
                foreach (var movie in moviesList)
                {
                    string actor_query = "SELECT a.Actor_ID, a.First_Name, a.Last_Name, a.Nationality, a.DOB FROM Stars_In s INNER JOIN Actor a ON a.Actor_ID = s.Actor_ID AND s.Movie_ID = @Movie_ID;";
                    using (SqlCommand actor_cmd = new SqlCommand(actor_query, conn))
                    {
                        actor_cmd.Parameters.AddWithValue("@Movie_ID", movie.Movie_ID);

                        using (SqlDataReader actor_reader = actor_cmd.ExecuteReader())
                        {

                            while (actor_reader.Read())
                            {
                                movie.Actors.Add(new Actor
                                {
                                    Actor_ID = Convert.ToInt32(actor_reader["Actor_ID"]),
                                    First_Name = actor_reader["First_Name"].ToString(),
                                    Last_Name = actor_reader["Last_Name"].ToString(),
                                    Nationality = actor_reader["Nationality"].ToString(),
                                    DOB = Convert.ToDateTime(actor_reader["DOB"])
                                });
                            }
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

        [HttpPost]
        public IActionResult AddMovie([FromBody] Movie newMovie)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                int newMovieID = 0;
                string query = @"INSERT INTO Movie (Title, Release_Year, Duration, Country) 
                                 VALUES (@Title, @Release_Year, @Duration, @Country); SELECT SCOPE_IDENTITY();";

                using (SqlCommand movie_cmd = new SqlCommand(query, conn))
                {
                    movie_cmd.Parameters.AddWithValue("@Title", newMovie.Title);
                    movie_cmd.Parameters.AddWithValue("@Release_Year", newMovie.Release_Year);
                    movie_cmd.Parameters.AddWithValue("@Duration", newMovie.Duration);
                    movie_cmd.Parameters.AddWithValue("@Country", newMovie.Country);

                    conn.Open();
                    newMovieID = Convert.ToInt32(movie_cmd.ExecuteScalar());


                }
                foreach (var genre in newMovie.Genre)
                {
                    string genre_query = "INSERT INTO Genre_Of_Movie (Movie_ID, Genre) VALUES (@Movie_ID, @Genre);";
                    using (SqlCommand genre_cmd = new SqlCommand(genre_query, conn))
                    {
                        genre_cmd.Parameters.AddWithValue("@Movie_ID", newMovieID);
                        genre_cmd.Parameters.AddWithValue("@Genre", genre);
                        genre_cmd.ExecuteNonQuery();
                    }
                }

                foreach (var actor in newMovie.Actors)
                {
                    int actorID = 0;
                    string actor_query = @"IF NOT EXISTS (SELECT 1 FROM Actor WHERE First_Name = @First_Name AND Last_Name = @Last_Name) BEGIN INSERT INTO Actor (First_Name, Last_Name, Nationality, DOB) VALUES (@First_Name, @Last_Name, @Nationality, @DOB); SELECT SCOPE_IDENTITY(); END ELSE BEGIN SELECT Actor_ID FROM Actor WHERE First_Name = @First_Name AND Last_Name = @Last_Name; END";
                    using (SqlCommand actor_cmd = new SqlCommand(actor_query, conn))
                    {
                        actor_cmd.Parameters.AddWithValue("@First_Name", actor.First_Name);
                        actor_cmd.Parameters.AddWithValue("@Last_Name", actor.Last_Name);
                        actor_cmd.Parameters.AddWithValue("@Nationality", actor.Nationality);
                        actor_cmd.Parameters.AddWithValue("@DOB", actor.DOB);
                        actorID = Convert.ToInt32(actor_cmd.ExecuteScalar());
                    }

                    string star_query = "INSERT INTO Stars_In (Movie_ID, Actor_ID) VALUES (@Movie_ID, @Actor_ID);";
                    using (SqlCommand star_cmd = new SqlCommand(star_query, conn))
                    {
                        star_cmd.Parameters.AddWithValue("@Movie_ID", newMovieID);
                        star_cmd.Parameters.AddWithValue("@Actor_ID", actorID);
                        star_cmd.ExecuteNonQuery();
                    }
                }

                if (newMovieID > 0)
                {
                    return Ok("Movie added successfully.");
                }
                else
                {
                    return BadRequest("Failed to add the movie.");
                }
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateMovie(int id, [FromBody] Movie updatedMovie)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE Movie SET Title = @Title, Release_Year = @Release_Year, Duration = @Duration, Country = @Country WHERE Movie_ID = @id;";

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

        [HttpDelete("{id}")]
        public IActionResult DeleteMovie(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Stars_In WHERE Movie_ID = @id; DELETE FROM Genre_Of_Movie WHERE Movie_ID = @id;DELETE FROM Movie WHERE Movie_ID = @id;";

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


    }
}