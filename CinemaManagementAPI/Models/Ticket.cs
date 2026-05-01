namespace CinemaManagementAPI.Models
{
    public class Ticket
    {
        public int Ticket_ID { get; set; }
        public decimal Price { get; set; }
        public int Purchase_No { get; set; }
        public int Show_No { get; set; }
        public int Seat_No { get; set; }
        public char Row_Letter { get; set; }
        public int Hall_No { get; set; }
        public int Customer_ID { get; set; }
    }
}