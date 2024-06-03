using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_Project.Server.Models;

[PrimaryKey(nameof(OrderID), nameof(ProductID))]
public class OrderDetail
{
    //[Key]
    public int OrderID { get; set; }

    public int ProductID { get; set; }

    public int Quantity { get; set; }

    // Navigation properties
    //public Order Order { get; set; } = null!;
    //public Product Product { get; set; } = null!;
}