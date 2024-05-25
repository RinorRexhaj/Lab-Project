using Lab_Project.Server.Data;
using Lab_Project.Server.Models;
using Lab_Project.Server.Services.Token;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab_Project.Server.Controllers;

[Route("[controller]")]
[ApiController]
public class MessagesController : ControllerBase
{
    private readonly DataContext context;
    private readonly ITokenService tokenService;

    public MessagesController(DataContext context, ITokenService tokenService)
    {
        this.context = context;
        this.tokenService = tokenService;
    }

    [HttpGet, Authorize(Policy = "Admin")]
    public async Task<ActionResult<Message>> GetMessages()
    {
        IEnumerable<Message> messages = await context.Messages.ToArrayAsync();
        return Ok(messages);
    }

    [HttpGet("{id}"), Authorize(Policy = "User")]
    public async Task<ActionResult<Message>> GetUserMessages(int id)
    {
        if (id <= 0) return BadRequest("User doesn't exist.");
        string token = HttpContext.Request.Headers.Authorization[0][7..];
        int userId = tokenService.DecodeTokenId(token);
        if (id != userId) return Unauthorized("Unauthorized");
        var messages = await context.Messages.Where(m => m.SenderId == id || m.ReceiverId == id).ToArrayAsync();
        return Ok(messages);
    }

    [HttpGet("last"), Authorize(Policy = "User")]
    public async Task<ActionResult<Message>> GetLastMessage()
    {
        string token = HttpContext.Request.Headers.Authorization[0][7..];
        int userId = tokenService.DecodeTokenId(token);
        Message message = await context.Messages.OrderByDescending(m => m.Id).FirstAsync();
        if (message.SenderId != userId && message.ReceiverId != userId) return Unauthorized("Unauthorized");
        return Ok(message);
    }

    class ClientMessage
    {
        public int Id {get; set;}
        public string FullName { get; set; }
        public Message MaxMessage { get; set; }
    }

    [HttpGet("users/{id}"), Authorize(Policy = "User")]
    public async Task<ActionResult> GetUsersMessaged(int id)
    {
        if (id <= 0) return BadRequest("User doesn't exist.");
        string token = HttpContext.Request.Headers.Authorization[0][7..];
        int userId = tokenService.DecodeTokenId(token);
        if (id != userId) return Unauthorized("Unauthorized");
        var messagesSent = await context.Messages.Where(m => m.SenderId == id).Select(m => m.ReceiverId).ToArrayAsync();
        var clientsSent = await context.Clients.Where(c => messagesSent.Contains(c.Id)).Select(c => new { c.Id, c.FullName, MaxMessage = 0}).ToArrayAsync();
        var messagesReceived = await context.Messages.Where(m => m.ReceiverId == id).Select(m => m.SenderId).ToArrayAsync();
        var clientsReceived = await context.Clients.Where(c => messagesReceived.Contains(c.Id)).Select(c => new { c.Id, c.FullName, MaxMessage = 0}).ToArrayAsync();
        var clientsOld = clientsSent.Union(clientsReceived);
        var clientsNew = new ClientMessage[clientsOld.Count()];
        for(int i = 0; i < clientsOld.Count(); i++)
        {
            var client = clientsOld.ElementAt(i);
            var maxId = context.Messages.Where(m => (m.SenderId == client.Id && m.ReceiverId == id) || (m.SenderId == id && m.ReceiverId == client.Id)).Max(x => x.Id);
            var maxMessage = await context.Messages.FirstAsync(m => m.Id == maxId);
            clientsNew[i] = new ClientMessage{ Id = client.Id, FullName = client.FullName, MaxMessage = maxMessage };
        }
        var clients = clientsNew.OrderByDescending(c => c.MaxMessage.Id);
        return Ok(clients);

    }

    [HttpPost, Authorize(Policy = "User")]
    public async Task<ActionResult<Message>> PostMessage(Message message)
    {
        if (message == null || message.SenderId < 100 || message.ReceiverId < 100 || message.MessageText == null || message.MessageText.Length <= 0) return BadRequest("Invalid Message");
        await context.Messages.AddAsync(message);
        await context.SaveChangesAsync();
        return Ok(message);
    }

    [HttpPatch, Authorize(Policy = "User")]
    public async Task<ActionResult<Message>> UpdateMessage(Message message)
    {
        string token = HttpContext.Request.Headers.Authorization[0][7..];
        int userId = tokenService.DecodeTokenId(token);
        if (message == null || message.SenderId < 100 || message.ReceiverId < 100 || message.MessageText == null || message.MessageText.Length <= 0) return BadRequest("Invalid Message");
        else if (!MessageExists(message.Id)) return BadRequest("Message doesn't exist");
        else if (message.SenderId != userId) return Unauthorized("Unauthorized");
        context.Messages.Update(message);
        await context.SaveChangesAsync();
        return Ok(message);
    }

    [HttpDelete("{id}"), Authorize(Policy = "User")]
    public async Task<ActionResult<Message>> DeleteMessage(int id)
    {
        if (id <= 0) return BadRequest("Invalid Message");
        string token = HttpContext.Request.Headers.Authorization[0][7..];
        int userId = tokenService.DecodeTokenId(token);
        var message = await context.Messages.FindAsync(id);
        if (message.SenderId != userId) return Unauthorized("Unauthorized");
        context.Messages.Remove(message);
        await context.SaveChangesAsync();
        return Ok(message);
    }

    private bool MessageExists(int id)
    {
        return context.Messages.Any(message => message.Id == id);
    }
}
