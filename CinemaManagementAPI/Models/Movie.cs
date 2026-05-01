namespace CinemaManagementAPI.Models
{
    public class Movie
    {
        public int Movie_ID { get; set; }
        public string Title { get; set; } = string.Empty;
        public int Release_Year { get; set; }
        public TimeSpan Duration { get; set; }
        public string Country { get; set; } = string.Empty;

        public int Genre_ID { get; set; }

        public List<Actor> Actors { get; set; } = new List<Actor>();
    }

    public class Actor
    {
        public int Actor_ID { get; set; }
        public string Name { get; set; } = string.Empty;
        public DateTime Birth_Date { get; set; }
        public string Nationality { get; set; } = string.Empty;
    }

    public class Genre
    {
        public int Genre_ID { get; set; }
        public string Name { get; set; } = string.Empty;
    }
}


