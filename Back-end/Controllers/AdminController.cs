using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mondacom2.Model;
using Mondacom2.Mycontext;

namespace Mondaycom2.Controllers
{
    [Authorize(Roles ="Admin")]
    [Route("api/[controller]")]
    [ApiController]
    public class AdminController : ControllerBase
    {
        private readonly Data _data;
        public AdminController(Data data)
        {
            _data = data;
        }
        //lấy hết user

        [HttpGet("Getalluser"), Authorize(Roles ="Admin")]
        public async Task<IActionResult> GetallUser()
        {

            var a = await _data.Users.ToListAsync();
            if (a.Count > 0)
            {
                return Ok(a);
            }
            return NotFound(new
            {
                message = "dont have user yet"
            });

        }
        [HttpDelete("delUser/{id}")]
        public async Task<IActionResult> DelUser(int id)
        {
            var userId = await _data.Users.FindAsync(id);
            if (userId == null)
            {
                return BadRequest();
            }
            _data.Users.Remove(userId);
          
            await _data.SaveChangesAsync();
            return Ok();
        }
    }
}
