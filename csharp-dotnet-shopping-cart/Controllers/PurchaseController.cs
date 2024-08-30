using DOTNET_Shopping.Data;
using DOTNET_Shopping.Models;
using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;

namespace DOTNET_Shopping.Controllers
{
    public class PurchaseController : Controller
    {
        public IActionResult Index()
        {
            var userId = HttpContext.Session.GetInt32("userID");

            List<PurchasedProduct> purchasedProducts = new List<PurchasedProduct>();
            Dictionary<int, List<string>> activationCodesDict = new Dictionary<int, List<string>>();

            if (userId.HasValue)
            {
                // If the user is logged in, retrieve all purchased items from the database
                purchasedProducts = PurchaseDAO.GetPurchasedProducts(userId.Value);
                ViewBag.PurchasedProducts = purchasedProducts;
            }
            else
            {
                //redirect the user to Login
                return RedirectToAction("Login", "Account");
            }

            //Aggregate the activation codes to each product
            //so that multiple activation codes can be displayed with a combo box
            foreach (var pd in purchasedProducts)
            {
                if (activationCodesDict.ContainsKey(pd.ProductID))
                {
                    activationCodesDict[pd.ProductID].Add(pd.ActivationCode);

                }
                else
                {
                    activationCodesDict.Add(pd.ProductID, new List<string> { pd.ActivationCode });
                }
            }

            ViewBag.dict = activationCodesDict;


            return View();
        }

        public IActionResult GetPurchaseDate([FromBody] PurchasedProduct pd)
        {
            var userId = HttpContext.Session.GetInt32("userID");
            List<PurchasedProduct> purchasedProducts = new List<PurchasedProduct>();
            Debug.WriteLine(pd.ActivationCode);

            if (userId.HasValue)
            {
                // retrieve all the purchased products from database
                purchasedProducts = PurchaseDAO.GetPurchasedProducts(userId.Value);

            }
            string purchaseDate = "";

            //Loop through each purchased products to get the purchase date for the incoming request
            foreach (var purchasedProduct in purchasedProducts)
            {
                if (purchasedProduct.ActivationCode.Equals(pd.ActivationCode))
                {
                    purchaseDate = purchasedProduct.PurchaseDate;
                    break;
                }
            }

            if (string.IsNullOrEmpty(purchaseDate))
            {
                // No matching PurchasedDate found, return an error response
                return BadRequest("PurchasedDate not found for the provided ActivationCode.");
            }
            else
            {
                // Return the PurchasedDate in the expected JSON format
                return Json(new { date = purchaseDate });
            }
        }
    }
}
