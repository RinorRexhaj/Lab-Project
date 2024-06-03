using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Lab_Project.Server.Data;
using Lab_Project.Server.Models;

namespace Lab_Project.Server.Controllers;

[Route("/[controller]")]
[ApiController]
public class RolesController : Controller
{
    private readonly DataContext _context;

    public RolesController(DataContext context)
    {
        this._context = context;
    }

    // GET: api/Client
    [HttpGet]
    public async Task<ActionResult<Role>> GetRoles()
    {

        var roles = await _context.Roles.ToListAsync();
        //Console.WriteLine(clients);
        return Ok(roles);
    }

    [HttpPost]
    public async Task<ActionResult<Role>> PostRole(Role role)
    {
        await _context.Roles.AddAsync(role);
        await _context.SaveChangesAsync();
        return Ok(role);
    }
}