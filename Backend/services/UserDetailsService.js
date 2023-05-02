const { UserDetailsModel } = require("../models/UserDetails");
const md5 = require("md5");

const CreateNewUserService = async (payload) => {
  if (payload) {
    let { password } = payload;
    password = md5(password);
    const userDetailsModel = new UserDetailsModel({ ...payload, password });
    let res = await userDetailsModel.save();
    res = JSON.parse(JSON.stringify(res));
    if (res) {
      return { status: 200, response: res };
    }
    return { status: 400, response: null };
  }

  throw new Error("Unable to create new user");
};

const LoginUserService = async (payload) => {
  if (payload) {
    let { userName, password } = payload;
    password = md5(password);
    userName = String(userName).toLowerCase();
    let userDetails = await UserDetailsModel.findOne().where({
      userName: userName,
      password: password,
    });
    userDetails = JSON.parse(JSON.stringify(userDetails));
    if (userDetails) {
      return { status: 200, response: userDetails };
    }
    return { status: 204, response: "Login Credentails not found" };
  }
  throw new Error("Login Credentails not found");
};

module.exports = { CreateNewUserService, LoginUserService };
