using Bank.Api.DTOs;
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
        public async Task<ActionResult<IEnumerable<ClientDto>>> GetAll() =>
            await _context.Clients.AsNoTracking()
              .Select(c => new ClientDto(c.Id, c.Name, c.Gender, c.Age, c.Identification, c.Address, c.Phone, c.ClientCode, c.IsActive))
              .ToListAsync();

        [HttpGet("{id:guid}")]
        public async Task<ActionResult<Client>> GetById(Guid id)
        {
            var client = await _context.Clients.FindAsync(id);
            return client is null ? NotFound() : client;
        }

        [HttpPost]
        public async Task<ActionResult<ClientDto>> Create(CreateClientDto dto)
        {
            var c = new Client
            {
                Name = dto.Name,
                Gender = dto.Gender,
                Age = dto.Age,
                Identification = dto.Identification,
                Address = dto.Address,
                Phone = dto.Phone,
                ClientCode = dto.ClientCode,
                Password = dto.Password,
                IsActive = true
            };
            _context.Clients.Add(c);
            await _context.SaveChangesAsync();
            return CreatedAtAction(nameof(GetById), new { id = c.Id },
                new ClientDto(c.Id, c.Name, c.Gender, c.Age, c.Identification, c.Address, c.Phone, c.ClientCode, c.IsActive));
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