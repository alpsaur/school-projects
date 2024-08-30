using DOTNET_Shopping.Models;
using MySql.Data.MySqlClient;

namespace DOTNET_Shopping.Data
{
    public class AccountDAO
    {
        //Validate [username/password] and return userID 
        public static int Validate(string username, string password)
        {
            int userId = -1;
            using (MySqlConnection conn = new MySqlConnection(Constants.connection_String))
            {

                conn.Open();
                string sql = @$"SELECT UserId FROM user where Username='{username}' and Password='{password}'";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    userId = (int)reader["UserID"];
                }
            }
            return userId;
        }

        //Get user(firstName,LastName) by userId
        public static User GetUser(int? userId)
        {
            User u = null;
            if (userId == null)
            {
                return u;
            }
            using (MySqlConnection conn = new MySqlConnection(Constants.connection_String))
            {

                conn.Open();
                string sql = @$"SELECT * FROM user where UserID='{userId}'";
                MySqlCommand cmd = new MySqlCommand(sql, conn);
                MySqlDataReader reader = cmd.ExecuteReader();

                while (reader.Read())
                {
                    u = new User()
                    {
                        UserID = (int)reader["UserID"],
                        FirstName = (string)reader["Firstname"],
                        LastName = (string)reader["Lastname"]
                    };
                }
            }
            return u;
        }

        //Transfer Cart items in session to database when user is logging in
        public static void Transfer_CartinSession_toDB(Dictionary<int, int> productID_Qs, int userID)
        {
            if (productID_Qs == null)
            {
                return;
            }
            foreach (KeyValuePair<int, int> productID_Q in productID_Qs)
            {
                for (int i = 0; i < productID_Q.Value; i++)
                {
                    CartDAO.AddToCartDB(productID_Q.Key, userID);
                }
            }
        }
    }
}
