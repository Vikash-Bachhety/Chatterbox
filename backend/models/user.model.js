import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
	{
		fullName: {
			type: String,
			required: true,
		},
		email: {
			type: String,
			required: true,
			unique:true,
			lowercase:true
		},
		password: {
			type: String,
			required: true,
			min: 6,
		},
		confirm_password: {
			type: String,
			required: true,
			min: 6,
		},
		gender: {
			type: String,
			required: true,
			enum: ["male", "female"],
		},
		profilePic: {
			type: String,
			default: "",
		},
	},
	{ timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;