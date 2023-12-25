using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel;
using Mondaycom2.Model;

namespace Mondacom2.Model
{
    public class User
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int UserId { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }
        public string Email { get; set; }
        public string? Role { get; set; }
        //refresh
        public string? RefreshToken { get; set; }
        public DateTime? RCreatAt { get; set; }
        public DateTime? RExpireAt { get; set; }
        // table
        public List<TableInfors>? table { get; set; }

        //email
        public string? tokenResetPassword { get; set; }
        public DateTime? ResetExpire { get; set; }
    }
}
