﻿using Microsoft.AspNetCore.Mvc;
using Lab_Project.Server.Data;
using Microsoft.EntityFrameworkCore;
using Lab_Project.Server.Models;
using Microsoft.AspNetCore.Authorization;
using System.Reflection;
using Lab_Project.Server.Services.FileUpload;
using Lab_Project.Server.Services.Token;
using Lab_Project.Server.DTOs;

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
    
    [HttpGet("top-amount"), Authorize(Policy = "User")]
    public async Task<ActionResult<Product>> GetTopAmountProducts()
    {
        var productsDb = await context.Products.OrderBy(p => p.Id).ToArrayAsync();
        var products = new TopProductDTO[productsDb.Length];
        var orderDetails = context.OrderDetails.OrderByDescending(o => o.ProductID).GroupBy(o => o.ProductID).Select(o => o.Sum(p => p.Quantity));
        for(int i = 0; i<products.Length; i++)
        {
            products[i] = new TopProductDTO{
                Product = productsDb[i],
                Count = orderDetails.ElementAt(i),
            };
        }
        var newProducts = products.OrderByDescending(p => p.Count).Take(10);
        return Ok(newProducts);
    }

    [HttpGet("top-revenue"), Authorize(Policy = "User")]
    public async Task<ActionResult<Product>> GetTopRevenueProducts()
    {
        var productsDb = await context.Products.OrderBy(p => p.Id).ToArrayAsync();
        var products = new TopRevenueProductDTO[productsDb.Length];
        var orderDetailsPrice = context.OrderDetails.Join(context.Products, od => od.ProductID, pr => pr.Id, (od, pr) => new { Product = pr.Id, Total = pr.Price * od.Quantity });
        var orderDetails = orderDetailsPrice.OrderByDescending(o => o.Product).GroupBy(o => o.Product).Select(o => o.Sum(p => p.Total));
        var newOrderDetails = context.OrderDetails.OrderByDescending(o => o.ProductID).GroupBy(o => o.ProductID).Select(o => o.Sum(p => p.Quantity));
        for (int i = 0; i < products.Length; i++)
        {
            products[i] = new TopRevenueProductDTO
            {
                Product = productsDb[i],
                Total = orderDetails.ElementAt(i),
                Count = newOrderDetails.ElementAt(i)
            };
        }
        var newProducts = products.OrderByDescending(p => p.Total).Take(10);
        return Ok(newProducts);
    }

    //GET: Product By ID
    [HttpGet("id/{id:int}")]
    public async Task<ActionResult<Product>> GetProduct(int id)
    {
        if (id <= 0) return BadRequest("Wrong Parameters");
        else if (!ProductExists(id)) return NotFound("Product doesn't exist");
        ActionResult<Product> product = await context.Products.FindAsync(id);
        return Ok(product.Value);
    }

    //GET: Image For Product
    [HttpGet("image/{id:int}")]
    public ActionResult GetProductImage(int id)
    {
        if (id <= 0)
            return BadRequest("Wrong Parameters");
        else if (!ProductExists(id))
            return NotFound("Product doesn't exist");
        var path = Path.Combine("C:\\Users\\PC\\Desktop\\Detyra\\Lab1\\Lab-Project\\Lab-Project.Server\\uploads\\products\\" + id + ".png");
        if (!System.IO.File.Exists(path)) return NotFound(id+" doesn't have an image");
        return PhysicalFile(path, "image/png");
    }

    //POST: Product
    [HttpPost, Authorize(Policy = "User")]
    public async Task<ActionResult<Product>> PostProduct(Product product)
    {

        if (product.Id <= 0 || product.Name == null || product.Name.Length <= 0 || product.CategoryName == null || product.CategoryName.Length <= 0 || product.Price < 0)
            return BadRequest("Wrong Parameters");
        else if(ProductExists(product.Id))
            return BadRequest("Product exists");
        await context.Products.AddAsync(product);
        await context.SaveChangesAsync();
        return Ok(product);
    }

    //POST: Image for Product
    [HttpPost("image/{id}"), Authorize(Policy = "User")]
    public async Task<ActionResult<IFormFile>> PostProductImage(int id, IFormFile image)
    {
        if(image == null || image.Length <= 0 || image.Length > 5120000) return BadRequest("Wrong Parameters");
        return Ok(await uploadService.UploadFile(image, "products", id));
    }
    
    //UPDATE: Product
    [HttpPatch, Authorize(Policy = "Admin")]
    public async Task<ActionResult<Product>> UpdateProduct(Product product)
    {
        if (product.Id <= 0 || product.Name == null || product.Name.Length <= 0 || product.CategoryName == null || product.CategoryName.Length <= 0 || product.Price < 0)
            return BadRequest("Wrong Parameters");
        else if (!ProductExists(product.Id))
            return NotFound("Product doesn't exist");
        context.Products.Update(product);
        await context.SaveChangesAsync(true);
        return Ok(product);
    }

    //DELETE: Product
    [HttpDelete("{id:int}"), Authorize(Policy = "Admin")]
    public async Task<ActionResult<Product>> DeleteProduct(int id)
    {
        if (id <= 0)
            return BadRequest("Wrong Parameters");
        else if(!ProductExists(id))
            return NotFound("Product doesn't exist");
        Product product = await context.Products.FindAsync(id);
        if (product == null)
            return BadRequest("Product is null");
        context.Products.Remove(product);
        await context.SaveChangesAsync();
        uploadService.DeleteFile("products", id);
        return Ok("Deleted " + id);    
    }

    private bool ProductExists(int id)
    {
        return context.Products.Any(e => e.Id == id);
    }
}
