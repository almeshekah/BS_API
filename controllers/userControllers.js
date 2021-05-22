const User = require("../model/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../config/keys");

exports.signup = async (req, res, next) => {
	const { username, password } = req.body;
	const saltRounds = 10;
	try {
		const hashedPassword = await bcrypt.hash(password, saltRounds);
		req.body.password = hashedPassword;
		const newUser = await User.create(req.body);
		const payload = {
			id: newUser.id,
			username: newUser.username,
			exp: Date.now() + JWT_EXPIRATION_MS,
		};
		const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
		res.status(201).json({ token });
		console.log("done");
	} catch (error) {
		next(error);
	}
};
exports.signin = (req, res) => {
	const { user } = req;
	const payload = {
		id: user.id,
		username: user.username,
		firstName: user.firstName,
		lastName: user.lastName,
		email: user.email,

		exp: Date.now() + JWT_EXPIRATION_MS,
	};
	const token = jwt.sign(JSON.stringify(payload), JWT_SECRET);
	res.status(201).json({ token });
};
