import mongoose from "mongoose";

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    default: "I'm new!",
  },
  posts: [
    {
      type: Schema.Types.ObjectId,
      ref: "Post", // Post model를 reference하라
    },
  ],
});

export default mongoose.model("User", userSchema);
