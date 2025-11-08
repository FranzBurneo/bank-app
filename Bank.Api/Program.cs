using Bank.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

if (builder.Environment.EnvironmentName != "Testing")
{
    builder.Services.AddDbContext<BankDbContext>(opt =>
        opt.UseNpgsql(builder.Configuration.GetConnectionString("Default")));
}
else
{
    builder.Services.AddDbContext<BankDbContext>(opt =>
        opt.UseInMemoryDatabase("BankDb_Test"));
}

builder.Services.AddScoped<Bank.Infrastructure.Services.MovementDomainService>();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<BankDbContext>();
    await db.Database.EnsureCreatedAsync();
    await Seed.RunAsync(db);
}

app.MapGet("/health", () => Results.Ok(new { status = "ok" }));
app.MapControllers();

app.Run();

public partial class Program { }