using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Client;
using Microsoft.IdentityModel.Tokens;
using Mondacom2.Model;
using Mondacom2.Mycontext;
using Mondaycom2.helper;
using Mondaycom2.Model;
using System.IdentityModel.Tokens.Jwt;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using System.Text.Json.Serialization;

namespace Mondacom2.Controllers
{
   
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
    
        private readonly Data _data;
        private readonly IsendEmailReset _send;
        public UserController(Data data,IsendEmailReset send)
        {
            _data = data;
            _send = send;
        }

        // biến password người nhận thành hash
        private string HashPassWord(string password)
        {
            using (var sha256 = SHA256.Create())
            {
                var hashbyte = sha256.ComputeHash(Encoding.UTF8.GetBytes(password));
                return BitConverter.ToString(hashbyte);
            }
        }
        //đăng ký 
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] User user)
        {
            var indataPassword = await _data.Users.AnyAsync(x => x.UserName == user.UserName);
            var indataEmail = await _data.Users.AnyAsync(x => x.Email == user.Email); 
            if (indataPassword is false && indataEmail is false)
            {
                user.Password = HashPassWord(user.Password);
                user.Role = "User";
                await _data.AddAsync(user);
                await _data.SaveChangesAsync();
                return Ok();
            }
            else
            {
                return BadRequest(new { message = "Username hoặc email đã tồn tại" });
            }

        }

        //đăng nhập
        [HttpPost("login")]
        public async Task<IActionResult> loginPage(User user)
        {          
            var b = await _data.Users.FirstOrDefaultAsync(x => x.UserName == user.UserName);
            var password = user.Password;
            var c = HashPassWord(password);
            if ( b != null && b.Password == c)
            {
                var token = CreateToken(user);

                var refreshtoken = createRrefreshtoken();
                var d = _data.Users.FirstOrDefault(r => r.UserName == user.UserName);
                if (d != null)
                {                   
                    d.RefreshToken = refreshtoken.refreshToken;
                    d.RCreatAt = refreshtoken.Created;
                    d.RExpireAt = refreshtoken.ExpireDate;
                }
                await _data.SaveChangesAsync();
                return Ok(
                    new
                    {
                        //client,
                        //role = userrole ,
                        Token = token,
                        RToken = refreshtoken.refreshToken,                   
                    });
            }
            return NotFound(new
            {
                message = "tên đăng nhập hoặc mật khẩu không đúng"
            });
        }
       

        //jwt token và refresh token

        //P1: tạo token 
        private string CreateToken(User user)
        {
            // JwtSecurityTokenHandler => cho phép thao tác với token(tạo - gọi method - xác thực)
            var jwtHandeler = new JwtSecurityTokenHandler();
            // tạo key
            var key = Encoding.ASCII.GetBytes("my16charSecretKey");
            // tạo playload chứa name và role
            var a = _data.Users.Where(x => x.UserName == user.UserName).Select(x => x.Role).FirstOrDefault().ToString();
            var identity = new ClaimsIdentity(new Claim[]
            {
                new Claim(ClaimTypes.Role,a),
                new Claim(ClaimTypes.Name,$"{user.UserName}")
            });
            //tạo chữ ký 
            var cerdential = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256);
            // 
            var des = new SecurityTokenDescriptor
            {
                Subject = identity,
                Expires = DateTime.Now.AddSeconds(40),
                SigningCredentials = cerdential
            };
            var token = jwtHandeler.CreateToken(des);


            return jwtHandeler.WriteToken(token);

        }

        //P2:tạo refresh token
        private RefreshToken createRrefreshtoken()
        {
            var refreshtoken = new RefreshToken
            {
                refreshToken = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
                Created = DateTime.Now,
                ExpireDate = DateTime.Now.AddSeconds(700000),
            };    
            return refreshtoken;
        }

        //P3 trich xuat data từ token cũ gửi về  
        private string dataFormToken(string token)
        {
            var jwt = new JwtSecurityTokenHandler();
            var readjwt = jwt.ReadJwtToken(token);
            var claimName = readjwt.Claims;
           foreach(var item in claimName)
            {
                if (item.Type == "unique_name")
                {
                    return item.Value;
                }
            }
            return "";
        }
        //  
   


        //P4 kiểm tra token có thể sử dụng đc hay ko 
        [HttpPost("checktoken")]
        public async Task<IActionResult> ChecktokenFromClient(RefreshToken token)
        {
            string access = token.AccessToken;
            string refresh = token.refreshToken;
            var name = dataFormToken(access);
            var username =  _data.Users.FirstOrDefault(x => x.UserName == name);
            if (username == null || username.RExpireAt <= DateTime.Now || username.RefreshToken != refresh)
            {
                return BadRequest("invalid token");
            }          
                var newToken = CreateToken(username);
                var newRefresh = createRrefreshtoken();
                username.RExpireAt = newRefresh.ExpireDate;
                username.RefreshToken = newRefresh.refreshToken;
               await _data.SaveChangesAsync();
            return Ok(new RefreshToken()
            {
                AccessToken = newToken,
                refreshToken = username.RefreshToken,
            }) ;
        }


        //email
        //linkEmail
        [HttpPost("sendLink")]
        public async Task<IActionResult> sendlink()
        {
            using var email = new StreamReader(Request.Body, Encoding.UTF8);
            var body = await email.ReadToEndAsync();
           
            var checkuser = _data.Users.FirstOrDefault(x => x.Email == body);
            if(checkuser == null)
            {
                return NotFound();
            }
            var tokenByte = RandomNumberGenerator.GetBytes(64);
            var emailToken = Convert.ToBase64String(tokenByte);
            checkuser.tokenResetPassword = emailToken;
            checkuser.ResetExpire = DateTime.Now.AddMinutes(15);
            var emailmodel = new EmailModel(body, "reset password", EmailBodycs.EmailStringBody(body,emailToken));
             _send.sendMail(emailmodel);
            _data.Entry(checkuser).State = EntityState.Modified;
            await _data.SaveChangesAsync();
            return Ok(new
            {
                StatusCode = 200,
                Message = "Email is sending"
            }
                );
        }


        // reset password
        [HttpPost("resetPassword")]
        public async Task<IActionResult> resetpassword(ResetPasswordModel model)
        {
            if (model.ConfirmPassWord == null || model.PasswordReset == null || model.EmailToken == null || model.Email == null)
            {
                return BadRequest(new
                {
                    message = "yêu cầu nhập đầy đủ password và confirmPassword"
                });
            }
            var newToken = model.EmailToken.Replace(" ", "+");
            var checkEmail = _data.Users.FirstOrDefault(x => x.Email == model.Email);
            var checktoken = _data.Users.Select(x => x.tokenResetPassword).FirstOrDefaultAsync();
            if (checktoken == null || checkEmail == null || checkEmail.ResetExpire < DateTime.Now || model.PasswordReset != model.ConfirmPassWord || newToken != checkEmail.tokenResetPassword)
            {
                return BadRequest(new
                {
                    mess = "link đã hết hạn"
                });
            }
            else
            {
                string newpass = model.PasswordReset.ToString();
                checkEmail.Password = HashPassWord(newpass);

                _data.Entry(checkEmail).State = EntityState.Modified;
                await _data.SaveChangesAsync();
                return Ok(checkEmail);
            }
            
        }
    }
}
