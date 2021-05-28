const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		phone: { type: String, required: true, unique: true },
		password: { type: String, required: true, unique: true },
	},
	{ collection: "users" }
);

const model = mongoose.model("UserModel", UserSchema);
model.exports = model;
