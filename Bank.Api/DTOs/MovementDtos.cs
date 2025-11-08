using Bank.Domain;

namespace Bank.Api.DTOs
{
    public record CreateMovementDto(Guid AccountId, MovementType Type, decimal Value);
    public record ReportFilterDto(Guid ClientId, DateTime Desde, DateTime Hasta);
}
