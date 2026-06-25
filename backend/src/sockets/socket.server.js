const { Server } = require("socket.io");
const cookie = require("cookie");
const jwt = require("jsonwebtoken");
const uuid = require("uuid");
const userModel = require("../models/user.model");
const aiService = require("../services/ai.service");
const messageModel = require("../models/message.model");
const { createMemory, queryMemory } = require("../services/vector.service");

function initSocketServer(httpServer) {
  const io = new Server(httpServer, {});

  io.use(async (socket, next) => {
    try {
      const cookies = cookie.parse(socket.handshake.headers?.cookie || "");

      if (!cookies.token) {
        return next(new Error("Authentication error: No token provided"));
      }

      const decoded = jwt.verify(cookies.token, process.env.JWT_SECRET);

      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new Error("Authentication error: User not found"));
      }

      socket.user = user;

      next();
    } catch (error) {
      console.log("Socket Auth Error:", error.message);
      next(new Error("Authentication error: Invalid token"));
    }
  });

  io.on("connection", (socket) => {
    socket.on("ai-message", async (messagePayload) => {
      const [message, vectors] = await Promise.all([
        //user response is stored
        messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: messagePayload.content,
          role: "user",
        }),

        //convert to vector
        aiService.generateVector(messagePayload.content),
      ]);

      //current memory saved to pinecone
      await createMemory({
        vectors,
        messageId: uuid(),
        metadata: {
          chat: messagePayload.chat,
          user: socket.user._id,
          text: response,
        },
      });

      const [memory, chatHistory] = await Promise.all([
        //related memory to that particular chats of the user into the pinecone
        queryMemory({
          queryVector: vectors,
          limit: 3,
          metadata: {
            user: socket.user._id,
          },
        }),

        //chatHistory of a particular user from database
        (
          await messageModel
            .find({
              chat: messagePayload.chat,
            })
            .sort({ createdAt: -1 })
            .limit(4)
            .lean()
        ).reverse(),
      ]);

      //STM
      const stm = chatHistory.map((item) => {
        return {
          role: item.role,
          parts: [{ text: item.content }],
        };
      });

      //LTM
      const ltm = [
        {
          role: "system",
          parts: [
            {
              text: `
            
            these are some previous messages from the chat, use them to generate a response 

            ${memory.map((item) => item.metadata.text).join("\n")}
            
            `,
            },
          ],
        },
      ];

      //generate ai response based on stm and ltm
      const response = await aiService.generateResponse([...ltm, ...stm]);

      const [responseMessage, responseVectors] = await Promise.all([
        //ai response is stored in database
        messageModel.create({
          chat: messagePayload.chat,
          user: socket.user._id,
          content: response,
          role: "model",
        }),

        //generate vectorfor ai response
        aiService.generateVector(response),
      ]);

      //save ai message in pinecone
      await createMemory({
        vectors: responseVectors,
        messageId,
      });

      //send ai response to user
      socket.emit("ai-response", {
        content: response,
        chat: messagePayload.chat,
      });
    });
  });
}

module.exports = initSocketServer;
