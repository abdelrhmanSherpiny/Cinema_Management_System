using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using CinemaManagementAPI.Models;

namespace CinemaManagementAPI.Controllers
{
    [Route("cms/[controller]")]
    [ApiController]
    public class HallsController : ControllerBase
    {
        private readonly string _connectionString;

        public HallsController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet]
        public IActionResult GetAllHalls()
        {
            List<Hall> hallsList = new List<Hall>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Hall ORDER BY Hall_No;";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            hallsList.Add(new Hall
                            {
                                Hall_No = Convert.ToInt32(reader["Hall_No"]),
                                Max_Capacity = Convert.ToInt32(reader["Max_Capacity"])
                            });
                        }
                    }
                }
            }
            return Ok(hallsList);
        }

        [HttpGet("{hallNo}/seats")]
        public IActionResult GetSeatsByHall(int hallNo)
        {
            List<Seat> seatsList = new List<Seat>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT Seat_No, Row_Letter, Seat_Type, Hall_No FROM Seat WHERE Hall_No = @Hall_No ORDER BY Row_Letter, Seat_No;";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Hall_No", hallNo);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            seatsList.Add(new Seat
                            {
                                Seat_No = Convert.ToInt32(reader["Seat_No"]),
                                Row_Letter = Convert.ToChar(reader["Row_Letter"].ToString().Trim()),
                                Seat_Type = reader["Seat_Type"].ToString()
                            });
                        }
                    }
                }
            }
            return Ok(seatsList);
        }

        [HttpGet("{hallNo}/seats/booked")]
        public IActionResult GetBookedSeats(int hallNo, [FromQuery] int showNo)
        {
            List<object> bookedSeats = new List<object>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT Seat_No, Row_Letter FROM Ticket WHERE Hall_No = @Hall_No AND Show_No = @Show_No;";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Hall_No", hallNo);
                    cmd.Parameters.AddWithValue("@Show_No", showNo);
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            bookedSeats.Add(new
                            {
                                seat_No = Convert.ToInt32(reader["Seat_No"]),
                                row_Letter = reader["Row_Letter"].ToString().Trim()
                            });
                        }
                    }
                }
            }
            return Ok(bookedSeats);
        }
    }
}
