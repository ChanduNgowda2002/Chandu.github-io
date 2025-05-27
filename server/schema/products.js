import mongoose, { Schema } from "mongoose";

const productsSchema = new Schema({
	name: {
		type: String,
	},
	price: {
		type: Number
	},
	category: {
		type: String
	}
})

const Products = mongoose.model("products", productsSchema);

export default Products;
