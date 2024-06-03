//using Lab_Project.Server.Services.Token;
//using Microsoft.AspNetCore.Authorization;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using NuGet.Packaging;
//using Lab_Project.Server.Models;

//namespace Lab_Project.Server.Controllers;

//[Route("[controller]")]
//[ApiController]
//public class SessionsController : ControllerBase
//{
//    public class Session
//    {
//        public int Id { get; set; }
//        public RefreshToken RefreshToken { get; set; } = null!;
//    }

//    public static List<Session> Sessions = [];
//    public static int views = 0;
//    private readonly ITokenService tokenService;

//    public SessionsController(ITokenService tokenService)
//    {
//        this.tokenService = tokenService;
//    }

//    [HttpGet, Authorize(Policy = "Admin")]
//    public ActionResult GetSessions()
//    {
//        return Ok(Sessions);
//    }

//    [HttpGet("views"), Authorize(Policy = "Admin")]
//    public ActionResult GetViews()
//    {
//        return Ok(views);
//    }

//    [HttpGet("{sessionId:int}")]
//    public ActionResult GetSession(int sessionId, string refresh)
//    {
//        var session = Sessions.FirstOrDefault(s => s.Id == sessionId && s.RefreshToken.Token.ToString() == refresh);
//        if (sessionId <= 0 || session == null)
//        {
//            return BadRequest("Session Not Found");
//        }
//        else
//        {
//            return Ok(session);
//        }
//    }

//    public static Session FindSession(int sessionId, string refresh)
//    {
//        var session = Sessions.FirstOrDefault(s => s.Id == sessionId && s.RefreshToken.Token.ToString() == refresh);
//        return session;
//    }

//    public static Session FindSession(int sessionId)
//    {
//        var session = Sessions.FirstOrDefault(s => s.Id == sessionId);
//        return session;
//    }

//    [HttpPost]
//    public ActionResult CreateSession(Client client)
//    {
//        var session = Sessions.FirstOrDefault(s => s.Id == client.Id);
//        if (client.Id <= 0)
//        {
//            return BadRequest("Invalid Id");
//        }
//        else if (session != null)
//        {
//            return BadRequest("Session exists");
//        }
//        else
//        {
//            Sessions.Add(new Session
//            {
//                Id = client.Id,
//                RefreshToken = tokenService.CreateRefreshToken(client)
//            });
//            return Ok(Sessions);
//        }
//    }
//}
