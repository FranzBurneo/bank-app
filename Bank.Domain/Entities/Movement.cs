namespace Bank.Domain.Entities
{
    public class Movement
    {
        public Guid Id { get; set; }
        public DateTime Date { get; set; } = DateTime.UtcNow;
        public MovementType Type { get; set; }
        // valor firmado: +credito / -debito
        public decimal Value { get; set; }
        // saldo resultante después del movimiento
        public decimal Balance { get; set; }

        public Guid AccountId { get; set; }
        public Account Account { get; set; } = default!;
    }
}