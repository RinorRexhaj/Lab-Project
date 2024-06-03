using Lab_Project.Server.Models;

namespace Lab_Project.Server.DTOs;

public class OrderDTO
{
    public Order Order { get; set; }
    public OrderDetail[] OrderDetails { get; set; }
    public double Total { get; set; }
}
