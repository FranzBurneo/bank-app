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

builder.Services.AddCors(opt =>
{
    opt.AddPolicy("ng", p =>
        p.WithOrigins("http://localhost:4200")
         .AllowAnyHeader()
         .AllowAnyMethod());
});

var app = builder.Build();

app.UseCors("ng");

app.Use(async (ctx, next) =>
{
    try { await next(); }
    catch (Exception ex)
    {
        ctx.Response.StatusCode = 500;
        await ctx.Response.WriteAsJsonAsync(new { error = ex.Message });
    }
});

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