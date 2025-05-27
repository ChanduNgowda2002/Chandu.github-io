import mongoose, { Schema } from "mongoose";

const customerSchema = new Schema({
	name: {
		type: String,
		required: true
	},
	phone: {
		type: String,
	},
	password: {
		type: String,
		required: true
	},
	address: {
		type: String,
		required: true
	},
	orders: [Schema.Types.ObjectId],
})

const Customer = mongoose.model("customer", customerSchema);

export default Customer;
