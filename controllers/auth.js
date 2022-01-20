const expressJwt = require("express-jwt");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const User = require("../models/user");

exports.isSignedIn = expressJwt({
  secret: process.env.JWT_SECRET,
  algorithms: ["HS256"],
  userProperty: "user",
  getToken: function fromHeaderOrQuerystring(req) {
    if (
      req.headers.authorization &&
      req.headers.authorization.split(" ")[0] === "Bearer"
    ) {
      return req.headers.authorization.split(" ")[1];
    } else if (req.cookies["token"]) {
      return req.cookies["token"];
    } else if (req.query && req.query.token) {
      return req.query.token;
    }
    return null;
  },
});

exports.handleSignup = async (req, res) => {
  // console.log(req.body);
  // console.log(ROLES.ADMIN, ROLES.TEACHER);
  try {
    const salt_rounds = 10;
    const encry_password = await bcrypt.hash(req.body["password"], salt_rounds);
    req.body["encry_password"] = encry_password;
    delete req.body["password"];
    const newUser = new User(req.body);
    const savedUser = await newUser.save();
    res.json(savedUser);
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

exports.handleSignin = async (req, res) => {
  // console.log(req.body);
  // res.send("ok");

  // console.log(typeof req.headers.cookie);
  // console.log(req.cookies);

  const { email, password } = req.body;

  // VALIDATE INPUT

  try {
    const user = await User.findOne({ email });

    if (!user) {
      res.json({ error: "user doesn't exists" });
    } else if (!(await bcrypt.compare(password, user.encry_password))) {
      res.json({ error: "Invalid password" });
    } else {
      // create a token
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

      const oneDay = 1000 * 60 * 60 * 24;

      res.cookie("token", token, {
        maxAge: oneDay,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production" ? true : false,
      });

      const { _id, uname, email, role } = user;

      res.json({ token, user: { _id, uname, email, role } });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

exports.handleSignout = (req, res) => {
  res.clearCookie("token");
  res.json({ messasge: "User signout successfull" });
};
