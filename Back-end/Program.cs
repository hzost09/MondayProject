using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using Mondacom2.Mycontext;
using System.Security.Claims;
using System.Text;
using Swashbuckle.AspNetCore.SwaggerGen;
using Swashbuckle.AspNetCore.Filters;
using Mondaycom2.helper;
using Mondaycom2.Model;
using Mondaycom2;
using SignalR2.hub;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(opt =>
{
    opt.AddSecurityDefinition("Lock", new OpenApiSecurityScheme
    {
        Description = "standar : (\"Bearer {token}\")",
        In = ParameterLocation.Header,
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "bearer"
    });


    opt.OperationFilter<SecurityRequirementsOperationFilter>();
});

builder.Services.AddDbContext<Data>(opt =>
{
    opt.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection"));
});
builder.Services.AddCors(opt => opt.AddPolicy(name: "mypolicy",
        policy =>
        {
            policy.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:4200");
        }
    ));


builder.Services.AddAuthentication(x =>
{
    x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(x =>
{
    // không cần https để trao đổi metadata
    x.RequireHttpsMetadata = false;
    //save token vào AuthenticationProperties
    x.SaveToken = true;
    //định dạng chính xác việc xét jwt 
    x.TokenValidationParameters = new TokenValidationParameters
    {
        //Điều khiển việc xác thực SecurityKey đã ký securityToken. Nếu giá trị này là true, SecurityKey sẽ được kiểm tra
        ValidateIssuerSigningKey = true,

        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes("my16charSecretKey")),
        //Điều khiển việc xác thực giá trị audience trong token. Nếu giá trị này là false, giá trị audience sẽ không được kiểm tra
        ValidateAudience = false,
        //Điều khiển việc xác thực giá trị issuer trong token. Nếu giá trị này là false, giá trị issuer sẽ không được kiểm tra
        ValidateIssuer = false,

        //kết hợp với Expires trong UserController để ra time chính xác (có thể sử dụng mà ko cần não)
        ClockSkew = TimeSpan.Zero,
    };
});

builder.Services.AddScoped<IsendEmailReset, sendEmailReset>();
builder.Services.AddSignalR(o =>
{
    o.MaximumReceiveMessageSize = 102400000;
    o.EnableDetailedErrors = true;
});
builder.Services.AddSingleton<IDictionary<string, roomconnection>>(opt =>
new Dictionary<string, roomconnection>()
);
var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}
app.UseCors("mypolicy");
app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.MapHub<chathub>("/hub");
app.Run();
