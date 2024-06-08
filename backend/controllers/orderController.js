import Stripe from "stripe";
import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

// placing user order for frontend
const placeOrder = async (req, res) => {

  // const frontend_url = http://loca

  try {
    const newOrder = new orderModel({
      userid: req.body.userId,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.body.userId, { cartData: {} });

    const line_items = req.body.items.map((item) => ({
      print_data: {
        currency: "inr",
        product_data: {
          name:item.name
        },
        unit_amout:item.price*100*80
      },
      quantity: item.quantity
    }))

    line_items.push({
      price_data: {
        currency: "inr",
        product_data: {
          name:"Delivery Charges"
        },
        unit_amount:2*100*80,
      },
      quantity:1
    })

    const session = await stripe.checkout.session.create({
      line_items: line_items,
      mode: "payment",
      success_url:``
    })


  } catch (error) {}
};

export { placeOrder };
