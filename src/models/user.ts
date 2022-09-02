import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  first: {
    type: String,
    required: true,
  },
  last: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    require: true,
  },
  invite: {
    type: Array,
    required: true,
  },
  img: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    require: true,
  },
});

const User = mongoose.model("User", UserSchema);

export { User };
