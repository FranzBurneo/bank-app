using Microsoft.EntityFrameworkCore;

namespace Bank.Infrastructure.Data
{
    public class BankDbContext : DbContext
    {
        public BankDbContext(DbContextOptions<BankDbContext> options) : base(options) { }

        // TODO: DbSets (Person, Client, Account, Movement)
        public DbSet<Bank.Domain.Entities.Person> Persons => Set<Bank.Domain.Entities.Person>();
    }
}