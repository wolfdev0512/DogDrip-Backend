import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  account: {
    type: String,
    required: true,
  },
  flag: {
    type: Boolean,
    required: true,
  },
});

const User = mongoose.model("User", UserSchema);

export { User };
