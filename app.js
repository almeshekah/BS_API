const express = require("express");
const cors = require("cors");
const app = express();
const mongoose = require("mongoose");
require("dotenv/config");

const passport = require("passport");
app.use(passport.initialize());
const { localStrategy, jwtStrategy } = require("./middleware/passport");
passport.use(localStrategy);
passport.use(jwtStrategy);

const userRoutes = require("./routes/users");
const shopRoutes = require("./routes/shop");
app.use(cors());
app.use(express.json());
//Routes
app.use(userRoutes);
app.use("/shop", shopRoutes);

app.use((req, res, next) => {
	const error = new Error("Path Not Found");
	error.status = 404;
	next(error);
});

app.use((err, req, res, next) => {
	res.status(err.status || 500);
	res.json({ message: err.message || "Internal Server Error" });
});

//connect to DB
mongoose.connect(
	process.env.DB_CONNECTION,
	{
		useNewUrlParser: true,
		useUnifiedTopology: true,
		useCreateIndex: true,
	},
	() => {
		console.log("connected to DB!");
	}
);

app.listen(8000, () => {
	console.log("The application is running on localhost:8000");
});
