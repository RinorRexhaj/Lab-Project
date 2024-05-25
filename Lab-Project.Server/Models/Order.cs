using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_Project.Server.Models;

public class Order
{
    [Key]
    public int OrderID { get; set; }
    public DateTime SetDate { get; set; }
    public DateTime ArrivalDate { get; set; }

    [ForeignKey("Client")]
    public int ClientID { get; set; }
    //public Client Client { get; set; }

    // Navigation property per OrderDetail
    public DbSet<OrderDetail> OrderDetails { get; set; } = null!;
}