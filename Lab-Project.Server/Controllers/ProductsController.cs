using Microsoft.AspNetCore.Mvc;
using Lab_Project.Server.Data;
using Microsoft.EntityFrameworkCore;
using Lab_Project.Server.Models;
using Lab_Project.Server.FileUpload;

namespace Lab_Project.Server.Controllers;

[Route("/[controller]")]
[ApiController]
public class ProductController : Controller
{
    private readonly IFileUploadService uploadService;
    private readonly DataContext context;

    public ProductController(DataContext context, IFileUploadService uploadService)
    {
        this.context = context;
        this.uploadService = uploadService;
    }

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
        if (id <= 0)
        {
            return BadRequest("Wrong Parameters");
        }
        else if (ProductExists(id))
        {
            ActionResult<Product> product = await context.Products.FindAsync(id);
            return Ok(product.Value);
        }
        else
        {
            return NotFound("Product doesn't exist");
        }
    }

    //GET: Image For Product
    [HttpGet("image/{id:int}")]
    public async Task<ActionResult> GetProductImage(int id)
    {
        if (id <= 0)
        {
            return BadRequest("Wrong Parameters");
        }
        else if (!ProductExists(id))
        {
            return NotFound("Product doesn't exist");
        }
        return PhysicalFile("C:\\Users\\PC\\Desktop\\Detyra\\Lab1\\Lab-Project\\Lab-Project.Server\\uploads\\products\\" + id + ".png", "image/png");
    }

    //POST: Product
    [HttpPost]
    public async Task<ActionResult<Product>> PostProduct(int id, string name, string category, decimal price, IFormFile image)
    {
        Product product = new()
        {
            Id = id,
            Name = name,
            Category = category,
            Price = price,
        };
        if (id <= 0 || name == null || name.Length <= 0 || category == null || category.Length <= 0 || price < 0 || image == null || image.Length <= 0 || image.Length > 5120000)
        {
            return BadRequest("Wrong Parameters");
        }
        else
        {
            await context.Products.AddAsync(product);
            await context.SaveChangesAsync();
            await uploadService.UploadFile(image, "products", id);
            return Ok(product);
        }
    }

    //UPDATE: Product
    [HttpPatch("{id:int}")]
    public async Task<ActionResult<Product>> UpdateProduct(int id, string name, string category, decimal price, IFormFile image)
    {
        if (id <= 0 || name == null || name.Length <= 0 || category == null || category.Length <= 0 || price < 0 || image == null || image.Length <= 0 || image.Length > 5120000)
        {
            return BadRequest("Wrong Parameters");
        }
        else if (ProductExists(id))
        {
            Product product = await context.Products.FindAsync(id);
            if (product != null)
            {
                product.Name = name;
                product.Category = category;
                product.Price = price;
                context.Products.Update(product);
                await uploadService.UploadFile(image, "products", id);
                await context.SaveChangesAsync(true);
            }
            return Ok(product);
        }
        else
        {
            return NotFound("Product doesn't exist");
        }
    }

    //DELETE: Product
    [HttpDelete("{id:int}")]
    public async Task<ActionResult<Product>> DeleteProduct(int id)
    {
        if (id <= 0)
        {
            return BadRequest("Wrong Parameters");
        }
        else if (ProductExists(id))
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
            return NotFound("Product doesn't exist");
        }
    }

    private bool ProductExists(int id)
    {
        return context.Products.Any(e => e.Id == id);
    }
}
