//using Lab_Project.Server.Data;
//using Lab_Project.Server.Models;
//using Microsoft.AspNetCore.Http;
//using Microsoft.AspNetCore.Mvc;
//using Microsoft.EntityFrameworkCore;

//namespace Lab_Project.Server.Controllers;

//[Route("[controller]")]
//[ApiController]
//public class RefreshController : ControllerBase
//{
//    private readonly DataContext context;
//    public RefreshController(DataContext context)
//    {
//        this.context = context;
//    }

//    [HttpGet("tokens")]
//    public async Task<ActionResult<RefreshToken>> GetRefreshTokens()
//    {
//        var refreshTokens = await context.RefreshTokens.ToArrayAsync();
//        return Ok(refreshTokens);
//    }
//}
