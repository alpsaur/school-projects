using DOTNET_Shopping.Data;
using DOTNET_Shopping.Models;
using Microsoft.AspNetCore.Mvc;

namespace DOTNET_Shopping.Controllers
{
    public class GalleryController : Controller
    {
        //Gallery action
        public IActionResult Gallery(string? searchInput)
        {
            //Get required products (If searchInput is not null ,get all products)
            List<Product> products = GalleryDAO.GetProductsByStr(searchInput);
            ViewBag.products = products;

            //Get cartItems
            ISession sessionObj = HttpContext.Session;
            int? userID = sessionObj.GetInt32("userID");
            List<CartItem> cartItems = new List<CartItem>();
            if (userID == null)
            {
                ConfigureSession();
            }
            else if (userID == 0)
            {
                cartItems = GetCartItemsBySession();
            }
            else
            {
                cartItems = CartDAO.GetCartItems((int)userID);
            }

            //Calculate the quantity of goods in Cart from cartItems
            int itemQuanity = 0;
            foreach (CartItem item in cartItems)
            {
                itemQuanity += item.Quantity;
            }
            ViewBag.numOfGoods = itemQuanity;

            //Get user info (firstName,LastName) for display, get null when the user hasn't logged in
            User user = AccountDAO.GetUser(userID);
            ViewBag.user = user;

            ViewBag.SearchInput = searchInput;

            return View();
        }

        //To deal with ajax request from Gallery.js/addToCart()
        [HttpPost]
        public IActionResult UpdateCart(string productIdStr)
        {
            int productId = Convert.ToInt32(productIdStr);

            ISession sessionObj = HttpContext.Session;
            int? userID = sessionObj.GetInt32("userID");

            //If user hasn't logged in ,store cart info into Session
            if (userID == 0)
            {
                StoreCartIntoSession(productId);
                return Json(new { isOkay = true });
            }
            //If user has logged in, store cart info into database
            else
            {
                CartDAO.AddToCartDB(productId, (int)userID);
                return Json(new { isOkay = true });
            }
        }

        //Helper method: To store cart info into Session
        private void StoreCartIntoSession(int productId)
        {
            ISession sessionObj = HttpContext.Session;
            int? x = sessionObj.GetInt32(productId.ToString());

            //make the quantity + 1 

            sessionObj.SetInt32(productId.ToString(), (int)(x + 1));

        }

        //Helper method. Get cart items from session.
        private List<CartItem> GetCartItemsBySession()
        {
            List<CartItem> cartItems = new List<CartItem>();
            ISession sessionObj = HttpContext.Session;
            List<Product> allProducts = GalleryDAO.GetProductsByStr(null);
            foreach(Product product in allProducts) 
            {
                if (sessionObj.GetInt32($"{product.ProductID}") > 0)
                {
                    CartItem item = new CartItem
                    {
                        UserId = 0,
                        ProductID = product.ProductID,
                        Quantity = (int)sessionObj.GetInt32($"{product.ProductID}"),
                        Product = product
                    };
                    cartItems.Add(item);
                }
            }
            return cartItems;
        }

        //Configure Session for a new visitor
        private void ConfigureSession()
        {
            ISession sessionObj = HttpContext.Session;
            sessionObj.SetInt32("userID", 0);
            List<Product> allProducts = GalleryDAO.GetProductsByStr(null);
            foreach (Product product in allProducts)
            {
                sessionObj.SetInt32($"{product.ProductID}", 0);
            }
        }
    }
}
