namespace CinemaManagementAPI.Models
{
    public class Show_Time
    {
        public int Show_No { get; set; }
        public DateTime Date { get; set; }
        public Movie Movie { get; set; } = new Movie();
        public Hall Hall { get; set; } = new Hall();
    }


}