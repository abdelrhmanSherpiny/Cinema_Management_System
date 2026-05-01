namespace CinemaManagementAPI.Models
{
    public class Seat
    {
        public int Seat_No { get; set; }
        public char Row_Letter { get; set; }
        public string Seat_Type { get; set; } = string.Empty;
    }

}