const mongoose = require("mongoose");
let User = mongoose.model("UserModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../config/keys");
exports.signup = async (req, res, next) => {
	const { password } = req.body;
	const saltRounds = 10;
	try {
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		req.body.password = hashedPassword;
		const newUser = await User.create(req.body);
		const payload = {
			id: newUser.id,
			username: newUser.username,
			email: newUser.email,
			phone: newUser.firstName,
			exp: Date.now() + JWT_EXPIRATION_MS,
		};

		const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
		res.status(201).json({ token });
	} catch (error) {
		next(error);
	}
};

exports.signin = async (req, res) => {
	const { username, password } = req.body;
	const user = await User.findOne({ username }).lean();
	if (!user) {
		return res.json({ status: "error", error: "Invalid username/password" });
	}
	if (await bcrypt.compare(password, user.password)) {
		const token = jwt.sign(
			{ id: user._id, username: user.username },
			JWT_SECRET
		);
		return res.json({ token });
	}

	res.json({ status: "error", error: "Invalid username/password" });
};
