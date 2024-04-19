using Microsoft.AspNetCore.Mvc;
using Lab_Project.Server.Data;
using Microsoft.EntityFrameworkCore;
using Lab_Project.Server.Models;
using Lab_Project.Server.FileUpload;

namespace Lab_Project.Server.Controllers;

[Route("/[controller]")]
[ApiController]
public class ProductsController : Controller
{
    private readonly IFileUploadService uploadService;
    private readonly DataContext context;

    public ProductsController(DataContext context, IFileUploadService uploadService)
    {
        this.context = context;
        this.uploadService = uploadService;
    }

    [HttpGet]
    public async Task<ActionResult<Product>> GetAllProducts()
    {
        IEnumerable<Product> products = await context.Products.ToArrayAsync();
        return Ok(products);
    }

    // GET: Products
    [HttpGet("offset/{offset:int}")]
    public async Task<ActionResult<Product>> GetProducts(int offset)
    {
        IEnumerable<Product> products = await context.Products.Skip(offset).Take(50).ToArrayAsync();
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
    public async Task<ActionResult<Product>> PostProduct(Product product)
    {

        if (product.Id <= 0 || product.Name == null || product.Name.Length <= 0 || product.Category == null || product.Category.Length <= 0 || product.Price < 0)
        {
            return BadRequest("Wrong Parameters");
        }
        else
        {
            await context.Products.AddAsync(product);
            await context.SaveChangesAsync();
            return Ok(product);
        }
    }

    //POST: Image for Product
    [HttpPost("image/{id:int}")]
    public async Task<ActionResult<IFormFile>> PostProductImage(int id, IFormFile image)
    {
        if(image == null || image.Length <= 0 || image.Length > 5120000) { return BadRequest("Wrong Parameters"); }
        else
        {
            return Ok(await uploadService.UploadFile(image, "products", id));
        }
    }

    //UPDATE: Product
    [HttpPatch]
    public async Task<ActionResult<Product>> UpdateProduct(Product product)
    {
        if (product.Id <= 0 || product.Name == null || product.Name.Length <= 0 || product.Category == null || product.Category.Length <= 0 || product.Price < 0)
        {
            return BadRequest("Wrong Parameters");
        }
        else if (ProductExists(product.Id)) { 
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
