using Microsoft.AspNetCore.Mvc;
using Lab_Project.Server.Data;
using Microsoft.EntityFrameworkCore;
using Lab_Project.Server.Models;

namespace Lab_Project.Server.Controllers;

[Route("/[controller]")]
[ApiController]
public class ProductController(DataContext context) : Controller
{
    // GET: Products
    [HttpGet]
    public async Task<ActionResult<Product>> GetProducts()
    {
        IEnumerable<Product> products = await context.Products.ToArrayAsync();
        return Ok(products);
    }

    //GET: Product By ID
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        if (ProductExists(id))
        {
            ActionResult<Product> product = await context.Products.FindAsync(id);
            return Ok(product.Value);
        }
        else
        {
            return BadRequest("Product doesn't exist");
        }
    }

    //POST: Product
    [HttpPost]
    public async Task<ActionResult<Product>> PostProduct(string name, string category, decimal price)
    {
        Product product = new Product
        {
            Name = name,
            Category = category,
            Price = price
        };
        if (ProductExists(product.Id))
        {
            return BadRequest("Product exists");
        }
        else
        {
            await context.Products.AddAsync(product);
            await context.SaveChangesAsync();
            return Ok(product);
        }
    }

    //UPDATE: Product
    [HttpPatch("{id:int}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, string name, string category, decimal price)
    {
        if (ProductExists(id))
        {
            Product product = await context.Products.FindAsync(id);
            if (product != null)
            {
                product.Name = name;
                product.Category = category;
                product.Price = price;
                context.Products.Update(product);
                await context.SaveChangesAsync(true);
            }
            return Ok(product);
        }
        else
        {
            return BadRequest("Product doesn't exist");
        }
    }

    //DELETE: Product
    [HttpDelete("{id}")]
    public async Task<ActionResult<Product>> DeleteProduct(int id)
    {
        if (ProductExists(id))
        {
            Product product = await context.Products.FindAsync(id);
            if (product != null)
            {
                context.Products.Remove(product);
                await context.SaveChangesAsync();
                return Ok("Deleted " + id);
            }
            else return BadRequest("Product is null");
        }
        else
        {
            return BadRequest("Product doesn't exist");
        }
    }

    private bool ProductExists(int id)
    {
        return context.Products.Any(e => e.Id == id);
    }
}
