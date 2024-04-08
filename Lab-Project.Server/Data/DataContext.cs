using Lab_Project.Server.Models;
using Microsoft.EntityFrameworkCore;
namespace Lab_Project.Server.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {

    }
    public DbSet<Product> Products { get; set; } = null!;
}
