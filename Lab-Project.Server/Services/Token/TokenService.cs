using Lab_Project.Server.Models;
using Microsoft.AspNetCore.Authentication.OAuth.Claims;
using Microsoft.IdentityModel.Tokens;
using System.Configuration;
using System.Diagnostics;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;

namespace Lab_Project.Server.Services.Token;

public class TokenService : ITokenService
{
    private readonly IConfiguration configuration;

    public TokenService(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    //Create JWT
    public string CreateToken(Client client)
    {
        List<Claim> claims =
        [
            new("Id", client.Id.ToString()),
            new("FullName", client.FullName),
            new("Email", client.Email),
            new("Role", client.Role),
        ];

        var key = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(
                configuration.GetSection("JWT:Token").Value!));
        var cred = new SigningCredentials(key, SecurityAlgorithms.HmacSha512Signature);
        var token = new JwtSecurityToken(configuration["JWT:ValidIssuer"],
                                configuration["JWT:ValidAudience"],
                               claims: claims,
                               expires: DateTime.UtcNow.AddMinutes(10),
                               signingCredentials: cred
        );
        var jwt = new JwtSecurityTokenHandler().WriteToken(token);
        return jwt;
    }

    //Decode JWT ID
    public int DecodeTokenId(string token)
    {
        if (token == null || token.Length <= 0) return -1;
        var tokenDecoded = new JwtSecurityTokenHandler().ReadJwtToken(token);
        var claims = tokenDecoded.Claims.ToList();
        var exp = DateTimeOffset.FromUnixTimeSeconds(long.Parse(claims[4].Value)).UtcDateTime;
        //return DateTime.Now < exp ? 1 : 0;
        //Check Expiration
        if (!ValidToken(exp)) return -1;
        var tokenId = int.Parse(claims[0].Value);
        return tokenId;
    }

    //Decode JWT Role
    public string DecodeTokenRole(string token)
    {
        if (token == null || token.Length <= 0) return "Invalid Token";
        var tokenDecoded = new JwtSecurityTokenHandler().ReadJwtToken(token);
        var claims = tokenDecoded.Claims.ToList();
        var exp = DateTimeOffset.FromUnixTimeSeconds(long.Parse(claims[4].Value)).UtcDateTime;
        //Check Expiration
        if (!ValidToken(exp)) return "Invalid Token";
        string tokenRole = claims[3].Value;
        return tokenRole;
    }

    public static bool ValidToken(DateTime exp)
    {
        return DateTime.UtcNow < exp;
    }

    public RefreshToken CreateRefreshToken(Client client)
    {
        RefreshToken refreshToken = new()
        {
            Token = Guid.NewGuid(),
            Expires = DateTime.UtcNow.AddHours(2),
            ClientId = client.Id
        };
        return refreshToken;
    }
}
