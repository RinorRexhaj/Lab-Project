﻿using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab_Project.Server.Data;
using Lab_Project.Server.Models;
using Lab_Project.Server.Services.Token;
using Microsoft.AspNetCore.Authorization;
using Lab_Project.Server.Hubs;
using Lab_Project.Server.Services.FileUpload;
using Lab_Project.Server.DTOs;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace Lab_Project.Server.Controllers;

[Route("[controller]")]
[ApiController]
public class ClientsController : ControllerBase
{
    private readonly DataContext context;
    private readonly ITokenService tokenService;
    private readonly IFileUploadService uploadService;

    public ClientsController(DataContext context, ITokenService tokenService, IFileUploadService uploadService)
    {
        this.context = context;
        this.tokenService = tokenService;
        this.uploadService = uploadService;
    }

    // GET: api/Client
    [HttpGet, Authorize(Policy = "User")]
    public async Task<ActionResult<List<Client>>> GetClients()
    {
        var clients = await context.Clients.ToListAsync();
        return Ok(clients);
    }

    [HttpGet("active"), Authorize(Policy = "Admin")]
    public ActionResult GetActiveClients() { 
        return Ok(Connections.Users.Count);
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

    [HttpGet("image/{id:int}")]
    public ActionResult GetClientImage(int id)
    {
        string path = "C:\\Users\\PC\\Desktop\\Detyra\\Lab1\\Lab-Project\\Lab-Project.Server\\uploads\\clients\\" + id + ".png";
        if (id <= 0)
            return BadRequest("Wrong Parameters");
        else if (!ClientExists(id))
            return NotFound("Client doesn't exist");
        if(!System.IO.File.Exists(path)) return NotFound("Client doesn't have a profile");
        var image = PhysicalFile(path, "image/png");
        return image;
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

    [HttpPost]
    public async Task<ActionResult<List<Client>>> AddClient(Client client)
    {
        await context.Clients.AddAsync(client);
        await context.SaveChangesAsync();

        return Ok(await context.Clients.ToListAsync());
    }

    //POST: Image for Product
    [HttpPost("image/{id}"), Authorize(Policy = "User")]
    public async Task<ActionResult<IFormFile>> PostClientImage(int id, IFormFile image)
    {
        string token = HttpContext.Request.Headers.Authorization[0][7..];
        int userId = tokenService.DecodeTokenId(token);
        if (userId != id) return Unauthorized("Unauthorized");
        if (image == null || image.Length <= 0 || image.Length > 5120000) return BadRequest("Wrong Parameters");
        return Ok(await uploadService.UploadFile(image, "clients", id));
    }

    [HttpDelete("image/{id}"), Authorize(Policy = "User")]
    public async Task<ActionResult<IFormFile>> DeleteClientImage(int id)
    {
        string token = HttpContext.Request.Headers.Authorization[0][7..];
        int userId = tokenService.DecodeTokenId(token);
        if (userId != id) return Unauthorized("Unauthorized");
        uploadService.DeleteFile("clients", id);
        return Ok(id);
    }

    [HttpPatch]
    public async Task<ActionResult<Client>> UpdateClient([FromBody]ClientChangeDTO client)
    {
        var dbClient = context.Clients.FirstOrDefault(c => c.Id == client.Id);
        if (dbClient is null)
            return BadRequest("client not found");

        dbClient.FullName = client.FullName;
        dbClient.Address = client.Address;
        dbClient.Phone = client.Phone;
        dbClient.Role = client.Role;

        context.SaveChanges();

        return Ok(dbClient);
    }

    // DELETE: api/Client/5
    [HttpDelete("{id}")]
    public async Task<ActionResult<List<Client>>> DeleteClient(int id)
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