namespace CinemaManagementAPI.Models
{
    public class Hall
    {
        public int Hall_No { get; set; }
        public int Max_Capacity { get; set; }
        public List<Seat> Seats { get; set; } = new List<Seat>();
        public List<Supervisor> Supervisors { get; set; } = new List<Supervisor>();
    }

}