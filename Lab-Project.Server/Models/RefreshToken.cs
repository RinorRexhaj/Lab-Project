using Microsoft.EntityFrameworkCore;
using Mono.TextTemplating;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Lab_Project.Server.Models;

[PrimaryKey(nameof(ClientId))]
public class RefreshToken
{
    [ForeignKey(nameof(ClientId))]
    public int ClientId { get; set; }
    public Guid Token { get; set; }
    public DateTime Expires { get; set; }
    //public Client Client { get; set; } = null!;
}
