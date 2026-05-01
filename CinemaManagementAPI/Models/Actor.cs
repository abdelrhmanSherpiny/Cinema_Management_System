namespace CinemaManagementAPI.Models
{
    public class Actor
    {
        public int Actor_ID { get; set; }
        public string First_Name { get; set; } = string.Empty;
        public string Last_Name { get; set; } = string.Empty;
        public DateTime DOB { get; set; }
        public string Nationality { get; set; } = string.Empty;
    }

}