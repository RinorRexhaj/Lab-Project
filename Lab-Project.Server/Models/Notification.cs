using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_Project.Server.Models;

public class Notification
{
    public int Id { get; set; }
    public int ClientId { get; set; }
    public string Type { get; set; } = null!;
    [ForeignKey("ClientId")]
    public Client Client { get; set; } = null!;
}
