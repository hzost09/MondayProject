using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Mondacom2.Model;
using Mondacom2.Mycontext;
using Mondaycom2.Model;
using Newtonsoft.Json;
using System.Text.Json;

using System.IdentityModel.Tokens.Jwt;
using Microsoft.AspNetCore.SignalR;
using System.Linq;

namespace Mondaycom2.Controllers
{
    //[ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]

    [Route("api/[controller]")]
    [ApiController]
    public class TableController : ControllerBase
    {
    
        private readonly Data _data;
        public TableController(Data data)
        {
     
            _data = data;
        
        }

        //check task time and send noti

        //[HttpGet("checkmessage/{username}")]
    
        //public async Task<IActionResult> Index(string username)
        //{
        //    var list = new List<string>();
        //    var listtable = new List<TableInfors>();
        //    var takeUser = await _data.Users.FirstOrDefaultAsync(x => x.UserName == username);
        //    var takeTable =  _data.Table1.Where(x => x.UserId == takeUser.UserId).ToList();
        //    foreach (var item in takeTable)
        //    {
        //        if(item.DateEnd <= DateTime.Now && item.Status != "done")
        //        {
        //            string a = item.Task +" "+"đã tới hạn";
        //            list.Add(a);
        //            listtable.Add(item);
                  
        //        }
          
        //    }
        //    var jsona = JsonConvert.SerializeObject(list);
        //    var jsonob = JsonConvert.SerializeObject(listtable);
        //    return Ok(new
        //    {
        //        oblist = jsonob
        //    }) ;
        //}

 

        //Getall
        [Authorize(Roles = "User")]
        [HttpGet("Getdata/{username}")]
        public async Task<IActionResult> getAll(string username)
        {
            var namecheck = await _data.Users.FirstOrDefaultAsync(x => x.UserName == username);
            
            var checkId= await _data.Table1.FirstOrDefaultAsync(x => x.UserId == namecheck.UserId);
            if (checkId == null || namecheck == null)
            {
                return Ok(new string[] {}) ;
            }
            var testlinq = from onetable in _data.Table1
                           join oneUser in _data.Users 
                           on onetable.UserId equals oneUser.UserId
                           where username == oneUser.UserName && checkId.UserId == namecheck.UserId
                           select new { onetable.Task, onetable.Status, onetable.Datebegin, onetable.DateEnd, onetable.Note ,onetable.SoTT ,onetable.Id};
            if(!testlinq.Any())
            {
                return Ok();
            }

            var json = JsonConvert.SerializeObject(testlinq);
            return Ok(json);
            //return Ok(testlinq);
        }
        
        //create
        [Authorize(Roles = "User")]
        [HttpPost("Create/{username}")]
        public async Task<IActionResult> Create(TableInfors table, string username)
        {
            var checkUsername = await _data.Users.FirstOrDefaultAsync(x => x.UserName == username);
            table.UserId = checkUsername.UserId;
            await _data.AddAsync(table);
            await _data.SaveChangesAsync();
            return Ok(table);
            // phải kiểm tra soTT không được trùng nếu trùng thì random lại rồi kiểm tra tiếp
        }

        //update
        [Authorize(Roles ="User")]
        [HttpPut("update/{username}")]
       public async Task<IActionResult> Update(TableInfors table,string username)
        {
            var checkSoTT = await _data.Table1.FirstOrDefaultAsync(x => x.SoTT == table.SoTT);
           var checkUsername = await _data.Users.FirstOrDefaultAsync(x => x.UserName == username);
            table.UserId = checkUsername.UserId;
            var tabledata = await _data.Table1.FirstOrDefaultAsync(x => x.UserId == table.UserId && x.SoTT == table.SoTT);
             
             if (tabledata == null && checkSoTT == null)
            {
                return BadRequest();
            }
            tabledata.Task = table.Task;
            tabledata.Status = table.Status;
            tabledata.Datebegin = table.Datebegin;
            tabledata.DateEnd = table.DateEnd;
            tabledata.Note = table.Note;
            await _data.SaveChangesAsync();
            return Ok();
        }

        //delete
        [Authorize(Roles = "User")]
        [HttpDelete("delTable/{username}/{id}")]
        public async Task<IActionResult> deltable(int id)
        {
            var checkId = await _data.Table1.FindAsync(id);
            if (checkId != null)
            {
                _data.Table1.Remove(checkId);
                await _data.SaveChangesAsync();
            }
            return NotFound();
        }

        //đổi tên và email
        [Authorize(Roles ="User")]
        [HttpPut("NewNameAndEmail/{UserName}")]
        public async Task<IActionResult> NewEmailandName(string UserName,[FromBody]ChangeNameEmail user)
        {
            var takeUser = _data.Users.FirstOrDefault(x => x.UserName == UserName);
            var checkUserName = await _data.Users.AnyAsync(x => x.UserName == user.UserName);
            if (takeUser == null || checkUserName is true) {
                return NotFound(new
                {
                    message = "không thể đặt trùng tên hoặc tên rỗng"
                });
            }
            else
            {
                takeUser.UserName = user.UserName;
                takeUser.Email = user.Email;
                _data.Entry(takeUser).State = EntityState.Modified;
                await  _data.SaveChangesAsync();
            }
            return Ok(new
            {
                message = "change success"
            });
        }
    }
}
