const User = require('../models/user')
const Chat = require('../models/chat')

async function createChat(req, res) {
  try {
    const senderId = req.currentUser._id
    const sender = await User.findById(senderId)
    const receiverId = req.params.receiverid
    const receiver = await User.findById(receiverId)

    req.body.senderName = sender.name
    req.body.senderId = senderId
    req.body.receiverName = receiver.name
    req.body.receiverId = receiverId
    const createChat = await Chat.create(req.body)

    createChat.subChat.push(req.body)
    await createChat.save()

    res.status(201).json(createChat)

  } catch (err) {
    res.status(422).json({ message: 'youre wrong' })
  }
}

async function sendMessage(req, res) {
  try {
    const chatId = req.params.chatid
    const chat = await Chat.findById(chatId)
    // const currentUser = await User.findById(req.currentUser._id)

    chat.subChat.push(req.body)
    await chat.save()
    res.status(201).json(chat)
  } catch (err) {
    res.json(err)

  }
}

//? are we pushing the sender into the chat body?


async function getAllChats(req, res) {
  try {
    const userId = req.currentUser._id
    console.log(userId)
    const chats = await Chat.find()

    const userChats = chats.filter(chat => {
      if (chat.senderId == userId || chat.receiverId == userId) { //? using the == operator here because want same values with different data types to pass the comparison 
        return chat
      }
      console.log('sender is', chat.sender, 'userId is', userId)
    })
    // const userChats = chats.sender(req.currentUser._id)

    res.json(userChats)
  } catch (err) {
    res.json(err)
  }
}

module.exports = {
  createChat,
  sendMessage,
  getAllChats
}