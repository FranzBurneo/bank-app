using Bank.Domain;
using Bank.Infrastructure.Data;
using Bank.Infrastructure.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bank.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class MovimientosController : ControllerBase
    {
        private readonly BankDbContext _context;
        private readonly MovementDomainService _service;

        public MovimientosController(BankDbContext context, MovementDomainService service)
        {
            _context = context;
            _service = service;
        }

        [HttpPost]
        public async Task<IActionResult> CrearMovimiento(Guid accountId, MovementType type, decimal value)
        {
            try
            {
                var mov = await _service.ApplyAsync(accountId, type, value);
                return Ok(mov);
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("reporte")]
        public async Task<IActionResult> Reporte([FromQuery] DateTime desde, [FromQuery] DateTime hasta, [FromQuery] Guid clienteId)
        {
            var movimientos = await _context.Movements
                .Where(m => m.Account.ClientId == clienteId && m.Date >= desde && m.Date <= hasta)
                .OrderBy(m => m.Date)
                .Select(m => new
                {
                    Fecha = m.Date,
                    Cliente = m.Account.Client.Name,
                    NumeroCuenta = m.Account.Number,
                    Tipo = m.Account.Type.ToString(),
                    SaldoInicial = m.Account.InitialBalance,
                    Estado = m.Account.IsActive,
                    Movimiento = m.Value,
                    SaldoDisponible = m.Balance
                })
                .ToListAsync();

            return Ok(movimientos);
        }
    }
}
