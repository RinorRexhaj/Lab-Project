using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_Project.Server.Models;

public class Message
{
    public Message() { }
    public int Id { get; set; }
    public string MessageText { get; set; } = null!;
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public DateTime Sent {  get; set; }
    //[ForeignKey("SenderId")]
    //public Client Sender { get; set; } = null!;
    //[ForeignKey("ReceiverId")]
    //public Client Receiver { get; set; } = null!;
}
