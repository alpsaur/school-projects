using DOTNET_Shopping.Models;
using MySql.Data.MySqlClient;

namespace DOTNET_Shopping.Data
{
    public class CartDAO
    {
        //Add one product into Cart database
        public static void AddToCartDB(int productID, int userID)
        {
            int q = 0;
            using (MySqlConnection conn = new MySqlConnection(Constants.connection_String))
            {
                conn.Open();
                string sql = @$"SELECT Quantity FROM Cart where UserID = {userID} AND ProductID={productID}";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    q = (int)reader["Quantity"];
                }
            }
            if (q == 0)
            {
                using (MySqlConnection conn = new MySqlConnection(Constants.connection_String))
                {
                    conn.Open();
                    string sql = @$"Insert into Cart(ProductID,UserID,Quantity) values ('{productID}','{userID}','1')";
                    MySqlCommand cmd = new MySqlCommand(sql, conn);
                    int noAffectedRows = cmd.ExecuteNonQuery();
                }
            }
            else
            {
                using (MySqlConnection conn = new MySqlConnection(Constants.connection_String))
                {
                    conn.Open();
                    string sql = @$"Update Cart Set Quantity = {q + 1} where UserID = {userID} AND ProductID={productID}";
                    MySqlCommand cmd = new MySqlCommand(sql, conn);
                    int noAffectedRows = cmd.ExecuteNonQuery();
                }
            }
            return;
        }

        //Get items from one user's cart
        public static List<CartItem> GetCartItems(int userId)
        {
            List<CartItem> cartItems = new List<CartItem>();

            string connectionString = Constants.connection_String;

            using (var conn = new MySqlConnection(connectionString))
            {
                conn.Open();

                string sql = @" SELECT ci.UserID, ci.ProductID, ci.Quantity, p.ProductName, p.Description, p.UnitPrice, p.ImageName
                                FROM cart ci
                                JOIN product p ON ci.ProductID = p.ProductID
                                WHERE ci.UserID = @UserId";

                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@UserID", userId);

                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {

                    CartItem item = new CartItem
                    {
                        UserId = (int)reader["UserID"],
                        ProductID = (int)reader["ProductID"],
                        Quantity = (int)reader["Quantity"],
                        Product = new Product
                        {
                            ProductID = (int)reader["ProductID"],
                            ProductName = (string)reader["ProductName"],
                            Description = (string)reader["Description"],
                            UnitPrice = (decimal)reader["UnitPrice"],
                            ImageName = (string)reader["ImageName"]
                        }
                    };
                    cartItems.Add(item);
                }
                conn.Close();
            }

            return cartItems;
        }

