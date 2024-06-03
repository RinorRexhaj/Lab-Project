using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab_Project.Server.Migrations
{
    /// <inheritdoc />
    public partial class NotificationsAdmins : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "NotificationAdmins",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    NotificationId = table.Column<int>(type: "int", nullable: false),
                    AdminId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_NotificationAdmins", x => x.Id);
                    table.ForeignKey(
                        name: "FK_NotificationAdmins_Clients_AdminId",
                        column: x => x.AdminId,
                        principalTable: "Clients",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_NotificationAdmins_Notifications_NotificationId",
                        column: x => x.NotificationId,
                        principalTable: "Notifications",
                        principalColumn: "Id");
                });

            migrationBuilder.CreateIndex(
                name: "IX_NotificationAdmins_AdminId",
                table: "NotificationAdmins",
                column: "AdminId");

            migrationBuilder.CreateIndex(
                name: "IX_NotificationAdmins_NotificationId",
                table: "NotificationAdmins",
                column: "NotificationId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "NotificationAdmins");
        }
    }
}
