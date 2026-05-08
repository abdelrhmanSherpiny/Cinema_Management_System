using System.Text.Json.Serialization;

namespace CinemaManagementAPI.Models
{
    public class Show_Time
    {
        public int Show_No { get; set; }
        public DateTime Date { get; set; }

        [JsonIgnore]
        public TimeSpan Start_Time { get; set; }

        [JsonPropertyName("start_Time")]
        public string Start_Time_String => Start_Time.ToString(@"hh\:mm\:ss");

        public Movie Movie { get; set; } = new Movie();
        public Hall Hall { get; set; } = new Hall();
    }
}