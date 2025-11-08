using Bank.Infrastructure.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using System.Linq;

namespace Bank.Tests
{
    public class CustomWebApplicationFactory : WebApplicationFactory<Program>
    {
        protected override void ConfigureWebHost(IWebHostBuilder builder)
        {
            builder.UseEnvironment("Testing");
            builder.ConfigureServices(services =>
            {
                // Quita el DbContext de producción (Npgsql)
                var descriptor = services.SingleOrDefault(
                    d => d.ServiceType == typeof(DbContextOptions<BankDbContext>));
                if (descriptor is not null) services.Remove(descriptor);

                // Agrega DbContext en memoria para pruebas
                services.AddDbContext<BankDbContext>(opt =>
                    opt.UseInMemoryDatabase("BankDb_Test"));

                // Construye provider y crea la base en memoria
                var sp = services.BuildServiceProvider();
                using var scope = sp.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<BankDbContext>();
                db.Database.EnsureCreated();
            });
        }
    }
}