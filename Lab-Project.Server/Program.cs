using Lab_Project.Server.Data;
using Lab_Project.Server.Services.FileUpload;
using Lab_Project.Server.Services.Token;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Text;
using Lab_Project.Server.Hubs;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR(options =>
{
    options.EnableDetailedErrors = true;
});

//SQL Server Connection
builder.Services.AddDbContext<DataContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});

//File Upload
builder.Services.AddScoped<IFileUploadService, FileUploadService>();

//Token Handling
builder.Services.AddScoped<ITokenService, TokenService>();

//Allow Same Origin Fetching
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(
        policy =>
            policy.AllowAnyOrigin()
                .AllowAnyHeader()
                .AllowAnyMethod());
});

//JWT Authentication
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
        // Adding Jwt Bearer
        .AddJwtBearer(options => {
            options.TokenValidationParameters = new TokenValidationParameters()
            {
                ValidateIssuer = true,
                ValidateAudience = true,
                ValidateLifetime = true,
                ValidateIssuerSigningKey = true,
                ValidAudience = builder.Configuration["JWT:ValidAudience"],
                ValidIssuer = builder.Configuration["JWT:ValidIssuer"],
                IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["JWT:Token"]!))
            };
});

builder.Services.AddAuthorizationBuilder()
    .AddPolicy("Admin", policy => policy.RequireClaim("Role", "Admin"))
    .AddPolicy("User", policy => policy.RequireClaim("Role", "Admin", "User", "Staff"));

//Swagger JWT Support
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("oauth2", new OpenApiSecurityScheme
    {
        In = ParameterLocation.Header,
        Name = "Bearer",
    });

    options.OperationFilter<SecurityRequirementsOperationFilter>();
});

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors();

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();
app.MapHub<ChatHub>("/chatHub");

app.MapFallbackToFile("/index.html");
       
app.Run();
