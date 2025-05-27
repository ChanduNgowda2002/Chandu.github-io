import mongoose, { Schema } from "mongoose";

const ordersSchema = new Schema({
	products: [{
		_id: false,
		id: Schema.Types.ObjectId,
		quantity: Number
	}],
	billingId: {
		type: Schema.Types.ObjectId,
		required: true
	}
})

const Orders = mongoose.model("orders", ordersSchema);

export default Orders;
