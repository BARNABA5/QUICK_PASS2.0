
// Navigate to booking page
function goToBooking(eventName) {
    localStorage.setItem("selectedEvent", eventName);
    window.location.href = "booking.html";
}

document.addEventListener("DOMContentLoaded", function() {

    // ==============================
    // AUTO FILL EVENT NAME
    // ==============================
    const eventField = document.getElementById("event");

    if (eventField) {
        const selectedEvent = localStorage.getItem("selectedEvent");

        if (selectedEvent) {
            eventField.value = selectedEvent;
        }
    }

    // ==============================
    // PRICE CALCULATION
    // ==============================
    const ticketsInput = document.getElementById("tickets");
    const categoryInput = document.getElementById("category");
    const totalDisplay = document.getElementById("total");

    function calculatePrice() {
        if (!ticketsInput || !categoryInput) return;

        let price = 0;

        if (categoryInput.value === "Regular") price = 500;
        if (categoryInput.value === "VIP") price = 1000;
        if (categoryInput.value === "VVIP") price = 2000;

        const tickets = Number(ticketsInput.value);
        const total = price * tickets;

        totalDisplay.textContent = total || 0;
    }

    if (ticketsInput && categoryInput) {
        ticketsInput.addEventListener("input", calculatePrice);
        categoryInput.addEventListener("change", calculatePrice);
    }

    // ==============================
    // FORM SUBMISSION
    // ==============================
    const form = document.getElementById("bookingForm");

    if (form) {

        form.addEventListener("submit", function(e) {
            e.preventDefault();

            const data = {
                event: document.getElementById("event").value,
                name: document.getElementById("name").value,
                phone: document.getElementById("phone").value,
                tickets: document.getElementById("tickets").value,
                category: document.getElementById("category").value,
                total: document.getElementById("total").textContent,
                payment: document.getElementById("payment").value
            };

            fetch("https://script.google.com/macros/s/AKfycbwPeuQESEyb2C5ust4hm1DE6w1V5zJl0p3EB5NGNxTzNCeYl0DUniToQXDshnc1h1U/exec", {
                method: "POST",
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(result => {

                alert("Booking Successful! Ticket ID: " + result.ticketID);

                // Show receipt
                document.getElementById("receipt").style.display = "block";

                document.getElementById("receiptDetails").innerHTML =
                    "Name: " + result.name +
                    "<br>Event: " + result.event +
                    "<br>Total Paid: KES " + result.total +
                    "<br>Ticket ID: " + result.ticketID;

                // Generate QR Code
                document.getElementById("qrcode").innerHTML = "";
               
const qrData = {
    ticketID: result.ticketID,
    name: result.name,
    event: result.event,
    total: result.total,
    status: "VALID"
};

new QRCode(document.getElementById("qrcode"), {
    text: JSON.stringify(qrData),
    width: 180,
    height: 180
});
                form.reset();
                totalDisplay.textContent = "0";

            })
            .catch(error => {
                alert("Error submitting booking.");
                console.error(error);
            });

        });

    }

});