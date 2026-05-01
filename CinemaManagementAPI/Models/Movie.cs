namespace CinemaManagementAPI.Models
{
    public class Movie
    {
        public int Movie_ID { get; set; }
        public string Title { get; set; } = string.Empty;
        public int Release_Year { get; set; }
        public TimeSpan Duration { get; set; }
        public string Country { get; set; } = string.Empty;
        public List<string> Genre { get; set; } = new List<string>();
        public List<Actor> Actors { get; set; } = new List<Actor>();
    }

}


