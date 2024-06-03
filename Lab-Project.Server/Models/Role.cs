using System.ComponentModel.DataAnnotations;

namespace Lab_Project.Server.Models;

public class Role
{
    [Key]
    public string RoleName { get; set; }
}