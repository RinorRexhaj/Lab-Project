using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab_Project.Server.Migrations
{
    /// <inheritdoc />
    public partial class OrderDrop : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable("OrderDetails");
            migrationBuilder.DropTable("Orders");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
