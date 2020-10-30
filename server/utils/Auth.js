const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { secret_key } = require("../../config/config").completeConfig[
  process.env.NODE_ENV || "default"
];

const userRegister = async (userDets, role, res) => {
  try {
    let usernameNotTaken = await validateUserame(userDets.username);
    if (!usernameNotTaken) {
      return res.status(400).json({
        message: "Username Already Exist",
        success: false,
      });
    }

    let emailNotTaken = await validateEmail(userDets.email);
    if (!emailNotTaken) {
      return res.status(400).json({
        message: "Email Already Exist",
        success: false,
      });
    }

    const hashedPass = await bcrypt.hash(userDets.password, 12);
    const newUser = new User({
      ...userDets,
      password: hashedPass,
      role,
    });

    await newUser.save();
    return res.status(201).json({ message: "User Created", success: true });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Unable To Create Your Account", success: false });
  }
};

const userLogin = async (userCreds, role, res) => {
  let { username, password } = userCreds;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(404).json({
      message: "Username is Not Found. invalid Login Credential",
      success: false,
    });
  }
  if (user.role !== role) {
    return res.status(404).json({
      message: "Your Role is Invalid. invalid Login Credential",
      success: false,
    });
  }
  let isMatch = await bcrypt.compare(password, user.password);
  if (isMatch) {
    let token = jwt.sign(
      {
        user_id: user._id,
        role: user.role,
        username: user.username,
        email: user.email,
      },
      secret_key,
      { expiresIn: "7 days" }
    );

    let result = {
      username: user.username,
      role: user.role,
      email: user.email,
      token: `Bearer ${token}`,
      expiresIn: 168,
    };
    return res.status(200).json({
      ...result,
      message: "You are logged in",
      success: true,
    });
  } else {
    return res.status(403).json({
      message: "Incorrect Password",
      success: true,
    });
  }
};

const validateUserame = async (username) => {
  let user = await User.findOne({ username });
  return user ? false : true;
};

const userAuth = passport.authenticate("jwt", { session: false });

const serializeUser = async (user) => {
  return {
    role: user.role,
    _id: user._id,
    name: user.name,
    email: user.email,
    username: user.username,
  };
};

const checkRole = (roles) => (req, res, next) =>
  !roles.includes(req.user.role) ? res.status(401).json("Unautorized") : next();

const validateEmail = async (email) => {
  let user = await User.findOne({ email });
  return user ? false : true;
};

module.exports = {
  serializeUser,
  checkRole,
  userAuth,
  userRegister,
  userLogin,
};
