const bcrypt = require("bcrypt");
const userService = require("../user/user.service");
const logger = require("../../services/logger.service");

async function login(email, password) {
  logger.debug(`auth.service - login with email: ${email}`);
  const user = await userService.getByEmail(email);
  if (!user) return Promise.reject("Invalid username or password");
  const match = await bcrypt.compare(password, user.password);
  if (!match) return Promise.reject("Invalid username or password");
  delete user.password;
  user._id = user._id.toString();
  return user;
}

async function signup(user) {
  const saltRounds = 10;

  logger.debug(
    `auth.service - signup with username: ${user.username}, email: ${user.email}`
  );
  if (!user.username || !user.password || !user.email)
    return Promise.reject("email, username and password are required!");

  const userExist = await userService.getByUsername(user.username);
  if (userExist) return Promise.reject("usernameTaken");

  user.password = await bcrypt.hash(user.password, saltRounds);
  return userService.add(user);
}

async function googleSignup(user) {
  const userExist = await userService.getByUsername(user.username);
  if (userExist) {
    delete userExist.password;
    return userExist;
  }
  return userService.add(user);
}

module.exports = {
  signup,
  login,
  googleSignup,
};
