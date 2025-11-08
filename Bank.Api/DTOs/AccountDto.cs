using Bank.Domain;

namespace Bank.Api.DTOs
{
    public record AccountDto(Guid Id, string Number, AccountType Type, decimal CurrentBalance, bool IsActive, Guid ClientId);
    public record CreateAccountDto(string Number, AccountType Type, decimal InitialBalance, Guid ClientId);
}
