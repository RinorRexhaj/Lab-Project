using System.ComponentModel.DataAnnotations;

namespace Lab_Project.Server.Models;

public class Category
{
    [Key]
    public string CategoryName { get; set; } = null!;
}
