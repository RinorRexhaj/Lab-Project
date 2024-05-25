using Lab_Project.Server.Models;
using static Lab_Project.Server.Models.RefreshToken;

namespace Lab_Project.Server.Services.Token;

public interface ITokenService
{
    public string CreateToken(Client client);
    public int DecodeTokenId(string token);
    public string DecodeTokenRole(string token);
    public RefreshToken CreateRefreshToken(Client client);
}
