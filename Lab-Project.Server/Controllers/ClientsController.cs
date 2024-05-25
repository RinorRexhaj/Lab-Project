using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab_Project.Server.Data;
using Lab_Project.Server.Models;
using Lab_Project.Server.Services.Token;
using Microsoft.AspNetCore.Authorization;

namespace Lab_Project.Server.Controllers;

[Route("/[controller]")]
[ApiController]
public class ClientsController : ControllerBase
{
    private readonly DataContext context;
    private readonly ITokenService tokenService;

    public ClientsController(DataContext context, ITokenService tokenService)
    {
        this.context = context;
        this.tokenService = tokenService;
    }

    // GET: api/Client
    [HttpGet, Authorize(Policy = "Admin")]
    public async Task<ActionResult<List<Client>>> GetClients()
    {
        string role = tokenService.DecodeTokenRole(HttpContext.Request.Headers.Authorization[0][7..]);
        if (role == null || role.Length <= 0 || role != "Admin") return Unauthorized("Unauthorized");
        var clients = await context.Clients.ToListAsync();
        return Ok(clients);
    }

    // GET: api/Client/5
    [HttpGet("{id}"), Authorize(Policy = "User")]
    public async Task<ActionResult<Client>> GetClient(int id)
    {
        string token = HttpContext.Request.Headers.Authorization[0][7..];
        int tokenId = tokenService.DecodeTokenId(token);
        string tokenRole = tokenService.DecodeTokenRole(token);
        var client = await context.Clients.FirstOrDefaultAsync(c => c.Id == id);
        if (tokenId <= 0)
            return Unauthorized("Unauthorized");
        else if (client == null && tokenRole == "Admin")
        {
            return NotFound("Client not found");
        }
        else if (tokenId != id && tokenRole != "Admin")
        {
            return StatusCode(403, "Forbidden");
        }
        return Ok(new { client?.Id, client?.FullName, client?.Email, client?.Role });
    }

    [HttpGet("count"), Authorize(Policy = "Admin")]
    public ActionResult GetClientCount()
    {
        return Ok(context.Clients.Count());
    }

    [HttpGet("top"), Authorize(Policy = "User")]
    public async Task<ActionResult<Client>> GetTopClients()
    {
        IEnumerable<Client> clients = await context.Clients.OrderBy(p => p.Id).Take(3).ToArrayAsync();
        return Ok(clients);
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

    private bool ClientExists(string email, string password)
    {
        return context.Clients.Any(c => c.Email == email && c.Password == password);
    }
}