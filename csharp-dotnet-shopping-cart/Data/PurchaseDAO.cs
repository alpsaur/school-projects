using DOTNET_Shopping.Models;
using MySql.Data.MySqlClient;

namespace DOTNET_Shopping.Data
{
    public class PurchaseDAO
    {
        public static List<PurchasedProduct> GetPurchasedProducts(int userId)
        {

            List<PurchasedProduct> purchasedProducts = new List<PurchasedProduct>();

            string connectionString = Constants.connection_String;

            using (var conn = new MySqlConnection(connectionString))
            {
                conn.Open();

                string sql = @"SELECT o.OrderID,o.PurchaseDate,o.UserID,od.ProductID,od.ActivationCode,p.ProductName,p.Description,P.ImageName
                                FROM orders o
                                JOIN orderDetail od ON o.OrderID = od.OrderID
                                JOIN product p ON p.ProductID = od.ProductID
                                WHERE o.UserID = @UserID";

                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@UserID", userId);

                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    PurchasedProduct pd = new PurchasedProduct()
                    {
                        UserID = (int)reader["UserID"],
                        OrderID = (int)reader["OrderID"],
                        ProductID = (int)reader["ProductID"],
                        ProductName = (string)reader["ProductName"],
                        ProductDescription = (string)reader["Description"],
                        ProductImage = (string)reader["ImageName"],
                        PurchaseDate = ((DateTime)reader["PurchaseDate"]).ToString("d MMMM yyyy"),
                        ActivationCode = (string)reader["ActivationCode"]
                    };
                    purchasedProducts.Add(pd);
                }
                conn.Close();

            }

            return purchasedProducts;
        }
    }
}
