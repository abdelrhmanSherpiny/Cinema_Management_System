namespace CinemaManagementAPI.Models
{
    public class Supervisor
    {
        public int Supervisor_ID { get; set; }
        public string First_Name { get; set; } = string.Empty;
        public string Last_Name { get; set; } = string.Empty;
        public int Salary { get; set; }
        public int Hall_No { get; set; }
    }

}