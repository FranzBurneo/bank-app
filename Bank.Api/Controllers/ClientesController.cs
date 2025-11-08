using Bank.Domain.Entities;
using Bank.Infrastructure.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Bank.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ClientesController : ControllerBase
    {
        private readonly BankDbContext _context;

        public ClientesController(BankDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Client>>> GetAll()
            => await _context.Clients.AsNoTracking().ToListAsync();

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Client>> GetById(Guid id)
        {
            var client = await _context.Clients.FindAsync(id);
            return client is null ? NotFound() : client;
        }

        [HttpPost]
        public async Task<ActionResult<Client>> Create(Client client)
        {
            _context.Clients.Add(client);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = client.Id }, client);
        }

        [HttpPut("{id:guid}")]
        public async Task<IActionResult> Update(Guid id, Client updated)
        {
            if (id != updated.Id) return BadRequest();
            _context.Entry(updated).State = EntityState.Modified;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        [HttpDelete("{id:guid}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var client = await _context.Clients.FindAsync(id);
            if (client is null) return NotFound();
            _context.Clients.Remove(client);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}