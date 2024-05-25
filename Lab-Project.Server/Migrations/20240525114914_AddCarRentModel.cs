using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab_Project.Server.Migrations
{
    /// <inheritdoc />
    public partial class AddCarRentModel : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Model",
                table: "Cars");

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Cars",
                type: "decimal(5,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(6,2)");

            migrationBuilder.AddColumn<string>(
                name: "ModelName",
                table: "Cars",
                type: "nvarchar(450)",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "Models",
                columns: table => new
                {
                    ModelName = table.Column<string>(type: "nvarchar(450)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Models", x => x.ModelName);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Cars_ModelName",
                table: "Cars",
                column: "ModelName");

            migrationBuilder.AddForeignKey(
                name: "FK_Cars_Models_ModelName",
                table: "Cars",
                column: "ModelName",
                principalTable: "Models",
                principalColumn: "ModelName",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Cars_Models_ModelName",
                table: "Cars");

            migrationBuilder.DropTable(
                name: "Models");

            migrationBuilder.DropIndex(
                name: "IX_Cars_ModelName",
                table: "Cars");

            migrationBuilder.DropColumn(
                name: "ModelName",
                table: "Cars");

            migrationBuilder.AlterColumn<decimal>(
                name: "Price",
                table: "Cars",
                type: "decimal(6,2)",
                nullable: false,
                oldClrType: typeof(decimal),
                oldType: "decimal(5,2)");

            migrationBuilder.AddColumn<string>(
                name: "Model",
                table: "Cars",
                type: "nvarchar(max)",
                nullable: false,
                defaultValue: "");
        }
    }
}
