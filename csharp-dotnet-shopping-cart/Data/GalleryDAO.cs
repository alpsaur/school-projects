using DOTNET_Shopping.Models;
using MySql.Data.MySqlClient;

namespace DOTNET_Shopping.Data
{
    public class GalleryDAO
    {
        //To get part of products by searchStr from allProdcuts List 
        public static List<Product> GetProductsByStr(string? searchStr)
        {
            List<Product> allProducts = GetAllProducts();
            if (searchStr == null)
            {
                return allProducts;
            }

            List<Product> products = new List<Product>();
            foreach (Product p in allProducts)
            {
                if (p.ProductName.ToLower().Contains(searchStr.ToLower()) ||
                    p.Description.ToLower().Contains(searchStr.ToLower()))
                {
                    products.Add(p);
                }
            }
            return products;
        }

        //(Helper method) to get all products 
        private static List<Product> GetAllProducts()
        {
            List<Product> products = new List<Product>(); ;

            using (MySqlConnection conn = new MySqlConnection(Constants.connection_String))
            {
                conn.Open();
                string sql = @"SELECT * FROM product";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    Product p = new Product()
                    {
                        ProductID = (int)reader["ProductID"],
                        ProductName = (string)reader["ProductName"],
                        Description = (string)reader["Description"],
                        UnitPrice = (decimal)reader["UnitPrice"],
                        ImageName = (string)reader["ImageName"]
                    };
                    products.Add(p);
                }
                return products;
            }
        }
    }
}
