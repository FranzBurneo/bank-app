using Bank.Domain;

namespace Bank.Api.DTOs
{
    public record AccountDto(
        Guid Id,
        string Number,
        AccountType Type,
        decimal InitialBalance,
        bool IsActive,
        Guid ClientId,
        decimal CurrentBalance,
        string? ClientName
    );
    public record CreateAccountDto(
        string Number,
        AccountType Type,
        decimal InitialBalance,
        Guid ClientId
    );

    public record UpdateAccountDto(
        string Number,
        AccountType Type,
        decimal InitialBalance,
        bool IsActive,
        Guid ClientId
    );
}
