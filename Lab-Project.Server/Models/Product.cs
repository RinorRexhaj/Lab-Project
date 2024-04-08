using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_Project.Server.Models;

public class Product
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Category { get; set; } = null!;
    [Column(TypeName = "decimal(6,2)")]
    public decimal Price { get; set; }
    public string? Image {  get; set; }
}
