import Message from "../models/message.model.js";
import Conversation from "../models/conversation.model.js";

export const sendMessageController = async (req, res) => {
  const { message } = req.body;
  const { id: receiverId } = req.params;
  const userId = req.userId;

  // console.log(message, receiverId, userId);

  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [userId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId, receiverId],
      });
    }

    const newMessage = await Message.create({
      sender: userId,
      reciever: receiverId,
      message,
    });

    if (newMessage) {
      conversation.messages.push(newMessage._id);
      await conversation.save();
    }
  
    res.status(201).send(newMessage);
  } catch (error) {
    console.error("Error in send message controller:", error);
    res.status(500).send({ error: "Internal server error" });
  }
};
