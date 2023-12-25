using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Mondaycom2.Migrations
{
    /// <inheritdoc />
    public partial class V03 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "ResetExpire",
                table: "Users",
                type: "datetime2",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "tokenResetPassword",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "ResetExpire",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "tokenResetPassword",
                table: "Users");
        }
    }
}
