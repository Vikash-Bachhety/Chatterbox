import User from "../models/user.model.js";

export const userController = async (req, res) => {
	try {
		const allUsers = await User.find({});
		res.status(200).json(allUsers);
	} catch (error) {
		console.error("Error in getUsersForSidebar: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};
