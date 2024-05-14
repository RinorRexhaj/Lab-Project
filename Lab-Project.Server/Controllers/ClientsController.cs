using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab_Project.Server.Data;
using Lab_Project.Server.Models;

namespace Lab_Project.Server.Controllers;

[Route("/[controller]")]
[ApiController]
public class ClientController : ControllerBase
{
    private readonly DataContext _context;

    public ClientController(DataContext context)
    {
        _context = context;
    }

    // GET: api/Client
    [HttpGet]
    public async Task<ActionResult<List<Client>>> GetClients()
    {
        var clients = await _context.Clients.ToListAsync();
        return Ok(clients);
    }

    // GET: api/Client/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Client>> GetClient(int id)
    {
        var client = await _context.Clients.FindAsync(id);
        if (client is null)
            return BadRequest("client not found.");

        return Ok(client);
    }

    // POST: api/Client
    [HttpPost]
    public async Task<ActionResult<List<Client>>> AddClient(Client client)
    {
        _context.Clients.Add(client);
        await _context.SaveChangesAsync();

        return Ok(await _context.Clients.ToListAsync());
    }

    // PUT: api/Client/5
    [HttpPut("{id}")]
    public async Task<ActionResult<List<Client>>> UpdateClient(Client client)
    {
        var dbClient = await _context.Client.FindAsync(client.Id);
        if (dbClient is null)
            return BadRequest("client not found");

        dbClient.Name = client.Name;
        dbClient.FirstName = client.FirstName;
        dbClient.LastName = client.LastName;
        dbClient.UserName = client.UserName;
        dbClient.Pasword = client.Pasword;
        dbClient.Address = client.Address;

        await _context.SaveChangeAsync();

        return Ok(await _context.ToListAsync());
    }

    // DELETE: api/Client/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<List<Client>>> DeleteClient(int id)
    {
        var client = await _context.Clients.FindAsync(id);
        if (Client == null)
        {
            return NotFound("client not found");
        }

        _context.Clients.Remove(client);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private bool ClientExists(int id)
    {
        return _context.Clients.Any(e => e.Id == id);
    }
}