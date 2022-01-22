require('dotenv').config();
const cors = require('cors');
const express = require('express');
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY)
const app = express();

let PORT = process.env.PORT;
if (PORT == null || PORT == "") {
    PORT = 8000;
}


app.use(cors());
app.use(express.json());


app.get("/", (req, res) => {
    try {
        return res.status(200).json({message: "Welcome to Stripe api test"})

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }
})

app.post("/pay", async (req, res) => {
    try {
        const {user_name} = req.body;
        if(!user_name) return res.json({message: "Please enter your name"})

         const paymentIntent = await stripe.paymentIntents.create({
             amount: Math.round(50 * 100),
             currency: 'brl',
             payment_method_types: ["card"],
             metadata: {name:user_name}
         });

         const clientSecret = paymentIntent.client_secret;
         res.status(200).json({message: "Payment initiated", clientSecret});

    } catch (error) {
        console.error(error)
        res.status(500).json({message: 'Internal server error'})
    }
})


app.listen(PORT,()=> console.log(`SERVER IS RUNNING ON PORT ${PORT}`));
