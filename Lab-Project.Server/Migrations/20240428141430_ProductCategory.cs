using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab_Project.Server.Migrations
{
    /// <inheritdoc />
    public partial class ProductCategory : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {

        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

            migrationBuilder.DropColumn(
                name: "CategoryName",
                table: "Products");

            migrationBuilder.AlterColumn<string>(
                name: "CategoryName",
                table: "Products",
                type: "nvarchar(450)",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "nvarchar(max)");

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryName",
                table: "Products",
                column: "CategoryName");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Category_CategoryName",
                table: "Products",
                column: "CategoryName",
                principalTable: "Category",
                principalColumn: "CategoryName",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
