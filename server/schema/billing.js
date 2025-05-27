import mongoose, { Schema } from "mongoose";

const billingSchema = new Schema({
	totalPrice: {
		type: Number,
	},
	deliveryPerson: {
		type: Schema.Types.ObjectId,
		required: true
	},
	address: {
		type: String,
	},
	date: {
		type: String
	}
})

const Billing = mongoose.model("billing", billingSchema);

export default Billing;