        public static List<string> CheckInventory()
        {
            //first, assume it is enough;

            List<string> soldout = new List<string>();

            //connect to the database
            string connectionString = Constants.connection_String;
            using (var conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                //获取库存信息
                //get the inventory information
                string sql = @"select ProductName,stock.ProductID,count(ActivationCode) as Quantity from stock,product
                                where IsSold=0 and stock.ProductID=product.ProductID
                                group by stock.ProductID,ProductName";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                //create a list, which has the product with productid and number
                List<ProductQuantity> pqlist = new List<ProductQuantity>();
                while (reader.Read())
                {
                    ProductQuantity pq = new ProductQuantity()
                    {
                        ProductName = (string)reader["ProductName"],
                        ProductID = (int)reader["ProductID"],
                        Quantity = (long)reader["Quantity"]
                    };
                    pqlist.Add(pq);

                }
                reader.Close();
                //新建一个reader读取所有的信息pq，遍历数组的时候
                //cart清空的时候记得选userid 已完成
                //寻找全部没货的东西


                string sqlforall = @"select ProductName,stock.ProductID,count(ActivationCode) as Quantity from stock,product
                                where stock.ProductID=product.ProductID
                                group by ProductName,stock.ProductID";
                MySqlCommand cmd5 = new MySqlCommand(sqlforall, conn);
                reader = cmd5.ExecuteReader();
                List<ProductQuantity> pqalllist = new List<ProductQuantity>();
                while (reader.Read())
                {
                    ProductQuantity pq = new ProductQuantity()
                    {
                        ProductName = (string)reader["ProductName"],
                        ProductID = (int)reader["ProductID"],
                        Quantity = (long)reader["Quantity"]
                    };
                    pqalllist.Add(pq);

                }
                //进行两个列表的比较并设置
                //搞个方法，用来查询是否存在
                for (int i = 0; i < pqalllist.Count; i++)
                {
                    //方法：
                    if (!CheckIfExist(pqalllist[i].ProductID, pqlist))
                    {
                        pqlist.Add(pqalllist[i]);
                        pqlist[pqlist.Count - 1].Quantity = 0;
                    }
                }

                reader.Close();
                //获取购物车商品信息：
                //get the product in the cart
                string cartsql = @"select ProductID,Quantity from cart";
                MySqlCommand cmd2 = new MySqlCommand(cartsql, conn);
                //create a list to collect them
                List<CartItem> cartitemlistforcheck = new List<CartItem>();
                reader = cmd2.ExecuteReader();
                while (reader.Read())
                {
                    CartItem cartitemforcheck = new CartItem()
                    {
                        ProductID = (int)reader["ProductID"],
                        Quantity = (int)reader["Quantity"]
                    };
                    cartitemlistforcheck.Add(cartitemforcheck);
                }
                conn.Close();


                //如果购物车里面没有东西，则直接返回：
                if (cartitemlistforcheck.Count == 0)
                {
                    List<string> nulllist = new List<string>();
                    nulllist.Add("Null");
                    return nulllist;
                }
                //进行库存比较：
                //use for loop to check if enough, once it is not enough, set res false and break

                for (int i = 0; i < pqlist.Count; i++)
                {
                    for (int j = 0; j < cartitemlistforcheck.Count; j++)
                    {
                        if (pqlist[i].ProductID == cartitemlistforcheck[j].ProductID)
                        {
                            if (pqlist[i].Quantity < cartitemlistforcheck[j].Quantity)
                            {
                                //不够库存的商品加入到缺货list中
                                soldout.Add(pqlist[i].ProductName);
                            }
                        }
                    }

                }
            }
            return soldout;
        }
        public static bool CheckIfExist(int ProductID, List<ProductQuantity> pqlist)
        {
            bool res = false;
            for (int i = 0; i < pqlist.Count; i++)
            {
                if (ProductID == pqlist[i].ProductID)
                {
                    res = true;
                    break;
                }
            }
            return res;
        }
        public static void AddNewOrder(int userId)
        {
            //connect to the database
            string connectionString = Constants.connection_String;

            using (var conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                string sql = @"select UserID, ProductID,Quantity from cart";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@UserID", userId);

                //set a list to get the product in the cart
                List<CartItem> cartitemlist = new List<CartItem>();
                MySqlDataReader reader = cmd.ExecuteReader();
                while (reader.Read())
                {
                    CartItem cartitem = new CartItem()
                    {
                        UserId = (int)reader["UserID"],
                        ProductID = (int)reader["ProductID"],
                        Quantity = (int)reader["Quantity"]
                    };
                    cartitemlist.Add(cartitem);
                }
                reader.Close();

                //对orders表插入数据行
                //insert data into the orders table
                //get the date first

                DateTime today = DateTime.Today;
                string mysqlDateFormat = today.ToString("yyyy-MM-dd");

                //insert data into the orders table
                string insertsql = @"insert into orders (UserID,PurchaseDate)
                                    values(" + cartitemlist[0].UserId + ",'" + mysqlDateFormat + "')";
                MySqlCommand cmd1 = new MySqlCommand(insertsql, conn);
                cmd1.ExecuteNonQuery();

                //获取当前的orderid
                //get the orderid which is now using
                string orderidsql = @"select Max(OrderID) as orderid from orders";
                MySqlCommand cmd2 = new MySqlCommand(orderidsql, conn);
                reader = cmd2.ExecuteReader();
                int orderid = 0;
                while (reader.Read())
                {
                    orderid = (int)reader["orderid"];
                }
                reader.Close();

                //对orderdetails表进行插入（有orderid 和productid列和code列)
                //insert data into the orderdetails table, which need orderid, productid and code
                //use for loop to get the valid code
                for (int i = 0; i < cartitemlist.Count; i++)
                {


                    for (int j = 0; j < cartitemlist[i].Quantity; j++)
                    {
                        //查询当前producid激活码并状态为false的
                        //Query the current producid activation code and the status is false
                        string selectcodesql = @"select ActivationCode from stock
                                                where IsSold = 0 and ProductID=" +
                                                cartitemlist[i].ProductID;
                        MySqlCommand cmd3 = new MySqlCommand(selectcodesql, conn);
                        reader = cmd3.ExecuteReader();
                        string code = "";
                        while (reader.Read())
                        {
                            code = (string)reader["ActivationCode"];
                        }
                        reader.Close();

                        //更新变成true
                        //update it,let the IsSold to be true
                        string updatecodesql = @"update stock set IsSold = 1
                                                where ActivationCode = '" + code + "'";
                        MySqlCommand cmd4 = new MySqlCommand(updatecodesql, conn);
                        cmd4.ExecuteNonQuery();

                        //insert into the orderdetails,now we have orderid,productid,and code
                        string insertsqlop = @"insert into orderdetail(OrderID,ProductID,ActivationCode) values(" +
                            orderid + "," + cartitemlist[i].ProductID + ",'" + code + "')";
                        MySqlCommand cmd5 = new MySqlCommand(insertsqlop, conn);
                        cmd5.ExecuteNonQuery();
                    }
                }


                conn.Close();

            }
        }

        public static void RemoveCartItems(int userId)
        {
            //connect to the db
            string connectionString = Constants.connection_String;

            using (var conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                string sql = @"delete from cart where userid = " + userId;
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                cmd.ExecuteNonQuery();
                conn.Close();
            }

        }

        public static void UpdateCartQuantity(int userId, int productId, int quantity)
        {
            string connectionString = Constants.connection_String;
            using (var conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                var sql = "UPDATE cart SET Quantity = @Quantity WHERE UserID = @UserId AND ProductID = @ProductID";
                var cmd = new MySqlCommand(sql, conn);
                cmd.Parameters.AddWithValue("@Quantity", quantity);
                cmd.Parameters.AddWithValue("@UserId", userId);
                cmd.Parameters.AddWithValue("@ProductID", productId);
                cmd.ExecuteNonQuery();
            }
        }

        public static void RemoveSingleProduct(int userId,int productId)
        {
            //connect to the db
            string connectionString = Constants.connection_String;

            using (var conn = new MySqlConnection(connectionString))
            {
                conn.Open();
                string sql = "DELETE FROM cart WHERE UserID = @userId AND ProductID = @productId";

                MySqlCommand cmd = new MySqlCommand(sql, conn);
                   
                    cmd.Parameters.AddWithValue("@userId", userId);
                    cmd.Parameters.AddWithValue("@productID", productId);
                    cmd.ExecuteNonQuery();

                conn.Close();

            }

        }
    }
}
