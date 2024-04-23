using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_Project.Server.Models;

public class Car
{
    [Key]
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Model { get; set; } = null!;
    [Column(TypeName = "decimal(6,2)")]
    public decimal Price { get; set; }
}