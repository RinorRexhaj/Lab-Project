namespace Lab_Project.Server.Services.FileUpload;

public interface IFileUploadService
{
    Task<string> UploadFile(IFormFile file, string type, int id);
    string DeleteFile(string type, int id);
}
