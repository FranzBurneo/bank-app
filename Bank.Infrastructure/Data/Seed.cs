using Bank.Domain.Entities;
using Bank.Domain;
using Microsoft.EntityFrameworkCore;

namespace Bank.Infrastructure.Data
{
    public static class Seed
    {
        public static async Task RunAsync(BankDbContext db)
        {
            if (await db.Clients.AnyAsync()) return;

            var jose = new Client
            {
                Id = Guid.NewGuid(),
                Name = "Jose Lema",
                Gender = "M",
                Age = 35,
                Identification = "JL001",
                Address = "Otavalo sn y principal",
                Phone = "098254785",
                ClientCode = "1234",
                Password = "1234",
                IsActive = true
            };
            var mar = new Client
            {
                Id = Guid.NewGuid(),
                Name = "Marianela Montalvo",
                Gender = "F",
                Age = 32,
                Identification = "MM001",
                Address = "Amazonas y NNUU",
                Phone = "097548965",
                ClientCode = "5678",
                Password = "5678",
                IsActive = true
            };
            var juan = new Client
            {
                Id = Guid.NewGuid(),
                Name = "Juan Osorio",
                Gender = "M",
                Age = 34,
                Identification = "JO001",
                Address = "13 junio y Equinoccial",
                Phone = "098874587",
                ClientCode = "1245",
                Password = "1245",
                IsActive = true
            };

            var a1 = new Account { Id = Guid.NewGuid(), Number = "478758", Type = AccountType.Ahorro, InitialBalance = 2000, CurrentBalance = 2000, Client = jose };
            var a2 = new Account { Id = Guid.NewGuid(), Number = "225487", Type = AccountType.Corriente, InitialBalance = 100, CurrentBalance = 100, Client = mar };
            var a3 = new Account { Id = Guid.NewGuid(), Number = "495878", Type = AccountType.Ahorro, InitialBalance = 0, CurrentBalance = 0, Client = juan };
            var a4 = new Account { Id = Guid.NewGuid(), Number = "496825", Type = AccountType.Ahorro, InitialBalance = 540, CurrentBalance = 540, Client = mar };

            db.AddRange(jose, mar, juan, a1, a2, a3, a4);
            await db.SaveChangesAsync();
        }
    }
}
