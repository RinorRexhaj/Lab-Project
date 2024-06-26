namespace Lab_Project.Server.DTOs;

public class ClientChangeDTO
{
    public int Id { get; set; }
    public string FullName { get; set; } = null!;
    public string? Phone { get; set; }
    public string? Address { get; set; }
    public string? Role { get; set; }
}
