namespace DOTNET_Shopping.Models
{
    public class ProductQuantity
    {
        //this class is to check if the inventory is enough
        public string? ProductName { get; set; }
        public int ProductID { get; set; }
        public long Quantity { get; set; }
    }
}
