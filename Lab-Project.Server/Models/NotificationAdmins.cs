using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_Project.Server.Models;

public class NotificationAdmins
{
    public int Id { get; set; }
    public int NotificationId { get; set; }
    public int AdminId { get; set; }
    [ForeignKey("NotificationId")]
    public Notification Notification { get; set; } = null!;
    [ForeignKey("AdminId")]
    public Client Admin { get; set; } = null!;
}
