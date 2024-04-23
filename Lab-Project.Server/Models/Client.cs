using Microsoft.EntityFrameworkCore;
using System.ComponentModel;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_Project.Server.Models;

[Index(nameof(Email), IsUnique = true)]
public class Client
{
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int Id { get; set; }
    public string FullName { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string? Address { get; set; }
    [MaxLength(13)]
    public string? Phone { get; set; }
    [DefaultValue("User")]
    public string Role { get; set; } = null!;
}
