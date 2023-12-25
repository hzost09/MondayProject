using Mondacom2.Model;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Mondaycom2.Model
{
    public class TableInfors
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string? Task { get; set; }
        public string? Status { get; set; }
        public DateTime? Datebegin { get; set; }
        public DateTime? DateEnd { get; set;}
        public string? Note { get; set; }
        [JsonIgnore]
        public User? user { get; set; }
        public int? UserId { get; set; }
        public int? SoTT { get; set; }
    }
}
