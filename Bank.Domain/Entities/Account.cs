namespace Bank.Domain.Entities
{
    public class Account
    {
        public Guid Id { get; set; }
        public string Number { get; set; } = default!;
        public AccountType Type { get; set; }
        public decimal InitialBalance { get; set; }
        public bool IsActive { get; set; } = true;

        public Guid ClientId { get; set; }
        public Client Client { get; set; } = default!;

        // saldo actual para respuestas rápidas
        public decimal CurrentBalance { get; set; }

        public ICollection<Movement> Movements { get; set; } = new List<Movement>();
    }
}