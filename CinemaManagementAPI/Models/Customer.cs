namespace CinemaManagementAPI.Models
{
    public class Customer
    {
        public int Customer_ID { get; set; }
        public string First_Name { get; set; } = string.Empty;
        public string Last_Name { get; set; } = string.Empty;
        public DateTime DOB { get; set; }
        public List<string> Phone_No { get; set; } = new List<string>();
    }

}