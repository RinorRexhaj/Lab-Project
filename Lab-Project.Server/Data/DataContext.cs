using Lab_Project.Server.Models;
using Microsoft.EntityFrameworkCore;
namespace Lab_Project.Server.Data;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {

    }
    public DbSet<Product> Products { get; set; } = null!;
    public DbSet<Client> Clients { get; set; } = null!;
    public DbSet<Order> Orders { get; set; } = null!;
    public DbSet<OrderDetail> OrderDetails { get; set; } = null!;
    public DbSet<Car> Cars { get; set; } = null!;
    public DbSet<Rent> Rents { get; set; } = null!;
    public DbSet<Category> Categories { get; set; }
    public DbSet<RefreshToken> RefreshTokens { get; set; }
    public DbSet<Message> Messages { get; set; }
    public DbSet<Model> Models {  get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<Notification> Notifications { get; set; }
    public DbSet<NotificationAdmins> NotificationAdmins { get; set; } = null!;
}
