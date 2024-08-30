


window.onload = function () {
}

//When the searchBar is cleared, redirect to Gallery (searchInput = null)
function checkSearchBarCleared() {
    let searchInput = document.getElementById("searchInput");
    if (searchInput.value === "") {
        window.location.href = "/Gallery/Gallery";
    }
}

//Update cart number in the page
function UpdateCartNum(productId) {
    var num = document.getElementById("numOfGoods").innerHTML;
    document.getElementById("numOfGoods").innerHTML = (parseInt(num) + 1).toString();

    addToCart(productId);
}

//Use ajax to send productId to /Purchasing/UpdateCart()
function addToCart(productId) {
    let xhr = new XMLHttpRequest();

    xhr.open("Post", "/Gallery/UpdateCart")
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhr.onreadystatechange = function () {
        // wait for AJAX to complete
        if (this.readyState === XMLHttpRequest.DONE) {
            // checks if the underlying http transfer was successful
            if (this.status !== 200) {
                return;
            }
        }
    }
    xhr.send("productIdStr=" + productId);
}