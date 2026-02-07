// ================================
// CART.JS - MOVENPICK (XAMPP VERSION)
// ================================

document.addEventListener("DOMContentLoaded", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const DELIVERY_FEE = 2000;

    const cartItemsDiv = document.getElementById("cartItems");
    const emptyCartMsg = document.getElementById("emptyCart");
    const subtotalSpan = document.getElementById("subtotal");
    const deliverySpan = document.getElementById("delivery");
    const totalSpan = document.getElementById("total");
    const placeOrderBtn = document.getElementById("placeOrderBtn");

    // ----------------------------
    // RENDER CART
    // ----------------------------
    function renderCart() {
        cartItemsDiv.innerHTML = "";

        if (cart.length === 0) {
            emptyCartMsg.style.display = "block";
            cartItemsDiv.style.display = "none";
            updateSummary(0);
            return;
        }

        emptyCartMsg.style.display = "none";
        cartItemsDiv.style.display = "block";

        let subtotal = 0;

        cart.forEach((item, index) => {
            subtotal += item.price * item.quantity;

            const div = document.createElement("div");
            div.className = "cart-item";

            div.innerHTML = `
                <div class="item-details">
                    <h4>${item.name}</h4>
                    <p>${item.price.toLocaleString()} RWF each</p>
                </div>
                <div class="controls">
                    <button onclick="decreaseQty(${index})">-</button>
                    <span>${item.quantity}</span>
                    <button onclick="increaseQty(${index})">+</button>
                </div>
                <div class="item-total">
                    <p>${(item.price * item.quantity).toLocaleString()} RWF</p>
                    <button onclick="removeItem(${index})" class="remove-btn">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </div>
            `;

            cartItemsDiv.appendChild(div);
        });

        updateSummary(subtotal);
        saveCart();
    }

    // ----------------------------
    // UPDATE SUMMARY
    // ----------------------------
    function updateSummary(subtotal) {
        const total = subtotal + DELIVERY_FEE;
        
        subtotalSpan.textContent = subtotal.toLocaleString() + " RWF";
        deliverySpan.textContent = DELIVERY_FEE.toLocaleString() + " RWF";
        totalSpan.textContent = total.toLocaleString() + " RWF";
    }

    // ----------------------------
    // SAVE CART
    // ----------------------------
    function saveCart() {
        localStorage.setItem("cart", JSON.stringify(cart));
    }

    // ----------------------------
    // QUANTITY CONTROLS
    // ----------------------------
    window.increaseQty = function(index) {
        cart[index].quantity++;
        renderCart();
    };

    window.decreaseQty = function(index) {
        if (cart[index].quantity > 1) {
            cart[index].quantity--;
            renderCart();
        }
    };

    window.removeItem = function(index) {
        if (confirm("Remove this item from cart?")) {
            cart.splice(index, 1);
            renderCart();
        }
    };

    // ----------------------------
    // PLACE ORDER
    // ----------------------------
    placeOrderBtn.addEventListener("click", async () => {
        if (cart.length === 0) {
            alert("Your cart is empty!");
            return;
        }

        // Get form values
        const fullName = document.getElementById("fullName").value.trim();
        const phone = document.getElementById("phone").value.trim();
        const address = document.getElementById("address").value.trim();
        const city = document.getElementById("city").value.trim();

        // Validate
        if (!fullName || !phone || !address) {
            alert("Please fill in all delivery details");
            return;
        }

        // Get payment method
        const paymentInput = document.querySelector('input[name="payment"]:checked');
        if (!paymentInput) {
            alert("Please select a payment method");
            return;
        }
        const paymentMethod = paymentInput.value;

        // Calculate total
        let subtotal = 0;
        cart.forEach(item => {
            subtotal += item.price * item.quantity;
        });
        const total = subtotal + DELIVERY_FEE;

        // Disable button while processing
        placeOrderBtn.disabled = true;
        placeOrderBtn.textContent = "Processing...";

        try {
            // Send to PHP backend
            const formData = new FormData();
            formData.append("fullName", fullName);
            formData.append("phone", phone);
            formData.append("address", address);
            formData.append("city", city);
            formData.append("paymentMethod", paymentMethod);
            formData.append("total", total);
            formData.append("deliveryFee", DELIVERY_FEE);
            formData.append("items", JSON.stringify(cart));

            const response = await fetch("orders/place_order.php", {
                method: "POST",
                body: formData
            });

            const result = await response.json();

            if (result.success) {
                // Show success modal
                document.getElementById("orderNumber").textContent = result.orderNumber;
                document.getElementById("successModal").style.display = "flex";

                // Clear cart
                localStorage.removeItem("cart");
                cart = [];
            } else {
                alert("Error: " + (result.error || "Failed to place order"));
                placeOrderBtn.disabled = false;
                placeOrderBtn.innerHTML = '<i class="fa-solid fa-shopping-bag"></i> Place Order';
            }
        } catch (error) {
            console.error("Error:", error);
            alert("Failed to place order. Please try again.");
            placeOrderBtn.disabled = false;
            placeOrderBtn.innerHTML = '<i class="fa-solid fa-shopping-bag"></i> Place Order';
        }
    });

    // ----------------------------
    // PAYMENT METHOD TOGGLE
    // ----------------------------
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    const cardDetails = document.getElementById("cardDetails");

    paymentRadios.forEach(radio => {
        radio.addEventListener("change", () => {
            if (radio.value === "Card") {
                cardDetails.style.display = "block";
            } else {
                cardDetails.style.display = "none";
            }
        });
    });

    // INITIAL RENDER
    renderCart();
});