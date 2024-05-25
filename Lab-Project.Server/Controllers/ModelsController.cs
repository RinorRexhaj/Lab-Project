using Lab_Project.Server.Data;
using Lab_Project.Server.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab_Project.Server.Controllers
{
    [Route("[controller]")]
    [ApiController]
    public class ModelsController : ControllerBase
    {
        private readonly DataContext context;

        public ModelsController(DataContext context)
        {
            this.context = context;
        }

        [HttpGet]
        public async Task<ActionResult<Model>> GetModels()
        {
            IEnumerable<Model> models = await context.Models.ToArrayAsync();
            return Ok(models);
        }
    }
}