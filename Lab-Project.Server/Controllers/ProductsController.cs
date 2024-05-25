using Microsoft.AspNetCore.Mvc;
using Lab_Project.Server.Data;
using Microsoft.EntityFrameworkCore;
using Lab_Project.Server.Models;
using Microsoft.AspNetCore.Authorization;
using System.Reflection;
using Lab_Project.Server.Services.FileUpload;
using Lab_Project.Server.Services.Token;

namespace Lab_Project.Server.Controllers;

[Route("/[controller]")]
[ApiController]
public class ProductsController : Controller
{
    private readonly IFileUploadService uploadService;
    private readonly ITokenService tokenService;
    private readonly DataContext context;

    public ProductsController(DataContext context, IFileUploadService uploadService, ITokenService tokenService)
    {
        this.context = context;
        this.uploadService = uploadService;
        this.tokenService = tokenService;
    }

    //GET: Products
    [HttpGet, Authorize(Policy = "User")]
    public async Task<ActionResult<Product>> GetProducts()
    {
        string token = HttpContext.Request.Headers.Authorization[0][7..];
        if (tokenService.DecodeTokenId(token) <= 0) return Unauthorized("Unauthorized");
        IEnumerable<Product> products = await context.Products.ToArrayAsync();
        return Ok(products);
    }

    [HttpGet("count"), Authorize(Policy = "Admin")]
    public ActionResult GetProductCount()
    {
        return Ok(context.Products.Count());
    }

    [HttpGet("top"), Authorize(Policy = "User")]
    public async Task<ActionResult<Product>> GetTopProducts()
    {
        IEnumerable<Product> products = await context.Products.OrderByDescending(p => p.Price).Take(3).ToArrayAsync();
        return Ok(products);
    }

    //GET: Product By ID
    [HttpGet("id/{id:int}")]
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
    public Task<ActionResult> GetProductImage(int id)
    {
        if (id <= 0)
        {
            return Task.FromResult<ActionResult>(BadRequest("Wrong Parameters"));
        }
        else if (!ProductExists(id))
        {
            return Task.FromResult<ActionResult>(NotFound("Product doesn't exist"));
        }
        return Task.FromResult<ActionResult>(PhysicalFile("C:\\Users\\PC\\Desktop\\Detyra\\Lab1\\Lab-Project\\Lab-Project.Server\\uploads\\products\\" + id + ".png", "image/png"));
    }

    //POST: Product
    [HttpPost]
    public async Task<ActionResult<Product>> PostProduct(Product product)
    {

        if (product.Id <= 0 || product.Name == null || product.Name.Length <= 0 || product.CategoryName == null || product.CategoryName.Length <= 0 || product.Price < 0)
        {
            return BadRequest("Wrong Parameters");
        }
        else if(ProductExists(product.Id))
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

    //POST: Image for Product
    [HttpPost("image/{id}")]
    public async Task<ActionResult<IFormFile>> PostProductImage(int id, IFormFile image)
    {
        if(image == null || image.Length <= 0 || image.Length > 5120000) { return BadRequest("Wrong Parameters"); }
        else
        {
            return Ok(await uploadService.UploadFile(image, "products", id));
        }
    }

    //UPDATE: Product
    [HttpPatch, Authorize(Policy = "Admin")]
    public async Task<ActionResult<Product>> UpdateProduct(Product product)
    {
        if (product.Id <= 0 || product.Name == null || product.Name.Length <= 0 || product.CategoryName == null || product.CategoryName.Length <= 0 || product.Price < 0)
        {
            return BadRequest("Wrong Parameters");
        }
        else if (ProductExists(product.Id))
        {
            context.Products.Update(product);
            await context.SaveChangesAsync(true);
            return Ok(product);
        }
        else
        {
            return NotFound("Product doesn't exist");
        }
    }

    //DELETE: Product
    [HttpDelete("{id:int}"), Authorize(Policy = "Admin")]
    public async Task<ActionResult<Product>> DeleteProduct(int id)
    {
        if (id <= 0)
        {
            return BadRequest("Wrong Parameters");
        }
        else if(!ProductExists(id))
        {
            return NotFound("Product doesn't exist");
        }
        else 
        {
            Product product = await context.Products.FindAsync(id);
            if (product == null)
            {
                return BadRequest("Product is null");
            }
            else
            {
                context.Products.Remove(product);
                await context.SaveChangesAsync();
                uploadService.DeleteFile("products", id);
                return Ok("Deleted " + id);
            }
        }
        
    }

    private bool ProductExists(int id)
    {
        return context.Products.Any(e => e.Id == id);
    }
}
