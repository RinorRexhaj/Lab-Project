using Lab_Project.Server.Data;
using Lab_Project.Server.Models;
using Lab_Project.Server.DTOs;
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

    [HttpPost, Authorize(Policy = "Admin")]
    public async Task<ActionResult<Category>> PostCategory(Category category)
    {
        if (category == null || category.CategoryName == null || category.CategoryName.Length <= 0) return BadRequest("Invalid parameters");
        if (CategoryExists(category.CategoryName)) return BadRequest("Category exists");
        await context.Categories.AddAsync(category);
        await context.SaveChangesAsync();
        return Ok(category);
    }

    [HttpPatch, Authorize(Policy = "Admin")]
    public async Task<ActionResult<Category>> UpdateCategory(UpdateCategoryDTO category)
    {
        if (category.OldCategory == null || category.NewCategory == null || category.OldCategory.Length <= 0) return BadRequest("Invalid parameters");
        if (!CategoryExists(category.OldCategory)) return BadRequest("Category doesn't exist");
        Category cat = new()
        {
            CategoryName = category.NewCategory
        };
        await context.Categories.AddAsync(cat);
        var oldProducts = context.Products.Where(p => p.CategoryName == category.OldCategory);
        foreach (var prd in oldProducts)
        {
            prd.CategoryName = category.NewCategory;   
        }
        await context.SaveChangesAsync();
        var c = context.Categories.FirstOrDefault(c => c.CategoryName == category.OldCategory);
        context.Categories.Remove(c);
        await context.SaveChangesAsync();
        return Ok(c);
    }

    [HttpDelete("{name}"), Authorize(Policy = "Admin")]
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

    private bool CategoryExists(string name)
    {
        return context.Categories.Any(c => c.CategoryName == name);
    }
}
