using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_Project.Server.Models;

public class Client
{
    public int Id { get; set; }
    public string FullName { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? Address { get; set; }
    [MaxLength(13)]
    public string? Phone { get; set; }
}
