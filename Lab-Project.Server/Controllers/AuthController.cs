using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab_Project.Server.Data;
using Lab_Project.Server.Models;
using Lab_Project.Server.Services.Token;
using Microsoft.AspNetCore.Authorization;
using static Lab_Project.Server.Services.Token.TokenService;
using static Lab_Project.Server.Controllers.SessionsController;

namespace Lab_Project.Server.Controllers;

[Route("[controller]")]
[ApiController]
public class AuthController : ControllerBase
{
    private readonly DataContext context;
    private readonly ITokenService tokenService;

    public AuthController(DataContext context, ITokenService tokenService)
    {
        this.context = context;
        this.tokenService = tokenService;
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
        var clientAccount = await context.Clients.FirstOrDefaultAsync(c => c.Email == client.Email);
        string token = tokenService.CreateToken(clientAccount);
        RefreshToken refresh = tokenService.CreateRefreshToken(clientAccount);
        await context.RefreshTokens.AddAsync(refresh);
        await context.SaveChangesAsync();
        SessionsController.Sessions.Add(new SessionsController.Session { Id = client.Id, RefreshToken = refresh });
        SessionsController.views++;
        return Ok(new { client.Id, client.FullName, client?.Email, client.Role, token, refreshToken = refresh.Token.ToString() });
    }

    //Client Login Class
    public class ClientDTO
    {
        public required string Email { get; set; } = null!;
        public required string Password { get; set; } = null!;
    }
    [HttpPost("login")]
    public async Task<ActionResult> LoginClient(ClientDTO client)
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
                    string token = tokenService.CreateToken(clientAccount);
                    RefreshToken? refresh = await context.RefreshTokens.FirstOrDefaultAsync(r => r.ClientId == clientAccount.Id);
                    if (refresh == null)
                    {
                        refresh = tokenService.CreateRefreshToken(clientAccount);
                        await context.RefreshTokens.AddAsync(refresh);
                    }
                    else if (!ValidToken(refresh.Expires))
                    {
                        var newRefresh = tokenService.CreateRefreshToken(clientAccount);
                        refresh.Token = newRefresh.Token;
                        refresh.Expires = newRefresh.Expires;
                        //context.RefreshTokens.Update(refresh);
                    }
                    await context.SaveChangesAsync();
                    SessionsController.Sessions.Add(new SessionsController.Session { Id = clientAccount.Id, RefreshToken = refresh });
                    SessionsController.views++;
                    return Ok(new { clientAccount.Id, clientAccount.FullName, clientAccount.Email, clientAccount.Role, token, refreshToken = refresh.Token.ToString() });
                }
                else return BadRequest("Wrong Password");
            }
            else return NotFound("Account doesn't exist");
        }
    }

    //Log Out
    [HttpDelete("logout/{id:int}"), Authorize(Policy = "User")]
    public async Task<ActionResult> LogOutClient(int id)
    {
        string token = HttpContext.Request.Headers.Authorization[0][7..];
        int tokenId = tokenService.DecodeTokenId(token);
        if (tokenId != id || tokenId <= 0) return BadRequest("Token Invalid");
        Session session = SessionsController.FindSession(id);
        SessionsController.Sessions.Remove(session);
        return Ok("Log Out Successful");
    }

    //Refresh Token
    [HttpGet("refresh/{refresh}")]
    public async Task<ActionResult> RefreshTokens(string refresh)
    {
        RefreshToken? refreshToken = await context.RefreshTokens.FirstOrDefaultAsync(r => r.Token.ToString() == refresh);
        if (refreshToken == null) return BadRequest("Invalid Refresh");
        Client? client = await context.Clients.FirstOrDefaultAsync(c => c.Id == refreshToken.ClientId);
        if (client == null) return BadRequest("Invalid Client");
        if (!ValidToken(refreshToken.Expires))
        {
            //return Ok("Invalid Token");
            var newRefresh = tokenService.CreateRefreshToken(client);
            refreshToken.Token = newRefresh.Token;
            refreshToken.Expires = newRefresh.Expires;
        }
        await context.SaveChangesAsync();
        string newToken = tokenService.CreateToken(client);
        Session session = SessionsController.FindSession(client.Id, refresh);
        if (session != null) Sessions.Remove(session);
        Sessions.Add(new Session { Id = client.Id, RefreshToken = refreshToken });
        return Ok(new { refresh = refreshToken.Token, newToken, client.Id, client.FullName, client.Email, client.Role });
        //return Ok(refresh);
    }

    private bool ClientExists(string email)
    {
        return context.Clients.Any(e => e.Email == email);
    }
}
