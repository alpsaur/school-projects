
// This JavaScript is for changing the purchase date on the screen according to the activation code (if activation codes in the combo box were purchased on different dates).
window.onload = function () {

    //select all activation codes
    let actCodeBoxes = document.querySelectorAll(".activation-codes");

    //add an eventlistener to each piece of activation code.
    actCodeBoxes.forEach(function (actCodeBox) {
        actCodeBox.addEventListener('change', function () {
            //get the value of the activation code if it being selected
            var selectedValue = actCodeBox.value;
            //get the purchase date div for the particular activation code
            var purchaseDateElem = actCodeBox.closest('.flex-container').querySelector(".date");
            //Use helper function to get the purchase date for this particular activation code
            GetPurchaseDate(selectedValue, purchaseDateElem);
        });
    });
}



//Using AJAX to retrieve the pruchase data from the sever fo the particular activation code
function GetPurchaseDate(activationCode, dateElem) {

    let xhr = new XMLHttpRequest();

    xhr.open("POST", "/Purchase/GetPurchaseDate");

    xhr.setRequestHeader("Content-Type", "application/json; charset=utf8");

    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let dateinfo = JSON.parse(xhr.responseText);
            dateElem.innerHTML = dateinfo.date;
        }

    }

    let data = {
        "ActivationCode": activationCode
    };

    xhr.send(JSON.stringify(data))

}