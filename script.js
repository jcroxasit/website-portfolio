
/* =========================
   1. MOBILE NAVIGATION
========================= */



const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");

menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
});

navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
    });
});

/* =========================
   2. AUTOMATIC COPYRIGHT YEAR
========================= */

document.getElementById("year").textContent =
    new Date().getFullYear();

/* =========================
   3. CONTACT FORM
========================= */

// Replace this with YOUR actual email address.
const recipient = "YOUR_EMAIL@example.com";

const contactForm = document.getElementById("contactForm");
const formStatus = document.getElementById("formStatus");


contactForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!contactForm.reportValidity()) {
        return;
    }

    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();

    formStatus.textContent = "Sending your message...";

    try {
        const response = await fetch("https://website-portfolio-jbp2.onrender.com/api/contact", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ name, email, message })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Failed to send your message.");
        }

        formStatus.textContent = data.message;
        contactForm.reset();

    } catch (error) {
    console.error("Contact form error:", error);

    formStatus.textContent =
        `Error: ${error.message}`;
}
});

