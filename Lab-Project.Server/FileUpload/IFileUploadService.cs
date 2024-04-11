namespace Lab_Project.Server.FileUpload;

public interface IFileUploadService
{
    Task<string> UploadFile(IFormFile file, string type, int id);
}
