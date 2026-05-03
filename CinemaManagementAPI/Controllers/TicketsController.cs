using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using CinemaManagementAPI.Models;

namespace CinemaManagementAPI.Controllers
{
    [Route("cms/[controller]")]
    [ApiController]
    public class TicketsController : ControllerBase
    {
        private readonly string _connectionString;

        public TicketsController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet]
        public IActionResult GetAllTickets()
        {
            List<Ticket> ticketsList = new List<Ticket>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Ticket ORDER BY Ticket_ID DESC;";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            ticketsList.Add(new Ticket
                            {
                                Ticket_ID = Convert.ToInt32(reader["Ticket_ID"]),
                                Price = reader["Price"] != DBNull.Value ? Convert.ToDecimal(reader["Price"]) : 0,
                                // Assuming Purchase_No maps to Purchase_TS or we leave it default since it's a type mismatch in models
                                Show_No = reader["Show_No"] != DBNull.Value ? Convert.ToInt32(reader["Show_No"]) : 0,
                                Seat_No = reader["Seat_No"] != DBNull.Value ? Convert.ToInt32(reader["Seat_No"]) : 0,
                                Row_Letter = reader["Row_Letter"] != DBNull.Value ? Convert.ToChar(reader["Row_Letter"].ToString().Trim()) : ' ',
                                Hall_No = reader["Hall_No"] != DBNull.Value ? Convert.ToInt32(reader["Hall_No"]) : 0,
                                Customer_ID = reader["Customer_ID"] != DBNull.Value ? Convert.ToInt32(reader["Customer_ID"]) : 0
                            });
                        }
                    }
                }
            }
            return Ok(ticketsList);
        }


        [HttpPost]
        public IActionResult AddTicket([FromBody] Ticket newTicket)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"INSERT INTO Ticket (Price, Show_No, Seat_No, Row_Letter, Hall_No, Customer_ID) 
                                 VALUES (@Price, @Show_No, @Seat_No, @Row_Letter, @Hall_No, @Customer_ID); SELECT SCOPE_IDENTITY();";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@Price", newTicket.Price);
                    cmd.Parameters.AddWithValue("@Show_No", newTicket.Show_No);
                    cmd.Parameters.AddWithValue("@Seat_No", newTicket.Seat_No);
                    cmd.Parameters.AddWithValue("@Row_Letter", newTicket.Row_Letter);
                    cmd.Parameters.AddWithValue("@Hall_No", newTicket.Hall_No);
                    cmd.Parameters.AddWithValue("@Customer_ID", newTicket.Customer_ID);

                    conn.Open();
                    int newTicketID = Convert.ToInt32(cmd.ExecuteScalar());

                    if (newTicketID > 0)
                    {
                        return Ok("Ticket added successfully.");
                    }
                    else
                    {
                        return BadRequest("Failed to add the ticket.");
                    }
                }
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateTicket(int id, [FromBody] Ticket updatedTicket)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE Ticket 
                                 SET Price = @Price, Show_No = @Show_No, Seat_No = @Seat_No, Row_Letter = @Row_Letter, Hall_No = @Hall_No, Customer_ID = @Customer_ID 
                                 WHERE Ticket_ID = @id;";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@Price", updatedTicket.Price);
                    cmd.Parameters.AddWithValue("@Show_No", updatedTicket.Show_No);
                    cmd.Parameters.AddWithValue("@Seat_No", updatedTicket.Seat_No);
                    cmd.Parameters.AddWithValue("@Row_Letter", updatedTicket.Row_Letter);
                    cmd.Parameters.AddWithValue("@Hall_No", updatedTicket.Hall_No);
                    cmd.Parameters.AddWithValue("@Customer_ID", updatedTicket.Customer_ID);

                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"Ticket with ID {id} not found.");
                    }
                }
            }
            return Ok($"Ticket with ID {id} updated successfully.");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteTicket(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Ticket WHERE Ticket_ID = @id;";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);

                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"Ticket with ID {id} not found.");
                    }
                }
            }
            return Ok($"Ticket with ID {id} deleted successfully.");
        }
    }
}
