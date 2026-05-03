using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using CinemaManagementAPI.Models;

namespace CinemaManagementAPI.Controllers
{
    [Route("cms/[controller]")]
    [ApiController]
    public class ShowTimesController : ControllerBase
    {
        private readonly string _connectionString;

        public ShowTimesController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet]
        public IActionResult GetAllShowTimes()
        {
            List<Show_Time> showTimesList = new List<Show_Time>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"SELECT s.Show_No, s.Date, s.Start_Time, s.Movie_ID, s.Hall_No, m.Title 
                                 FROM Show_Time s 
                                 LEFT JOIN Movie m ON s.Movie_ID = m.Movie_ID ORDER BY s.Date,s.Start_Time DESC;";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            showTimesList.Add(new Show_Time
                            {
                                Show_No = Convert.ToInt32(reader["Show_No"]),
                                Date = reader["Date"] != DBNull.Value ? Convert.ToDateTime(reader["Date"]) : DateTime.MinValue,
                                Movie = new Movie
                                {
                                    Movie_ID = reader["Movie_ID"] != DBNull.Value ? Convert.ToInt32(reader["Movie_ID"]) : 0,
                                    Title = reader["Title"] != DBNull.Value ? reader["Title"].ToString() : string.Empty
                                },
                                Hall = new Hall
                                {
                                    Hall_No = reader["Hall_No"] != DBNull.Value ? Convert.ToInt32(reader["Hall_No"]) : 0
                                }
                            });
                        }
                    }
                }
            }
            return Ok(showTimesList);
        }


        [HttpPost]
        public IActionResult AddShowTime([FromBody] Show_Time newShowTime)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"INSERT INTO Show_Time (Date, Start_Time, Movie_ID, Hall_No) 
                                 VALUES (@Date, @Start_Time, @Movie_ID, @Hall_No);";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Date", newShowTime.Date);
                    cmd.Parameters.AddWithValue("@Start_Time", newShowTime.Start_Time);
                    cmd.Parameters.AddWithValue("@Movie_ID", newShowTime.Movie.Movie_ID);
                    cmd.Parameters.AddWithValue("@Hall_No", newShowTime.Hall.Hall_No);

                    conn.Open();
                    cmd.ExecuteNonQuery();
                }

                return Ok("ShowTime added successfully.");
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateShowTime(int id, [FromBody] Show_Time updatedShowTime)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE Show_Time 
                                 SET Date = @Date, Start_Time = @Start_Time, Movie_ID = @Movie_ID, Hall_No = @Hall_No 
                                 WHERE Show_No = @id;";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@Date", updatedShowTime.Date);
                    cmd.Parameters.AddWithValue("@Start_Time", updatedShowTime.Start_Time);
                    cmd.Parameters.AddWithValue("@Movie_ID", updatedShowTime.Movie.Movie_ID);
                    cmd.Parameters.AddWithValue("@Hall_No", updatedShowTime.Hall.Hall_No);

                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"ShowTime with ID {id} not found.");
                    }
                }
            }
            return Ok($"ShowTime with ID {id} updated successfully.");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteShowTime(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Show_Time WHERE Show_No = @id;";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);

                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"ShowTime with ID {id} not found.");
                    }
                }
            }
            return Ok($"ShowTime with ID {id} deleted successfully.");
        }
    }
}
