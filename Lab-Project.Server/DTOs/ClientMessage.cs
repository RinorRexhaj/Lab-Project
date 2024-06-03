using Lab_Project.Server.Models;

namespace Lab_Project.Server.DTOs;

public class ClientMessage
{
    public int Id { get; set; }
    public string FullName { get; set; }
    public Message LastMessage { get; set; }
    public int UnSeenMessages { get; set; }
    public bool Active { get; set; }
}
