import Conversation from "../models/conversation.model.js";

export const receiveMessageController = async (req, res) => {
  const userId = req.userId;
  const { id: partnerId } = req.params;

  // console.log(userId, partnerId);

  try {
    // Find conversation where both userId and partnerId are participants
    const conversation = await Conversation.findOne({
      participants: { $all: [userId, partnerId] },
    }).populate("messages");

    // console.log(conversation);

    if (conversation) {
      // If conversation is found, send back the messages
      const messages = conversation.messages;
      res.status(200).send(messages); // Return messages as JSON
    } else {
      // If conversation is not found, send appropriate message
      res.status(404).send([]);
    }
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error in receive message controller:", error);
    res.status(500).send("Internal server error");
  }
};
