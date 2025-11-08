namespace Bank.Domain.Entities
{
    public class Client : Person
    {
        public string ClientCode { get; set; } = default!;
        public string Password { get; set; } = default!;
        public bool IsActive { get; set; } = true;

        public ICollection<Account> Accounts { get; set; } = new List<Account>();
    }
}