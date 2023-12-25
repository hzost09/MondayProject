
using Microsoft.EntityFrameworkCore;
using Mondacom2.Model;
using Mondaycom2.Model;

namespace Mondacom2.Mycontext
{
    public class Data : DbContext
    {
        public Data(DbContextOptions<Data> options):base(options)
        {
            
        }
        public DbSet<User> Users { get; set; }
        public DbSet<TableInfors> Table1 { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<User>()
                .HasMany(e => e.table)
                .WithOne(e => e.user)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
               
        }
    }

}
