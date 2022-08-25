import { User } from "../models/user";

export const add_user = async (address: string) => {
  const user = await User.findOne({ account: address });
  if (!user) {
    const newUser = new User({
      account: address,
      flag: false,
    });
    await newUser.save();
  }
};

export const get_all_user = async () => {
  const users = await User.find();
  return users;
};

export const get_whitelist = async () => {
  const users = await User.find({ flag: true });
  return users;
};
