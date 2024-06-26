using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_Project.Server.Models;

public class Car
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string ModelName { get; set; } = null!;

    [Column(TypeName = "decimal(5,2)")]
    public decimal Price { get; set; }

    public decimal Mileage { get; set; }
    public decimal Engine { get; set; }
    
    //[ForeignKey("ModelName")]
    //public Model Model { get; set; } = null!;
}
