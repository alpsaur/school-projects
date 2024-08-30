function checkforstock(event) {

    event.preventDefault(); // Prevents the default action of the anchor tag


    var elem = document.getElementById("notenough");

    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/Cart/BeforeCheckout");
    //xhr.setRequestHeader("Content-Type", "application/json; charset=utf8");
    xhr.onreadystatechange = function () {
        //Return the out of stock list, where multiple items are a long string. 
        //If not, return true.If the user is not logged in, return nouser
        if (xhr.readyState === 4 && xhr.status === 200) {
            var soldoutlist = JSON.parse(xhr.responseText);
            if (soldoutlist.soldoutlist === true) {
                window.location.href = "/Cart/CheckOut";
            }
            else if (soldoutlist.soldoutlist === "nouser") {
                window.location.href = "/Account/Login";
            }
            else {
                elem.innerHTML = "Sorry! The " + soldoutlist.soldoutlist + " have/has been sold out.";
            }

        }
    };
    xhr.send();
}