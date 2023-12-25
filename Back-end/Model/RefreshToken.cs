using Mondacom2.Model;
using System.ComponentModel.DataAnnotations;

namespace Mondaycom2.Model
{
    public class RefreshToken
    {
        public string AccessToken { get; set; }
        public string refreshToken { get; set;}
        public DateTime? Created { get; set; } = DateTime.Now;
        public DateTime? ExpireDate { get; set; }
    }
}
