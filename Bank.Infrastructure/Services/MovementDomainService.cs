using Bank.Domain;
using Bank.Domain.Entities;
using Bank.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace Bank.Infrastructure.Services
{
    public class MovementDomainService
    {
        private readonly BankDbContext _ctx;
        public MovementDomainService(BankDbContext ctx) => _ctx = ctx;

        public async Task<Movement> ApplyAsync(Guid accountId, MovementType type, decimal amount, DateTime? when = null)
        {
            var acc = await _ctx.Accounts.Include(a => a.Movements).FirstOrDefaultAsync(a => a.Id == accountId)
                      ?? throw new InvalidOperationException("Cuenta no existe");

            if (!acc.IsActive) throw new InvalidOperationException("Cuenta inactiva");

            var signed = type == MovementType.Credito ? Math.Abs(amount) : -Math.Abs(amount);

            // Reglas: saldo no disponible si debito y saldo resultante < 0
            var newBalance = acc.CurrentBalance + signed;
            if (type == MovementType.Debito && newBalance < 0)
                throw new InvalidOperationException("Saldo no disponible");

            // Regla: límite diario de retiro (debitos)
            if (type == MovementType.Debito)
            {
                var day = (when ?? DateTime.UtcNow).Date;
                var debitsToday = await _ctx.Movements
                    .Where(m => m.AccountId == accountId && m.Date >= day && m.Date < day.AddDays(1) && m.Value < 0)
                    .SumAsync(m => -m.Value);

                if (debitsToday + Math.Abs(signed) > BankDbContext.DAILY_DEBIT_LIMIT)
                    throw new InvalidOperationException("Cupo diario excedido");
            }

            acc.CurrentBalance = newBalance;

            var mov = new Movement
            {
                AccountId = accountId,
                Type = type,
                Value = signed,
                Balance = newBalance,
                Date = when ?? DateTime.UtcNow
            };

            _ctx.Movements.Add(mov);
            await _ctx.SaveChangesAsync();
            return mov;
        }
    }
}