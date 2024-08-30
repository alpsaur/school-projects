﻿namespace DOTNET_Shopping.Models
{
    public class Product
    {
        public int ProductID { get; set; }
        public string? ProductName { get; set; }
        public string? Description { get; set; }
        public decimal UnitPrice { get; set; }
        public string? ImageName { get; set; }
    }
}
