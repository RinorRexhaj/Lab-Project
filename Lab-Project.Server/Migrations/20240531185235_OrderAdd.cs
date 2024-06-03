using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Lab_Project.Server.Migrations
{
    /// <inheritdoc />
    public partial class OrderAdd : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
    name: "Orders",
    columns: table => new
    {
        OrderID = table.Column<int>(type: "int", nullable: false)
            .Annotation("SqlServer:Identity", "100, 1"),
        SetDate = table.Column<DateTime>(type: "datetime2", nullable: false),
        ArrivalDate = table.Column<DateTime>(type: "datetime2", nullable: false),
        ClientID = table.Column<int>(type: "int", nullable: false)
    },
    constraints: table =>
    {
        table.PrimaryKey("PK_Orders", x => x.OrderID);
        table.ForeignKey(
            name: "FK_Orders_Clients_ClientID",
            column: x => x.ClientID,
            principalTable: "Clients",
            principalColumn: "Id",
            onDelete: ReferentialAction.Cascade);
    });

            migrationBuilder.CreateTable(
                name: "OrderDetails",
                columns: table => new
                {
                    OrderID = table.Column<int>(type: "int", nullable: false),
                    ProductID = table.Column<int>(type: "int", nullable: false),
                    Quantity = table.Column<int>(type: "int", nullable: false),
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_OrderDetails", x => new { x.OrderID, x.ProductID });
                    table.ForeignKey(
                        name: "FK_OrderDetails_Orders_OrderID",
                        column: x => x.OrderID,
                        principalTable: "Orders",
                        principalColumn: "OrderID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_OrderDetails_Products_ProductID",
                        column: x => x.ProductID,
                        principalTable: "Products",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_OrderID",
                table: "OrderDetails",
                column: "OrderID");

            migrationBuilder.CreateIndex(
                name: "IX_OrderDetails_ProductID",
                table: "OrderDetails",
                column: "ProductID");

            migrationBuilder.CreateIndex(
                name: "IX_Orders_ClientID",
                table: "Orders",
                column: "ClientID");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {

        }
    }
}
