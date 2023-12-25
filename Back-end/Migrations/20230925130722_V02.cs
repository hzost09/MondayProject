using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mondaycom2.Migrations
{
    /// <inheritdoc />
    public partial class V02 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Table1_Users_UserId",
                table: "Table1");

            migrationBuilder.AddForeignKey(
                name: "FK_Table1_Users_UserId",
                table: "Table1",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Table1_Users_UserId",
                table: "Table1");

            migrationBuilder.AddForeignKey(
                name: "FK_Table1_Users_UserId",
                table: "Table1",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "UserId");
        }
    }
}
