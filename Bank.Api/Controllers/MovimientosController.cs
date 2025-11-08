using Bank.Api.DTOs;
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
        public async Task<IActionResult> CrearMovimiento(CreateMovementDto dto)
        {
            try
            {
                var mov = await _service.ApplyAsync(dto.AccountId, dto.Type, dto.Value);
                return Ok(new { mov.Id, mov.Date, mov.Type, mov.Value, mov.Balance, mov.AccountId });
            }
            catch (Exception ex) { return BadRequest(new { message = ex.Message }); }
        }

        [HttpGet("reporte")]
        public async Task<IActionResult> Reporte([FromQuery] ReportFilterDto f)
        {
            var q = _context.Movements
                .Where(m => m.Account.ClientId == f.ClientId && m.Date >= f.Desde && m.Date <= f.Hasta)
                .OrderBy(m => m.Date)
                .Select(m => new {
                    Fecha = m.Date,
                    Cliente = m.Account.Client.Name,
                    NumeroCuenta = m.Account.Number,
                    Tipo = m.Account.Type.ToString(),
                    SaldoInicial = m.Account.InitialBalance,
                    Estado = m.Account.IsActive,
                    Movimiento = m.Value,
                    SaldoDisponible = m.Balance
                });
            return Ok(await q.ToListAsync());
        }
    }
}
