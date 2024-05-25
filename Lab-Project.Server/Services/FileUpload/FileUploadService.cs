namespace Lab_Project.Server.Services.FileUpload;

public class FileUploadService : IFileUploadService
{
    private readonly IWebHostEnvironment _env;
    public FileUploadService(IWebHostEnvironment env)
    {
        _env = env;
    }

    public async Task<string> UploadFile(IFormFile file, string type, int id)
    {
        var filePath = Path.Combine(_env.ContentRootPath, "uploads/" + type, id + ".png");
        using var fileStream = new FileStream(filePath, FileMode.Create);
        await file.CopyToAsync(fileStream);
        return filePath;
    }

    public string DeleteFile(string type, int id)
    {
        var filePath = Path.Combine(_env.ContentRootPath, "uploads/" + type, id + ".png");
        File.Delete(filePath);
        return filePath.ToString();
    }
}
