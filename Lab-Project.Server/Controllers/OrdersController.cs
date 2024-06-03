using Microsoft.AspNetCore.Mvc;
using Lab_Project.Server.Data;
using Microsoft.EntityFrameworkCore;
using Lab_Project.Server.Models;
using Lab_Project.Server.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Lab_Project.Server.Controllers;

[Route("/[controller]")]
[ApiController]
public class OrdersController : Controller
{
    private readonly DataContext context;

    public OrdersController(DataContext context)
    {
        this.context = context;
    }

    // GET: Orders
    [HttpGet]
    public async Task<ActionResult<OrderDTO>> GetOrders()
    {
        var ordersDb = await context.Orders.ToArrayAsync();
        var products = await context.Products.ToArrayAsync();
        var orders = new OrderDTO[ordersDb.Length];
        for(int i = 0; i<ordersDb.Length; i++) {
            orders[i] = new OrderDTO
            {
                Order = ordersDb[i],
                OrderDetails = await context.OrderDetails.Where(o => o.OrderID == ordersDb[i].OrderID).ToArrayAsync(),
            };
            var sum = 0.0;
            for(int j = 0; j < orders[i].OrderDetails.Length; j++)
            {
                var pr = context.Products.FirstOrDefault(p => p.Id == orders[i].OrderDetails[j].ProductID);
                sum += (double)pr.Price * orders[i].OrderDetails[j].Quantity;
            }
            orders[i].Total = sum;
        }
        var newOrders = orders.OrderBy(o => o.Order.SetDate).GroupBy(o => o.Order.SetDate.ToString("MMMM"));
        var total = orders.Sum(o => o.Total);
        return Ok(new { newOrders, total});
    }

    [HttpGet("categories"), Authorize(Policy = "Admin")]
    public async Task<ActionResult<double>> GetTotalCategories()
    {
        var products = await context.Products.ToArrayAsync();
        var categories = await context.Categories.ToArrayAsync();
        var orderDetails = await context.OrderDetails.ToArrayAsync();
        var orders = new CategoryTotalDTO[categories.Length];
        for (int i = 0; i < categories.Length; i++)
        {
            orders[i] = new CategoryTotalDTO
            {
                Category = categories[i],
            };
            var sum = 0.0;
            for (int j = 0; j < orderDetails.Length; j++)
            {
                var pr = context.Products.FirstOrDefault(p => p.Id == orderDetails[i].ProductID && p.CategoryName == categories[i].CategoryName);
                if(pr != null)
                    sum += (double)pr.Price * orderDetails[i].Quantity;
            }
            orders[i].Total = sum;
        }
        var newOrders = orders.OrderBy(c => c.Category.CategoryName);
        return Ok(newOrders);
    }

    // GET: Order by ID
    //[HttpGet("{id:int}")]
    //public async Task<ActionResult<Order>> GetOrder(int id)
    //{
    //    var order = await context.Orders
    //        .Include(o => o.OrderDetails)
    //            .ThenInclude(od => od.ProductID)
    //        .Include(o => o.ClientID)
    //        .FirstOrDefaultAsync(o => o.OrderID == id);

    //    if (order == null)
    //        return NotFound("Order doesn't exist");

    //    return Ok(order);
    //}

    // POST: Create a new order
    //[HttpPost]
    //public async Task<ActionResult<Order>> CreateOrder(Order order)
    //{
    //    if (order == null)
    //        return BadRequest("Invalid order data");
    //    await context.Orders.AddAsync(order);
    //    for(int i = 0; i<order.OrderDetails.Count(); i++)
    //    {
    //        await context.OrderDetails.AddAsync(order.OrderDetails.ElementAt(i));
    //    }
    //    await context.SaveChangesAsync();
    //    return CreatedAtAction(nameof(GetOrder), new { id = order.OrderID }, order);
    //}

    // UPDATE: Order
    [HttpPut("{id:int}")]
    public async Task<ActionResult> UpdateOrder(int id, [FromBody] Order updatedOrder)
    {
        if (id != updatedOrder.OrderID)
            return BadRequest("ID mismatch");

        context.Entry(updatedOrder).State = EntityState.Modified;
        try
        {
            await context.SaveChangesAsync();
        }
        catch (DbUpdateConcurrencyException)
        {
            if (!OrderExists(id))
                return NotFound("Order doesn't exist");
            else
                throw;
        }
        return NoContent();
    }

    // DELETE: Order
    [HttpDelete("{id:int}")]
    public async Task<IActionResult> DeleteOrder(int id)
    {
        var order = await context.Orders.FindAsync(id);
        if (order == null)
            return NotFound("Order doesn't exist");

        context.Orders.Remove(order);
        await context.SaveChangesAsync();
        return NoContent();
    }

    private bool OrderExists(int id) => context.Orders.Any(o => o.OrderID == id);
}