using Lab_Project.Server.Data;
using Lab_Project.Server.Models;
using Lab_Project.Server.Services.FileUpload;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Lab_Project.Server.Controllers;

[Route("/[controller]")]
[ApiController]
public class ModelsController : ControllerBase
{
    private readonly DataContext context;

    public ModelsController(DataContext context)
    {
        this.context = context;
    }

    [HttpGet, Authorize(Policy = "User")]
    public async Task<ActionResult<Model>> GetModels()
    {
        IEnumerable<Model> Models = await context.Models.ToArrayAsync();
        return Ok(Models);
    }

    [HttpPost, Authorize(Policy = "Admin")]
    public async Task<ActionResult<Model>> PostModel(Model Model)
    {
        if (Model == null || Model.ModelName == null || Model.ModelName.Length <= 0) return BadRequest("Invalid parameters");
        if (ModelExists(Model.ModelName)) return BadRequest("Model exists");
        await context.Models.AddAsync(Model);
        await context.SaveChangesAsync();
        return Ok(Model);
    }

    public class UpdateModelDTO
    {
        public string OldModel { get; set; }
        public string NewModel { get; set; }
    }
    [HttpPatch, Authorize(Policy = "Admin")]
    public async Task<ActionResult<Model>> UpdateModel(UpdateModelDTO Model)
    {
        if (Model.OldModel == null || Model.NewModel == null || Model.OldModel.Length <= 0) return BadRequest("Invalid parameters");
        if (!ModelExists(Model.OldModel)) return BadRequest("Model doesn't exist");
        Model cat = new()
        {
            ModelName = Model.NewModel
        };
        await context.Models.AddAsync(cat);
        var oldCars = context.Cars.Where(p => p.ModelName == Model.OldModel);
        foreach (var prd in oldCars)
        {
            prd.ModelName = Model.NewModel;
        }
        await context.SaveChangesAsync();
        var c = context.Models.FirstOrDefault(c => c.ModelName == Model.OldModel);
        context.Models.Remove(c);
        await context.SaveChangesAsync();
        return Ok(c);
    }

    [HttpDelete("{name}"), Authorize(Policy = "Admin")]
    public async Task<ActionResult<Model>> DeleteModel(string name)
    {
        Model Model = await context.Models.FirstOrDefaultAsync(c => c.ModelName == name);
        if (Model == null)
        {
            return BadRequest("Model doesn't exist");
        }
        context.Models.Remove(Model);
        await context.SaveChangesAsync();
        return Ok(Model);
    }

    private bool ModelExists(string name)
    {
        return context.Models.Any(c => c.ModelName == name);
    }
}
