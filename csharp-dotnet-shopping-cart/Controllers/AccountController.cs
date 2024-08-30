using DOTNET_Shopping.Data;
using DOTNET_Shopping.Models;
using Microsoft.AspNetCore.Mvc;

namespace DOTNET_Shopping.Controllers
{
    public class AccountController : Controller
    {
        //default action when opening the application
        public IActionResult Login(string username, string password)
        {
            //ask session for userID 
            ISession sessionObj = HttpContext.Session;
            int? userIDinSession = sessionObj.GetInt32("userID");

            //Redirect to Gallery Page when the user has logged in
            if (userIDinSession !=0 && userIDinSession != null)
            {
                return RedirectToAction("Gallery", "Gallery");
            }
            //when the user hasn't logged in
            else
            {
                //Refresh Login Page with a message when username or password is null.
                if (username == null || password == null)
                {
                    ViewBag.Message = "Please enter your username and password.";
                    return View();
                }
                //when username and password are not null.
                else
                {
                    // Get userID ,(userID= -1 when validating fails) 
                    int userID = AccountDAO.Validate(username, password);

                    //Refresh Login Page with a message when validating fails
                    if (userID == -1)
                    {
                        ViewBag.Message = "Username doesn't exist or Wrong password!";
                        return View();
                    }
                    //When validating successfully
                    else
                    {
                        //store userID into session
                        sessionObj.SetInt32("userID", userID);

                        //Transfer cartitem into Database
                        AccountDAO.Transfer_CartinSession_toDB(GetProductInSession(), userID);

                        //Redirect to Gallery Page
                        return RedirectToAction("Gallery", "Gallery");
                    }
                }
            }
        }

        //Logout action
        public IActionResult Logout()
        {
            ISession sessionObj = HttpContext.Session;
            sessionObj.Clear();
            return RedirectToAction("Login", "Account");
        }

        //Helper method: To get product info of current cart (productID,quantity) from session
        private Dictionary<int, int> GetProductInSession()
        {
            Dictionary<int, int> productID_Q = new Dictionary<int, int>();
            ISession sessionObj = HttpContext.Session;

            List<Product> allProducts = GalleryDAO.GetProductsByStr(null);
            foreach (Product product in allProducts)
            {
                int? quantity = sessionObj.GetInt32($"{product.ProductID}");
                if (quantity != null)
                {
                    productID_Q[product.ProductID] = (int)quantity;
                }
            }
            return productID_Q;
        }
    }
}
