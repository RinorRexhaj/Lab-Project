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
    [HttpGet, Authorize(Policy = "Admin")]
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

    [HttpGet("{id}"), Authorize(Policy = "User")]
    public async Task<ActionResult<OrderDTO>> GetUsersOrders(int id)
    {
        var ordersDb = await context.Orders.Where(o => o.ClientID == id).ToArrayAsync();
        var products = await context.Products.ToArrayAsync();
        var orders = new OrderDTO[ordersDb.Length];
        List<int> productsPurchased = [];
        for (int i = 0; i < ordersDb.Length; i++)
        {
            orders[i] = new OrderDTO
            {
                Order = ordersDb[i],
                OrderDetails = await context.OrderDetails.Where(o => o.OrderID == ordersDb[i].OrderID).ToArrayAsync(),
            };
            var sum = 0.0;
            for (int j = 0; j < orders[i].OrderDetails.Length; j++)
            {
                var pr = context.Products.FirstOrDefault(p => p.Id == orders[i].OrderDetails[j].ProductID);
                if(pr != null)
                {
                sum += (double)pr.Price * orders[i].OrderDetails[j].Quantity;
                if (!productsPurchased.Contains(pr.Id))
                    productsPurchased.Add(pr.Id);
                }
            }
            orders[i].Total = sum;
        }
        var newOrders = orders.GroupBy(o => o.Order.SetDate.ToString("MMMM"));
        var total = orders.Sum(o => o.Total);
        var newProducts = new Product[productsPurchased.Count];
        for(int i = 0; i<productsPurchased.Count; i++)
        {
            var pr = context.Products.FirstOrDefault(p => p.Id == productsPurchased.ElementAt(i));
            newProducts[i] = pr;
        }
        //var totalPrCount = orders.Sum(o => o.ProductCount);
        return Ok(new { newOrders, total, newProducts });
    }

    [HttpGet("categories"), Authorize(Policy = "Admin")]
    public async Task<ActionResult<double>> GetTotalCategories()
    {
        var prOdTotal = context.Products.Join(context.OrderDetails, product => product.Id, od => od.ProductID, (product, od) => new { Product = product.Id, CategoryName = product.CategoryName, Total = product.Price * od.Quantity });
        var prTotal = prOdTotal.GroupBy(p => new { p.Product, p.CategoryName }).Select(p => new { CategoryName = p.Key.CategoryName, Total = p.Sum(p => p.Total) });
        var categoriesTotal = prTotal.GroupBy(p => p.CategoryName).Select(c => new {CategoryName = c.Key, Total = c.Sum(c => c.Total)});
        return Ok(categoriesTotal);
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