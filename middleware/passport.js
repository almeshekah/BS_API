const LocalStrategy = require("passport-local").Strategy;
const bcrypt = require("bcrypt");
const User = require("../model/user");
const JWTStrategy = require("passport-jwt").Strategy;
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
const { JWT_SECRET, JWT_EXPIRATION_MS } = require("../config/keys");

exports.jwtStrategy = new JWTStrategy(
	{
		jwtFromRequest: fromAuthHeaderAsBearerToken(),
		secretOrKey: JWT_SECRET,
	},
	async (jwtPayload, done) => {
		if (Date.now() > jwtPayload.exp) {
			return done(null, false); // this will throw a 401
		}
		try {
			const user = await User.findByPk(jwtPayload.id);
			done(null, user); // if there is no user, this will throw a 401
		} catch (error) {
			done(error);
		}
	}
);
exports.localStrategy = new LocalStrategy(async (username, password, done) => {
	try {
		const user = await User.findOne({
			where: {
				username,
			},
		});
		let passwordsMatch = user
			? await bcrypt.compare(password, user.password)
			: false;
		return done(null, passwordsMatch ? user : false);
	} catch (error) {
		return done(error);
	}
});
