namespace Bank.Api.DTOs
{
    public record ClientDto(Guid Id, string Name, string Gender, int Age, string Identification, string Address, string Phone, string ClientCode, bool IsActive);
    public record CreateClientDto(string Name, string Gender, int Age, string Identification, string Address, string Phone, string ClientCode, string Password);
}
