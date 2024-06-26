﻿// ShippingMethodsController.cs
using Lab_Project.Server.Data;
using Lab_Project.Server.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Lab_Project.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ShippingMethodsController : ControllerBase
    {
        private readonly DataContext _context;

        public ShippingMethodsController(DataContext context)
        {
            _context = context;
        }

        // GET: api/ShippingMethods
        [HttpGet]
        public async Task<ActionResult<IEnumerable<ShippingMethod>>> GetShippingMethods()
        {
            return await _context.ShippingMethods.ToListAsync();
        }

        // GET: api/ShippingMethods/5
        [HttpGet("{id}")]
        public async Task<ActionResult<ShippingMethod>> GetShippingMethod(int id)
        {
            var shippingMethod = await _context.ShippingMethods.FindAsync(id);

            if (shippingMethod == null)
            {
                return NotFound();
            }

            return shippingMethod;
        }

        // POST: api/ShippingMethods
        [HttpPost]
        public async Task<ActionResult<ShippingMethod>> PostShippingMethod(ShippingMethod shippingMethod)
        {
            _context.ShippingMethods.Add(shippingMethod);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetShippingMethod", new { id = shippingMethod.Id }, shippingMethod);
        }

        // PUT: api/ShippingMethods/5
        public class MethodDTO
        {
            public string name { get; set; }
            public string newName { get; set; }
        }
        [HttpPut]
        public async Task<IActionResult> PutShippingMethod(MethodDTO method)
        {

            var newMethod = _context.ShippingMethods.FirstOrDefault(s => s.Name == method.name);
            if (method != null)
            {
                newMethod.Name = method.newName;
                _context.SaveChanges();
            }
            else
            {
                return NotFound();
            }
            return NoContent();
        }

        // DELETE: api/ShippingMethods/5
        [HttpDelete("{name}")]
        public async Task<IActionResult> DeleteShippingMethod(string name)
        {
            var shippingMethod = await _context.ShippingMethods.FirstAsync(s => s.Name == name);
            if (shippingMethod == null)
            {
                return NotFound();
            }

            _context.ShippingMethods.Remove(shippingMethod);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ShippingMethodExists(int id)
        {
            return _context.ShippingMethods.Any(e => e.Id == id);
        }
    }
}