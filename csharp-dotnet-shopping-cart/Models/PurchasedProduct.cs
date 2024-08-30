namespace DOTNET_Shopping.Models
{
    public class PurchasedProduct
    {
        public int ProductID { get; set; }
        public int OrderID { get; set; }
        public int UserID { get; set; }
        public string? ProductName { get; set; }
        public string? ProductDescription { get; set; }
        public string? ProductImage { get; set; }

        public string? ActivationCode { get; set; }

        public string? PurchaseDate { get; set; }
    }
}
