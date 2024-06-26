import CheckoutProcess from "./CheckoutProcess.mjs";
import { loadHeaderFooter, setLocalStorage, getLocalStorage, alertMessage } from "./utils.mjs";

loadHeaderFooter();

const oldBreadcrumbsPath = getLocalStorage("breadcrumbsPath");
function bread() {
    if (oldBreadcrumbsPath && oldBreadcrumbsPath.includes("Checkout")) {
        const breadcrumbsPath = oldBreadcrumbsPath;
        document.querySelector(".breadcrumb").innerHTML = breadcrumbsPath;
        setLocalStorage("breadcrumbsPath", breadcrumbsPath);
    }
    else {
        const breadcrumbsPath = `${oldBreadcrumbsPath}<i class="fa fa-home"></i><li><a href="${window.location.href}">Checkout</a></li><i class="fa fa-home"></i>`;
        document.querySelector(".breadcrumb").innerHTML = breadcrumbsPath;
        setLocalStorage("breadcrumbsPath", breadcrumbsPath);
    }
}
bread();

// Process the checkout
const checkout = new CheckoutProcess("so-cart", document.querySelector("#order-details"));
checkout.init();

// Get form document from page
const form = document.querySelector("form");

// Once user supplies a zip code, calculate both shipping and tax, and display it
form.zip.addEventListener("blur", (ev) => {
    // Check if there is at least a number (not validating)
    if (ev.target.value.length > 0) {
        checkout.calculateOrdertotal();
    }
});

// Once the user submits the form, prevent the default
form.addEventListener("submit", async (ev) => {
    ev.preventDefault();
    const result = await checkout.checkout(ev.target);

    if (result.message === "Order Placed") {
        window.location = "/checkout/success";
        setLocalStorage("so-cart", []);
    }

    const alertsElem = alertMessage(result.message);
    
    document
        .querySelector("main.divider")
        .prepend(alertsElem);
})