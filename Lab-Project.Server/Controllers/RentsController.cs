using Lab_Project.Server.Data;
using Lab_Project.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab_Project.Server.Controllers;

[Route("[controller]")]
[ApiController]
public class RentsController : ControllerBase
{
    private readonly DataContext context;
    public RentsController(DataContext context)
    {
        this.context = context;
    }
    [HttpGet]
    public async Task<ActionResult<Rent>> GetRents()
    {
        var rents = await context.Rents.ToArrayAsync();
        return Ok(rents);

    }
    [HttpPost]
    public async Task<ActionResult<Rent>> PostRent(Rent rent)
    {
        if(rent == null) {
            return BadRequest("wrong parameters");       
        }
        var postRent = await context.Rents.AddAsync(rent);
        await context.SaveChangesAsync();
        return Ok(postRent);
    }

    private bool rentExists(int id)
    {
        return context.Rents.Any(r => r.RentalID==id);
        
    }
}
