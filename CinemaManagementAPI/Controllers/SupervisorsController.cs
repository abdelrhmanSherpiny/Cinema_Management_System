using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using CinemaManagementAPI.Models;

namespace CinemaManagementAPI.Controllers
{
    [Route("cms/[controller]")]
    [ApiController]
    public class SupervisorsController : ControllerBase
    {
        private readonly string _connectionString;

        public SupervisorsController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet]
        public IActionResult GetAllSupervisors()
        {
            List<Supervisor> supervisorsList = new List<Supervisor>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Supervisor ORDER BY Supervisor_ID DESC;";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            supervisorsList.Add(new Supervisor
                            {
                                Supervisor_ID = Convert.ToInt32(reader["Supervisor_ID"]),
                                First_Name = reader["First_Name"].ToString(),
                                Last_Name = reader["Last_Name"].ToString(),
                                Salary = reader["Salary"] != DBNull.Value ? Convert.ToInt32(reader["Salary"]) : 0,
                                Hall_No = reader["Hall_No"] != DBNull.Value ? Convert.ToInt32(reader["Hall_No"]) : 0
                            });
                        }
                    }
                }
            }
            return Ok(supervisorsList);
        }

        [HttpGet("search")]
        public IActionResult SearchSupervisors([FromQuery] string? First_Name, [FromQuery] string? Last_Name)
        {
            List<Supervisor> supervisorsList = new List<Supervisor>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT * FROM Supervisor WHERE 1=1";

                if (!string.IsNullOrEmpty(First_Name))
                {
                    query += " AND First_Name LIKE '%' + @First_Name + '%'";
                }

                if (!string.IsNullOrEmpty(Last_Name))
                {
                    query += " AND Last_Name LIKE '%' + @Last_Name + '%'";
                }

                query += " ORDER BY Supervisor_ID DESC;";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    if (!string.IsNullOrEmpty(First_Name))
                    {
                        cmd.Parameters.AddWithValue("@First_Name", First_Name);
                    }

                    if (!string.IsNullOrEmpty(Last_Name))
                    {
                        cmd.Parameters.AddWithValue("@Last_Name", Last_Name);
                    }

                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            supervisorsList.Add(new Supervisor
                            {
                                Supervisor_ID = Convert.ToInt32(reader["Supervisor_ID"]),
                                First_Name = reader["First_Name"].ToString(),
                                Last_Name = reader["Last_Name"].ToString(),
                                Salary = reader["Salary"] != DBNull.Value ? Convert.ToInt32(reader["Salary"]) : 0,
                                Hall_No = reader["Hall_No"] != DBNull.Value ? Convert.ToInt32(reader["Hall_No"]) : 0
                            });
                        }
                    }
                }
            }

            if (supervisorsList.Count == 0)
            {
                return NotFound("No supervisors matched your search criteria.");
            }

            return Ok(supervisorsList);
        }

        [HttpPost]
        public IActionResult AddSupervisor([FromBody] Supervisor newSupervisor)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"IF NOT EXISTS (SELECT 1 FROM Supervisor WHERE First_Name = @First_Name AND Last_Name = @Last_Name) 
                                 BEGIN 
                                     INSERT INTO Supervisor (First_Name, Last_Name, Salary, Hall_No) 
                                     VALUES (@First_Name, @Last_Name, @Salary, @Hall_No); 
                                     SELECT SCOPE_IDENTITY(); 
                                 END 
                                 ELSE 
                                 BEGIN 
                                     SELECT 0; 
                                 END";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@First_Name", newSupervisor.First_Name);
                    cmd.Parameters.AddWithValue("@Last_Name", newSupervisor.Last_Name);
                    cmd.Parameters.AddWithValue("@Salary", newSupervisor.Salary);
                    cmd.Parameters.AddWithValue("@Hall_No", newSupervisor.Hall_No);

                    conn.Open();
                    object result = cmd.ExecuteScalar();
                    int newSupervisorID = result != DBNull.Value && result != null ? Convert.ToInt32(result) : 0;

                    if (newSupervisorID > 0)
                    {
                        return Ok("Supervisor added successfully.");
                    }
                    else
                    {
                        return BadRequest("Supervisor already exists or failed to add.");
                    }
                }
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateSupervisor(int id, [FromBody] Supervisor updatedSupervisor)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE Supervisor 
                                 SET First_Name = @First_Name, Last_Name = @Last_Name, Salary = @Salary, Hall_No = @Hall_No 
                                 WHERE Supervisor_ID = @id;";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@First_Name", updatedSupervisor.First_Name);
                    cmd.Parameters.AddWithValue("@Last_Name", updatedSupervisor.Last_Name);
                    cmd.Parameters.AddWithValue("@Salary", updatedSupervisor.Salary);
                    cmd.Parameters.AddWithValue("@Hall_No", updatedSupervisor.Hall_No);

                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"Supervisor with ID {id} not found.");
                    }
                }
            }
            return Ok($"Supervisor with ID {id} updated successfully.");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteSupervisor(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Supervisor WHERE Supervisor_ID = @id;";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);

                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"Supervisor with ID {id} not found.");
                    }
                }
            }
            return Ok($"Supervisor with ID {id} deleted successfully.");
        }
    }
}
