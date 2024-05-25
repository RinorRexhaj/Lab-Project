using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab_Project.Server.Migrations
{
    /// <inheritdoc />
    public partial class RefreshChanges : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            
            migrationBuilder.CreateTable(
                name: "RefreshTokens",
                columns: table => new
                {
                    ClientId = table.Column<int>(type: "int", nullable: false),
                    Expires = table.Column<DateTime>(type: "datetime2", nullable: false),
                    Token = table.Column<Guid>(type: "uniqueidentifier", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RefreshTokens", x => x.ClientId);
                    table.ForeignKey(
                        name: "FK_RefreshTokens_Clients_ClientId",
                        column: x => x.ClientId,
                        principalTable: "Clients",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_RefreshTokens_ClientId",
                table: "RefreshTokens",
                column: "ClientId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "RefreshTokens");
        }
    }
}
