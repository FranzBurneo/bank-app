using Bank.Domain.Entities;
using Bank.Infrastructure.Data;
using Microsoft.Extensions.DependencyInjection;
using System.Net;
using System.Threading.Tasks;
using Xunit;

namespace Bank.Tests
{
    public class HealthTests : IClassFixture<CustomWebApplicationFactory>
    {
        private readonly CustomWebApplicationFactory _factory;

        public HealthTests(CustomWebApplicationFactory factory) => _factory = factory;

        [Fact]
        public async Task Health_ReturnsOk()
        {
            var client = _factory.CreateClient();
            var response = await client.GetAsync("/health");
            Assert.Equal(HttpStatusCode.OK, response.StatusCode);
        }

        [Fact]
        public async Task Clientes_GetAll_ReturnsOk_AndSeededItem()
        {
            using (var scope = _factory.Services.CreateScope())
            {
                var db = scope.ServiceProvider.GetRequiredService<BankDbContext>();
                db.Clients.Add(new Client
                {
                    Name = "Jose Lema",
                    Gender = "M",
                    Age = 35,
                    Identification = "JL001",
                    Address = "Otavalo sn y principal",
                    Phone = "098254785",
                    ClientCode = "1234",
                    Password = "1234",
                    IsActive = true
                });
                await db.SaveChangesAsync();
            }

            var clientHttp = _factory.CreateClient();
            var resp = await clientHttp.GetAsync("/api/clientes");

            Assert.Equal(HttpStatusCode.OK, resp.StatusCode);
            var body = await resp.Content.ReadAsStringAsync();
            Assert.Contains("Jose Lema", body);
        }
    }
}