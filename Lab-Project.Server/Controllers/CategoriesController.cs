using Lab_Project.Server.Data;
using Lab_Project.Server.Models;
using Lab_Project.Server.Services.FileUpload;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab_Project.Server.Controllers;

[Route("/[controller]")]
[ApiController]
public class CategoriesController : ControllerBase
{
    private readonly DataContext context;

    public CategoriesController(DataContext context)
    {
        this.context = context;
    }

    [HttpGet, Authorize(Policy = "User")]
    public async Task<ActionResult<Category>> GetCategories()
    {
        IEnumerable<Category> categories = await context.Categories.ToArrayAsync();
        return Ok(categories);
    }

    [HttpDelete("{name}")]
    public async Task<ActionResult<Category>> DeleteCategory(string name)
    {
        Category category = await context.Categories.FirstOrDefaultAsync(c => c.CategoryName == name);
        if (category == null)
        {
            return BadRequest("Category doesn't exist");
        }
        context.Categories.Remove(category);
        await context.SaveChangesAsync();
        return Ok(category);
    }
}
