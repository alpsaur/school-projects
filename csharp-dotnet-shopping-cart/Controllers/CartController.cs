using DOTNET_Shopping.Data;
using DOTNET_Shopping.Models;
using Microsoft.AspNetCore.Mvc;

namespace DOTNET_Shopping.Controllers
{
    public class CartController : Controller
    {
        public IActionResult Index()
        {
            var userId = HttpContext.Session.GetInt32("userID");
            List<CartItem> cartItems = new List<CartItem>();

            if (userId > 0)
            {
                // If the user is logged in, retrieve cart items from the database
                cartItems = CartDAO.GetCartItems(userId.Value);
            }
            else
            {
                // If the user is not logged in, retrieve cart items from the session
                cartItems = GetCartItemsBySession();
            }

            ViewBag.CartItems = cartItems;
            return View();

        }

        //Check out all the cart items
        public IActionResult CheckOut()
        {
            //先检查库存是否足够：如果足够，则返回true，可以继续进行支付，如果不够，返回错误信息和页面
            //First check whether the inventory is sufficient:
            //if it is enough,it returns true and you can continue to pay.
            //If it is not enough, it returns an error message and page.
            var userId = HttpContext.Session.GetInt32("userID");
            //List<string> soldout = CartDAO.CheckInventory();

            if (userId > 0)
            {
                // If the user is logged in, retrieve cart items from the database
                //we need to add new order to the order table first
                CartDAO.AddNewOrder(userId.Value);
            }
            else
            {
                // If the user has not logged in, direct user to Login page before check out the items
                return RedirectToAction("Login", "Account");
            }

            //清空购物车 
            //after purchasing,remove cart items
            CartDAO.RemoveCartItems(userId.Value);
            return RedirectToAction("Index", "Purchase");

        }

        public IActionResult BeforeCheckout()
        {
            //需要新增一个函数来查询是否有登录 4.17
            var userId = HttpContext.Session.GetInt32("userID");
            if (!(userId > 0))
            {
                string tmp = "nouser";
                return Json(new { soldoutlist = tmp });
            }
            //这个函数用来json来查阅是否足够库存
            List<string> soldout = CartDAO.CheckInventory();
            if (soldout.Count == 1)
            {
                if (soldout[0] == "Null")
                {
                    return RedirectToAction("Index", "Cart");
                }

            }

            if (soldout.Count > 0)
            {
                //it still need to change the return
                string tmp = "";
                for (int i = 0; i < soldout.Count; i++)
                {
                    tmp += soldout[i] + " ";
                }

                return Json(new { soldoutlist = tmp });
            }
            else
            {

                return Json(new { soldoutlist = true });
            }
        }

        //handle AJAX
        public IActionResult UpdateQuantity([FromBody] CartItem cartItem)
        {
            var userId = HttpContext.Session.GetInt32("userID");
            if (userId > 0)
            {
                CartDAO.UpdateCartQuantity(userId.Value, cartItem.ProductID, cartItem.Quantity);
                return Json(new { success = true });
            }
            else
            {
                HttpContext.Session.SetInt32(cartItem.ProductID.ToString(), cartItem.Quantity);
                return Json(new { success = false, message = "User not logged in." });
            }
        }


        public IActionResult RemoveProduct([FromBody] CartItem cartItem)
        {
            var userId = HttpContext.Session.GetInt32("userID");
            if (userId > 0)
            {
                CartDAO.RemoveSingleProduct(userId.Value, cartItem.ProductID);
                return Json(new { success = true });
            }
            else
            {
                HttpContext.Session.SetInt32(cartItem.ProductID.ToString(), 0);
            }

            return Json(new { success = false, message = "User not logged in." });
        }

        //Helper method. Get cart items from session.
        private List<CartItem> GetCartItemsBySession()
        {
            List<CartItem> cartItems = new List<CartItem>();
            ISession sessionObj = HttpContext.Session;
            List<Product> allProducts = GalleryDAO.GetProductsByStr(null);
            foreach (Product product in allProducts)
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
    }
}
