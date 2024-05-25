using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab_Project.Server.Migrations
{
    /// <inheritdoc />
    public partial class PCFix : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
                    }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CategoryName1",
                table: "Products",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Category",
                columns: table => new
                {
                    CategoryName = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Category", x => x.CategoryName);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Products_CategoryName1",
                table: "Products",
                column: "CategoryName1");

            migrationBuilder.AddForeignKey(
                name: "FK_Products_Category_CategoryName1",
                table: "Products",
                column: "CategoryName1",
                principalTable: "Category",
                principalColumn: "CategoryName",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
