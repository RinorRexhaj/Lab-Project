using Lab_Project.Server.Models;

namespace Lab_Project.Server.DTOs;

public class TopRevenueProductDTO
{
    public Product Product { get; set; }
    public decimal Total { get; set; }
    public int Count { get; set; }
}
