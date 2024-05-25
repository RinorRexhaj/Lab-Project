using Microsoft.AspNetCore.Mvc;
using Lab_Project.Server.Data;
using Microsoft.EntityFrameworkCore;
using Lab_Project.Server.Models;

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
    public async Task<ActionResult<IEnumerable<Order>>> GetOrders()
    {
        var orders = await context.Orders
            .Include(o => o.OrderDetails)
            .Include(o => o.ClientID)
            .ToListAsync();
        return Ok(orders);
    }

    // GET: Order by ID
    [HttpGet("{id:int}")]
    public async Task<ActionResult<Order>> GetOrder(int id)
    {
        var order = await context.Orders
            .Include(o => o.OrderDetails)
                .ThenInclude(od => od.ProductID)
            .Include(o => o.ClientID)
            .FirstOrDefaultAsync(o => o.OrderID == id);

        if (order == null)
            return NotFound("Order doesn't exist");

        return Ok(order);
    }

    // POST: Create a new order
    [HttpPost]
    public async Task<ActionResult<Order>> CreateOrder(Order order)
    {
        if (order == null)
            return BadRequest("Invalid order data");
        await context.Orders.AddAsync(order);
        for(int i = 0; i<order.OrderDetails.Count(); i++)
        {
            await context.OrderDetails.AddAsync(order.OrderDetails.ElementAt(i));
        }
        await context.SaveChangesAsync();
        return CreatedAtAction(nameof(GetOrder), new { id = order.OrderID }, order);
    }

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