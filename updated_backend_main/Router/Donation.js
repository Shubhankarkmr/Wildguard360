import express from 'express';
import Donation from '../model/donation.js'; // Adjust the path as needed
import stripePackage from 'stripe';

const stripe = stripePackage('sk_test_51PpuPm2MKvvEKGIp75FxJBZFECXo9E5CwOrnts7diuFbiXl13NxxIJL3b5Phi4F01IQindMOS3ZkxBrE16FmQIrF00boJwK19g');
const router = express.Router();

router.post('/payment', async (req, res) => {
    const { name, address, donationType, amount } = req.body;

    try {
        const product = await stripe.products.create({
            name: "WildGuard360 Donation",
        });

        const price = await stripe.prices.create({
            product: product.id,
            unit_amount: amount * 100,  // Use the dynamic amount
            currency: 'inr',
        });

        const session = await stripe.checkout.sessions.create({
            line_items: [
                {
                    price: price.id,
                    quantity: 1,
                }
            ],
            mode: 'payment',
            success_url: `http://localhost:5173/success?name=${name}&address=${address}&donationType=${donationType}&amount=${amount}`,
            cancel_url: 'http://localhost:5173/cancel',
            customer_email: 'demo@gmail.com',
        });

        res.json({ url: session.url });
    } catch (error) {
        console.error('Error creating payment session:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

export default router;
