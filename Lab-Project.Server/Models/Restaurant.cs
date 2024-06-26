using System.ComponentModel.DataAnnotations;

namespace Lab_Project.Server.Models
{
    public class Restaurant
    {
        public int Id { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Category { get; set; }

        [Range(1, 5)]
        public int Stars { get; set; }

        [Required]
        public string PriceRange { get; set; }
    }
}
