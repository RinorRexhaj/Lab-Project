using System;

namespace Lab_Project.Server.Models
{
    public class ReservationLog
    {
        public int Id { get; set; }
        public string RestaurantName { get; set; }
        public string UserName { get; set; }
        public string UserEmail { get; set; }
        public DateTime ReservationDateTime { get; set; }
    }
}