using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_Project.Server.Models;

public class Rent
{
    [Key]
    [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
    public int RentalID { get; set; }
    public DateTime StartDate { get; set; }
    public int Days { get; set; }

    [ForeignKey("Car")]
    public int CarID { get; set; }

    [ForeignKey("Client")]
    public int ClientID { get; set; }
    public Car Car { get; set; }
    public Client Client { get; set; }
}