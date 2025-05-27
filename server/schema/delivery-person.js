import mongoose, { Schema } from "mongoose";

const deliveryPersonSchema = new Schema({
	name: {
		type: String,
	},
	phone: {
		type: String
	},
})

const deliveryPerson = mongoose.model("delivery-person", deliveryPersonSchema);

export default deliveryPerson;
