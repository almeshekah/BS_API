const bcrypt = require("bcrypt");
const { fromAuthHeaderAsBearerToken } = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local").Strategy;
const JWTStrategy = require("passport-jwt").Strategy;
const User = require("../model/User");
const { JWT_SECRET } = require("../config/keys");

exports.localStrategy = new LocalStrategy(async (username, password, done) => {
	try {
		const user = await User.findOne({
			where: { username },
		});
		const passwordsMatch = user
			? await bcrypt.compare(password, user.password)
			: false;

		return done(null, passwordsMatch ? user : false);
	} catch (error) {
		return done(error);
	}
});

exports.jwtStrategy = new JWTStrategy(
	{
		jwtFromRequest: fromAuthHeaderAsBearerToken(),
		secretOrKey: JWT_SECRET,
	},

	async (jwtPayload, done) => {
		if (Date.now() > jwtPayload.exp) {
			return done(null, false);
		} else {
			try {
				const user = await User.findByPk(jwtPayload.id);
				return done(null, user);
			} catch (error) {
				return done(error);
			}
		}
	}
);
