
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { createClient } = require("@supabase/supabase-js");
const { Resend } = require("resend");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: "https://website-portfolio.jc-roxas-it.workers.dev"
}));
const path = require("path");
app.use(express.static(path.join(__dirname, "..")));

const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SECRET_KEY
);
const resend = new Resend(process.env.RESEND_API_KEY);


app.get("/api", (req, res) => {
    res.json({
        status: "success",
        message: "BROOO! Fresh backend is running!"
    });
});

app.get("/api/db-test", async (req, res) => {
    try {
        const { error } = await supabase
            .from("contact_messages")
            .select("id")
            .limit(1);

        if (error) {
            console.error("Database test failed:", error.message);
            return res.status(500).json({
                status: "error",
                message: "Database connection test failed."
            });
        }

        return res.json({
            status: "success",
            message: "Supabase connection works!"
        });
    } catch (error) {
        console.error("Database test exception:", error.message);
        return res.status(500).json({
            status: "error",
            message: "Unexpected database test error."
        });
    }
});

app.post("/api/contact", async (req, res) => {
    const { name, email, message } = req.body || {};

    if (
        typeof name !== "string" ||
        typeof email !== "string" ||
        typeof message !== "string" ||
        !name.trim() ||
        !email.trim() ||
        !message.trim()
    ) {
        return res.status(400).json({
            error: "Please provide your name, email, and message."
        });
    }

    try {
        const { error } = await supabase
            .from("contact_messages")
            .insert({
                name: name.trim(),
                email: email.trim(),
                message: message.trim()
            });

        if (error) {
            console.error("Supabase insert failed:", error.message);

            return res.status(500).json({
                error: "Your message could not be saved. Please try again."
            });
        }

        
console.log("Contact message saved to Supabase!");

try {
    const { data, error } = await resend.emails.send({
        from: "Portfolio Contact <onboarding@resend.dev>",
        to: [process.env.NOTIFICATION_EMAIL],
        subject: `New portfolio message from ${name.trim()}`,
        text: `Name: ${name.trim()}\nEmail: ${email.trim()}\n\nMessage:\n${message.trim()}`
    });

    if (error) {
        console.error("Resend email failed:", error);
    } else {
        console.log("Email notification sent!", data);
    }
} catch (emailError) {
    console.error("Email notification error:", emailError.message);
}

return res.status(201).json({
    status: "success",
    message: "Your message was saved successfully!"
});

    } catch (error) {
        console.error("Contact submission failed:", error.message);

        return res.status(500).json({
            error: "Unexpected error while saving your message."
        });
    }
});

app.listen(PORT, () => {
    console.log(`Fresh backend running at http://localhost:${PORT}`);
});
