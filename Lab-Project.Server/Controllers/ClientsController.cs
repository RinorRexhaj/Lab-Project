using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab_Project.Server.Data;
using Lab_Project.Server.Models;
using Microsoft.VisualStudio.Web.CodeGenerators.Mvc.Templates.BlazorIdentity.Pages.Manage;
using System.Security.Claims;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.Authorization;

namespace Lab_Project.Server.Controllers;

[Route("/[controller]")]
[ApiController]
public class ClientsController : ControllerBase
{
    private readonly DataContext context;
    private readonly IConfiguration configuration;

    public ClientsController(DataContext context, IConfiguration configuration)
    {
        this.context = context;
        this.configuration = configuration;
    }

    // GET: api/Client
    [HttpGet]
    public async Task<ActionResult<List<Client>>> GetClients()
    {
        var clients = await context.Clients.ToListAsync();
        return Ok(clients);
    }

    // GET: api/Client/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Client>> GetClient(int id)
    {
        var client = await context.Clients.FindAsync(id);
        if (client is null)
            return BadRequest("client not found.");

        return Ok(client);
    }

    // POST: api/Client
    [HttpPost("register")]
    public async Task<ActionResult<Client>> PostClient(Client client)
    {
        if (client.FullName == null || client.FullName.Length == 0 || client.Email == null || client.Email.Length == 0 || client.Password == null || client.Password.Length < 8)
        {
            return BadRequest("Wrong Parameters");
        }
        else if (ClientExists(client.Email))
        {
            return BadRequest("Client Exists");
        }
        if (client.Role == null || client.Role.Length == 0) client.Role = "User";
        await context.Clients.AddAsync(client);
        await context.SaveChangesAsync();
        return Ok(client);
    }

    //Client Login Class
    public class ClientDTO
    {
        public required string Email { get; set; } = null!;
        public required string Password { get; set; } = null!;
    }
    [HttpPost("login")]
    public ActionResult LoginClient(ClientDTO client)
    {
        if (client.Email == null || client.Email.Length == 0 || client.Password == null || client.Password.Length < 8)
        {
            return BadRequest("Wrong Parameters");
        }
        else
        {
            var clientAccount = context.Clients.FirstOrDefault(c => c.Email == client.Email);
            if (clientAccount != null && clientAccount.Email == client.Email)
            {
                if (clientAccount.Password == client.Password)
                {
                    string token = CreateToken(clientAccount);
                    return Ok(token);
                }
                else return BadRequest("Wrong Password");
            }
            else return NotFound("Account doesn't exist");
        }
    }

    //Create JWT
    private string CreateToken(Client client)
    {
        List<Claim> claims =
        [
            new(ClaimTypes.Name, client.FullName),
            new(ClaimTypes.Email, client.Email),
            new(ClaimTypes.Role, client.Role),
        ];

        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                configuration.GetSection("JWT:Token").Value!));
        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
        var token = new JwtSecurityToken(configuration["JWT:ValidIssuer"],
                                configuration["JWT:ValidAudience"],
                               claims: claims,
                               expires: DateTime.UtcNow.AddMinutes(30),
                               signingCredentials: cred
);
        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        return jwt;
    }

    //PUT: api/
    [HttpPut]
    public async Task<ActionResult<Client>> UpdateClient(Client client)
    {
        var dbClient = await context.Clients.FindAsync(client.Id);
        if (dbClient is null)
            return BadRequest("client not found");

        dbClient.FullName = client.FullName;
        dbClient.Email = client.Email;
        dbClient.Password = client.Password;

        await context.SaveChangesAsync();

        return Ok(await context.Clients.ToListAsync());
    }

    // DELETE: api/Client/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<Client>> DeleteClient(int id)
    {
        var client = await context.Clients.FindAsync(id);
        if (client == null)
        {
            return NotFound("client not found");
        }

        context.Clients.Remove(client);
        await context.SaveChangesAsync();

        return NoContent();
    }

    private bool ClientExists(int id)
    {
        return context.Clients.Any(e => e.Id == id);
    }

    private bool ClientExists(string email)
    {
        return context.Clients.Any(e => e.Email == email);
    }

    private bool ClientExists(string email, string password)
    {
        return context.Clients.Any(c => c.Email == email && c.Password == password);
    }
}