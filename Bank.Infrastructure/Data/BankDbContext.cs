using Bank.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Reflection.Emit;

namespace Bank.Infrastructure.Data
{
    public class BankDbContext : DbContext
    {
        public const decimal DAILY_DEBIT_LIMIT = 1000m;

        public BankDbContext(DbContextOptions<BankDbContext> options) : base(options) { }

        public DbSet<Person> Persons => Set<Person>();
        public DbSet<Client> Clients => Set<Client>();
        public DbSet<Account> Accounts => Set<Account>();
        public DbSet<Movement> Movements => Set<Movement>();

        protected override void OnModelCreating(ModelBuilder b)
        {
            b.Entity<Person>()
             .HasDiscriminator<string>("Discriminator")
             .HasValue<Person>("Person")
             .HasValue<Client>("Client");

            b.Entity<Client>()
             .HasIndex(x => x.ClientCode).IsUnique();

            b.Entity<Account>()
             .HasIndex(x => x.Number).IsUnique();

            b.Entity<Account>()
             .Property(x => x.InitialBalance).HasColumnType("numeric(18,2)");
            b.Entity<Account>()
             .Property(x => x.CurrentBalance).HasColumnType("numeric(18,2)");

            b.Entity<Movement>()
             .Property(x => x.Value).HasColumnType("numeric(18,2)");
            b.Entity<Movement>()
             .Property(x => x.Balance).HasColumnType("numeric(18,2)");

            b.Entity<Account>()
             .HasOne(a => a.Client)
             .WithMany(c => c.Accounts)
             .HasForeignKey(a => a.ClientId);
        }
    }
}