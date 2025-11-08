namespace Bank.Domain.Entities
{
    public class Person
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string Gender { get; set; } = default!;
        public int Age { get; set; }
        public string Identification { get; set; } = default!;
        public string Address { get; set; } = default!;
        public string Phone { get; set; } = default!;
    }
}