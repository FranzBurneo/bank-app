using Bank.Api.DTOs;
using Bank.Domain.Entities;
using Bank.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bank.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CuentasController : ControllerBase
    {
        private readonly BankDbContext _context;
        public CuentasController(BankDbContext context) => _context = context;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<AccountDto>>> Get()
        {
            var data = await _context.Accounts
                .Select(a => new AccountDto(
                    a.Id,
                    a.Number,
                    a.Type,
                    a.InitialBalance,
                    a.IsActive,
                    a.ClientId,
                    a.CurrentBalance,
                    a.Client.Name)
                    )
                .ToListAsync();

            return Ok(data);
        }

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<AccountDto>> GetById(Guid id)
        {
            var acc = await _context.Accounts
                .Where(a => a.Id == id)
                .Select(a => new AccountDto(
                    a.Id,
                    a.Number,
                    a.Type,
                    a.InitialBalance,
                    a.IsActive,
                    a.ClientId,
                    a.CurrentBalance,
                    a.Client.Name)
                    )
                .FirstOrDefaultAsync();

            return acc is null ? NotFound() : Ok(acc);
        }

        [HttpPost]
        public async Task<ActionResult<AccountDto>> Create(CreateAccountDto dto)
        {
            var a = new Account
            {
                Number = dto.Number,
                Type = dto.Type,
                InitialBalance = dto.InitialBalance,
                CurrentBalance = dto.InitialBalance,
                ClientId = dto.ClientId,
                IsActive = true
            };
            _context.Accounts.Add(a);
            await _context.SaveChangesAsync();

            var dtoResponse = await _context.Accounts
                .Where(x => x.Id == a.Id)
                .Select(x => new AccountDto(
                    x.Id,
                    x.Number,
                    x.Type,
                    x.InitialBalance,
                    x.IsActive,
                    x.ClientId,
                    x.CurrentBalance,
                    x.Client.Name
                ))
                .FirstAsync();

            return CreatedAtAction(nameof(GetById), new { id = a.Id }, dtoResponse);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, UpdateAccountDto dto)
        {
            var acc = await _context.Accounts.FindAsync(id);
            if (acc is null) return NotFound();

            acc.Number = dto.Number;
            acc.Type = dto.Type;
            acc.InitialBalance = dto.InitialBalance;
            acc.IsActive = dto.IsActive;
            acc.ClientId = dto.ClientId;

            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var acc = await _context.Accounts.FindAsync(id);
            if (acc is null) return NotFound();
            _context.Accounts.Remove(acc);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}
