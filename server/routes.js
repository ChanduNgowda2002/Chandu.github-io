import express from "express";
import Customer from "./schema/customer.js";
import Products from "./schema/products.js";
import Orders from "./schema/orders.js";
import Billing from "./schema/billing.js";
import DeliveryPerson from "./schema/delivery-person.js";
import mongoose from "mongoose";
import path, { dirname } from "path"
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const router = express.Router();

async function getUser(name) {
	return await Customer.findOne({ name });
}

async function getProductList() {
	return await Products.find();
}
var htmlPath = path.join(__dirname, "../client");

router.use(express.static(htmlPath));

router.post("/signup", async (req, res) => {
	const { uname: name, pwd: password, phone, address } = req.body;

	if(await getUser(name) !== null) {
		res.json({ err: true, msg: "user already exist." });
		return;
	}

	const newCust = new Customer({ name, phone, password, address });
	if(await newCust.save()) {
		res.json({ err: false, msg: "signup successful" });
	}
})

router.post("/login", async (req, res) => {
	const { uname, pwd } = req.body;

	const user = await getUser(uname);

	if(!user) {
		res.json({ err: true, msg: "invalid username" });
		return;
	}

	if(user.password !== pwd) {
		res.json({ err: true, msg: "invalid password" });
		return;
	}

	res.json({ err: false, msg: "login successful", user });
})

router.get("/product-list", async (_, res) => {
	const products = await getProductList();

	res.json({ err: false, products });
})

router.get("/all-orders", async (_, res) => {
	let orders = await Orders.find({});

	for(let i = 0; i < orders.length; i++) {
		let ord = orders[i];
		let billing = (await Billing.findById(ord.billingId)).toObject()
		let deliveryPerson = (await DeliveryPerson.findById(billing.deliveryPerson)).toObject();

		billing.deliveryPerson = deliveryPerson.name;

		orders[i] = {
			_id: ord._id,
			billing
		}
	}

	res.json({ err: false, orders });
})

router.get("/all-customers", async (_, res) => {
	let customers = await Customer.find({});

	res.json({ err: false, customers });
})

router.post("/add-order", async (req, res) => {
	const { name, cart } = req.body;

	const user = await getUser(name);

	if(!user) {
		res.json({ err: true, msg: "invalid username" });
		return;
	}

	if(cart.length === 0) {
		res.json({ err: true, msg: "cart is empty" });
		return;
	}

	const deliveryPeople = await DeliveryPerson.find();

	const randDel = deliveryPeople[Math.floor(Math.random()*deliveryPeople.length)];

	const billing = new Billing({
		totalPrice: cart.reduce((acc, { qty, price }) => acc + (price * qty), 0),
		deliveryPerson: randDel._id,
		address: user.address,
		date: new Date().toDateString(),
	})

	await billing.save();

	const order = new Orders({
		products: cart.map(({ _id, qty }) => {
			return {
				id: new mongoose.Types.ObjectId(_id),
				quantity: qty
			}
		}),
		billingId: billing._id
	});

	await order.save();

	user.orders.push(order._id);
	await user.save();

	res.json({ err: false, msg: "order placed successfully" });
})

router.get("/orders/:name", async (req, res) => {
	const { name } = req.params;

	const cust = await Customer.findOne({ name });

	if(!cust) {
		res.json({ err: true, msg: "invalid username" });
		return;
	}

	const orders = [];
	
	for(let ordId of cust.orders) {
		let ord = (await Orders.findById(ordId)).toObject();
		let billing = (await Billing.findById(ord.billingId)).toObject();
		let deliveryPerson = (await DeliveryPerson.findById(billing.deliveryPerson)).toObject();

		for(let prod of ord.products) {
			const p = (await Products.findById(prod.id)).toObject();
			prod.name = p.name;
			prod.price = p.price;
		}

		orders.push({
			billing: {
				...billing,
				deliveryPerson: { ...deliveryPerson }
			},
			products: ord.products,
			_id: ordId
		});
	}

	res.json({ orders });
})

const admins = {
	"admin": "admin"
}

router.post('/admin-login', (req, res) => {
	const { uname, pwd } = req.body;

	// Replace this with real DB check
	if (uname === 'admin' && pwd === '1234') {
		res.json({ msg: 'Login successful', err: false });
	} else {
		res.json({ msg: 'Invalid credentials', err: true });
	}
});