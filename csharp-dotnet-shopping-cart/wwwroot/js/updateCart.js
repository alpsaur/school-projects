// This JavaScript is for updating the total amount on the Cart page, and for updating the Cart table in the database when user change the quantity of product.

window.onload = function () {
    let quantityBoxes = document.querySelectorAll('.quantity-input');
    let totalPriceElem = document.getElementById("totalPrice"); 

    // Calculate total price initially when the page loads
    UpdateTotalPrice(totalPriceElem);

    quantityBoxes.forEach(function (quantityBox) {
        quantityBox.addEventListener('change', function (event) {
            let productId = parseInt(event.target.getAttribute('data-product-id'));
            let quantity = parseInt(event.target.value);

            // Check if both productId and quantity are valid numbers
            if (!isNaN(productId) && !isNaN(quantity)) {
                UpdateCartQuantity(productId, quantity);
                UpdateTotalPrice(totalPriceElem);  // Update the total price whenever a quantity changes
            }

            if (quantity === 0)
            {
                let modalElem = document.getElementById('modal-' + productId);
                modalElem.style.display = "block";

                //handle yes and no buttons on the modal
                modalElem.querySelector('#btn-yes').addEventListener('click', function () {
                    let productELem = document.getElementById('flex-' + productId);
                    RemoveProductFromCart(productId,productELem);
                    modalElem.style.display = "none"; //close modal
                });

                modalElem.querySelector('#btn-no').addEventListener('click', function () {
                    modalElem.style.display = "none";
                })
                
            }
            
          
              
        });
    });
}

function UpdateTotalPrice(totalPriceElem) {
    let total = 0;
    let quantityBoxes = document.querySelectorAll('.quantity-input');
    quantityBoxes.forEach(function (quantityBox) {
        let quantity = parseInt(quantityBox.value);
        let unitPrice = parseFloat(quantityBox.dataset.unitPrice);
        total += quantity * unitPrice;
    });
    totalPriceElem.innerHTML = `$${total.toFixed(2)}`;  // Format total to 2 decimal places and update the HTML
}

function UpdateCartQuantity(productId, quantity) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/Cart/UpdateQuantity");
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            console.log("Update status", response);
        }
    }

    let data = {
        "productId": productId,
        "quantity": quantity
    };

    xhr.send(JSON.stringify(data));
}

function RemoveProductFromCart(productId,productElem){
    let xhr = new XMLHttpRequest();
    xhr.open("POST", "/Cart/RemoveProduct");
    xhr.setRequestHeader("Content-Type", "application/json; charset=utf8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let response = JSON.parse(xhr.responseText);
            console.log("Delete successful", response);
            productElem.style.display = "none";
        }
    }

    let data = {
        "productId": productId,
    };

    xhr.send(JSON.stringify(data));
}
