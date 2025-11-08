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
        public async Task<ActionResult<IEnumerable<Account>>> GetAll()
            => await _context.Accounts.Include(a => a.Client).ToListAsync();

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Account>> GetById(Guid id)
        {
            var acc = await _context.Accounts.Include(a => a.Client)
                                             .FirstOrDefaultAsync(a => a.Id == id);
            return acc is null ? NotFound() : acc;
        }

        [HttpPost]
        public async Task<ActionResult<Account>> Create(Account acc)
        {
            _context.Accounts.Add(acc);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = acc.Id }, acc);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, Account acc)
        {
            if (id != acc.Id) return BadRequest();
            _context.Entry(acc).State = EntityState.Modified;
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
