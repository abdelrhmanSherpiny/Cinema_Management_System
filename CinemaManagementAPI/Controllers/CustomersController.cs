using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using CinemaManagementAPI.Models;

namespace CinemaManagementAPI.Controllers
{
    [Route("cms/[controller]")]
    [ApiController]
    public class CustomersController : ControllerBase
    {
        private readonly string _connectionString;

        public CustomersController(IConfiguration configuration)
        {
            _connectionString = configuration.GetConnectionString("DefaultConnection");
        }

        [HttpGet]
        public IActionResult GetAllCustomers()
        {
            List<Customer> customersList = new List<Customer>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "SELECT c.Customer_ID, c.First_Name, c.Last_Name, c.DOB, STRING_AGG(p.Phone_No, ', ') AS PhonesCSV FROM Customer c LEFT JOIN Customer_Phone_Number p ON c.Customer_ID = p.Customer_ID GROUP BY c.Customer_ID, c.First_Name, c.Last_Name, c.DOB;";
                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    conn.Open();
                    using (SqlDataReader reader = cmd.ExecuteReader())
                    {
                        while (reader.Read())
                        {
                            customersList.Add(new Customer
                            {
                                Customer_ID = Convert.ToInt32(reader["Customer_ID"]),
                                First_Name = reader["First_Name"].ToString(),
                                Last_Name = reader["Last_Name"].ToString(),
                                DOB = reader["DOB"] != DBNull.Value ? Convert.ToDateTime(reader["DOB"]) : DateTime.MinValue,
                                Phone_No = reader["PhonesCSV"] != DBNull.Value ? reader["PhonesCSV"].ToString().Split(',').Select(s => s.Trim()).ToList() : new List<string>()
                            });
                        }
                    }
                }
            }
            return Ok(customersList);
        }

        [HttpGet("search")]
        public IActionResult SearchCustomers([FromQuery] string? First_Name, [FromQuery] string? Last_Name)
        {
            List<Customer> customersList = new List<Customer>();

            using (SqlConnection conn = new SqlConnection(_connectionString))
            {

                string query = "SELECT c.Customer_ID, c.First_Name, c.Last_Name, c.DOB, STRING_AGG(p.Phone_No, ', ') AS PhonesCSV FROM Customer c LEFT JOIN Customer_Phone_Number p ON c.Customer_ID = p.Customer_ID WHERE 1=1";

                if (!string.IsNullOrEmpty(First_Name))
                {
                    query += " AND c.First_Name LIKE '%" + First_Name + "%'";
                }

                if (!string.IsNullOrEmpty(Last_Name))
                {
                    query += " AND c.Last_Name LIKE '%" + Last_Name + "%'";
                }

                query += "GROUP BY c.Customer_ID, c.First_Name, c.Last_Name, c.DOB;";

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
                            customersList.Add(new Customer
                            {
                                Customer_ID = Convert.ToInt32(reader["Customer_ID"]),
                                First_Name = reader["First_Name"].ToString(),
                                Last_Name = reader["Last_Name"].ToString(),
                                DOB = reader["DOB"] != DBNull.Value ? Convert.ToDateTime(reader["DOB"]) : DateTime.MinValue,
                                Phone_No = reader["PhonesCSV"] != DBNull.Value ? reader["PhonesCSV"].ToString().Split(',').Select(s => s.Trim()).ToList() : new List<string>()
                            });
                        }
                    }
                }

            }

            if (customersList.Count == 0)
            {
                return NotFound("No customers matched your search criteria.");
            }

            return Ok(customersList);
        }


        [HttpPost]
        public IActionResult AddCustomer([FromBody] Customer newCustomer)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                int newCustomerID = 0;
                string query = @"INSERT INTO Customer (First_Name, Last_Name, DOB) 
                                 VALUES (@First_Name, @Last_Name, @DOB); SELECT SCOPE_IDENTITY();";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@First_Name", newCustomer.First_Name);
                    cmd.Parameters.AddWithValue("@Last_Name", newCustomer.Last_Name);
                    cmd.Parameters.AddWithValue("@DOB", newCustomer.DOB);

                    conn.Open();
                    newCustomerID = Convert.ToInt32(cmd.ExecuteScalar());
                }

                if (newCustomer.Phone_No != null && newCustomer.Phone_No.Count > 0)
                {
                    foreach (var phone in newCustomer.Phone_No)
                    {
                        string phone_query = "INSERT INTO Customer_Phone_Number (Customer_ID, Phone_No) VALUES (@Customer_ID, @Phone_No);";
                        using (SqlCommand phone_cmd = new SqlCommand(phone_query, conn))
                        {
                            phone_cmd.Parameters.AddWithValue("@Customer_ID", newCustomerID);
                            phone_cmd.Parameters.AddWithValue("@Phone_No", phone);
                            phone_cmd.ExecuteNonQuery();
                        }
                    }
                }

                if (newCustomerID > 0)
                {
                    return Ok("Customer added successfully.");
                }
                else
                {
                    return BadRequest("Failed to add the customer.");
                }
            }
        }

        [HttpPut("{id}")]
        public IActionResult UpdateCustomer(int id, [FromBody] Customer updatedCustomer)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = @"UPDATE Customer SET First_Name = @First_Name, Last_Name = @Last_Name, DOB = @DOB WHERE Customer_ID = @id;";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);
                    cmd.Parameters.AddWithValue("@First_Name", updatedCustomer.First_Name);
                    cmd.Parameters.AddWithValue("@Last_Name", updatedCustomer.Last_Name);
                    cmd.Parameters.AddWithValue("@DOB", updatedCustomer.DOB);

                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"Customer with ID {id} not found.");
                    }
                }

                // Update Phone Numbers by deleting existing ones and inserting new ones
                string deletePhonesQuery = "DELETE FROM Customer_Phone_Number WHERE Customer_ID = @id;";
                using (SqlCommand deleteCmd = new SqlCommand(deletePhonesQuery, conn))
                {
                    deleteCmd.Parameters.AddWithValue("@id", id);
                    deleteCmd.ExecuteNonQuery();
                }

                if (updatedCustomer.Phone_No != null && updatedCustomer.Phone_No.Count > 0)
                {
                    foreach (var phone in updatedCustomer.Phone_No)
                    {
                        string phone_query = "INSERT INTO Customer_Phone_Number (Customer_ID, Phone_No) VALUES (@Customer_ID, @Phone_No);";
                        using (SqlCommand phone_cmd = new SqlCommand(phone_query, conn))
                        {
                            phone_cmd.Parameters.AddWithValue("@Customer_ID", id);
                            phone_cmd.Parameters.AddWithValue("@Phone_No", phone);
                            phone_cmd.ExecuteNonQuery();
                        }
                    }
                }
            }
            return Ok($"Customer with ID {id} updated successfully.");
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteCustomer(int id)
        {
            using (SqlConnection conn = new SqlConnection(_connectionString))
            {
                string query = "DELETE FROM Customer_Phone_Number WHERE Customer_ID = @id; DELETE FROM Customer WHERE Customer_ID = @id;";

                using (SqlCommand cmd = new SqlCommand(query, conn))
                {
                    cmd.Parameters.AddWithValue("@id", id);

                    conn.Open();
                    int rowsAffected = cmd.ExecuteNonQuery();

                    if (rowsAffected == 0)
                    {
                        return NotFound($"Customer with ID {id} not found.");
                    }
                }
            }
            return Ok($"Customer with ID {id} deleted successfully.");
        }
    }
}
