using Microsoft.AspNetCore.Mvc;
using Lab_Project.Server.Data;
using Microsoft.EntityFrameworkCore;
using Lab_Project.Server.Models;
using Lab_Project.Server.Services.FileUpload;

namespace Lab_Project.Server.Controllers;

[Route("/[controller]")]
[ApiController]
public class CarsController : Controller
{
    private readonly IFileUploadService uploadService;
    private readonly DataContext context;

    public CarsController(DataContext context, IFileUploadService uploadService)
    {
        this.context = context;
        this.uploadService = uploadService;
    }

    [HttpGet]
    public async Task<ActionResult<Car>> GetCars()
    {
        IEnumerable<Car> cars = await context.Cars.ToArrayAsync();
        return Ok(cars);
    }

    //GET: Car By ID
    [HttpGet("id/{id:int}")]
    public async Task<ActionResult<Car>> GetCar(int id)
    {
        if (id <= 0)
        {
            return BadRequest("Wrong Parameters");
        }
        else if (CarExists(id))
        {
            ActionResult<Car> car = await context.Cars.FindAsync(id);
            return Ok(car.Value);
        }
        else
        {
            return NotFound("Car doesn't exist");
        }
    }

    //GET: Image For Car
    [HttpGet("image/{id:int}")]
    public async Task<ActionResult> GetCarImage(int id)
    {
        if (id <= 0)
        {
            return BadRequest("Wrong Parameters");
        }
        else if (!CarExists(id))
        {
            return NotFound("Car doesn't exist");
        }
        return PhysicalFile("C:\\Users\\DataProgNet\\Desktop\\Lab-Project\\Lab-Project.Server\\uploads\\cars\\" + id + ".png", "image/png");
    }

    //POST: Car
    [HttpPost]
    public async Task<ActionResult<Car>> PostCar(Car car)
    {

        if (car.Id <= 0 || car.Name == null || car.Name.Length <= 0 || car.ModelName == null || car.ModelName.Length <= 0 || car.Price < 0)
        {
            return BadRequest("Wrong Parameters");
        }
        else
        {
            await context.Cars.AddAsync(car);
            await context.SaveChangesAsync();
            return Ok(car);
        }
    }

    //POST: Image for Car
    [HttpPost("image/{id:int}")]
    public async Task<ActionResult<IFormFile>> PostCarImage(int id, IFormFile image)
    {
        if (image == null || image.Length <= 0 || image.Length > 5120000) { return BadRequest("Wrong Parameters"); }
        else
        {
            return Ok(await uploadService.UploadFile(image, "cars", id));
        }
    }

    // UPDATE: Car
    [HttpPatch]
    public async Task<ActionResult<Car>> UpdateCar(Car car)
    {
        if (car.Id <= 0 || car.Name == null || car.Name.Length <= 0 || car.ModelName == null || car.ModelName.Length <= 0 || car.Price < 0)
        {
            return BadRequest("Wrong Parameters");
        }
        else if (CarExists(car.Id))
        {
            context.Cars.Update(car);
            await context.SaveChangesAsync(true);
            return Ok(car);
        }
        else
        {
            return NotFound("Car doesn't exist");
        }
    }


    // DELETE: Car
    [HttpDelete("{id:int}")]
    public async Task<ActionResult<Car>> DeleteCar(int id)
    {
        if (id <= 0)
        {
            return BadRequest("Wrong Parameters");
        }
        else if (CarExists(id))
        {
            Car car = await context.Cars.FindAsync(id);
            if (car != null)
            {
                context.Cars.Remove(car);
                await context.SaveChangesAsync();
                return Ok("Deleted " + id);
            }
            else return BadRequest("Car is null");
        }
        else
        {
            return NotFound("Car doesn't exist");
        }
    }

    //POST: Rent a car
    [HttpPost("rent")]
    public async Task<ActionResult<Rent>> RentCar(Rent rent)
    {
        if (!CarExists(rent.CarID))
        {
            return NotFound("Car doesn't exist");
        }

        if (!context.Rents.Any(c => c.ClientID == rent.ClientID))
        {
            return NotFound("Client doesn't exist");
        }

        await context.Rents.AddAsync(rent);
        await context.SaveChangesAsync();
        return Ok(rent);
    }

    private bool CarExists(int id)
    {
        return context.Cars.Any(e => e.Id == id);
    }
}
