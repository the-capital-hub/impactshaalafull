import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

//routes
import companyRoutes from "../api/routes/company.routes.js";
import postRoutes from "../api/routes/post.routes.js";
import chatRoutes from "../api/routes/chat.routes.js";
import messageRoutes from "../api/routes/message.routes.js";
import collabRoutes from "../api/routes/collaboration.routes.js";
import documentRoutes from "../api/routes/documents.routes.js";
import notificationRoutes from "../api/routes/notification.routes.js";
import feedbackRoutes from "../api/routes/feedback.routes.js";
import invitationRoutes from "../api/routes/invitation.routes.js";
import accomplishmentRoutes from "../api/routes/accomplishment.routes.js";

dotenv.config();
const app = express();
const PORT = 8000;

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected");
  } catch (err) {
    console.log(err);
  }
};

// Define a CORS configuration object
const corsOptions = {
  origin: ["http://test.impactshaala-testsite.tech", "http://localhost:5173"],
  // origin: "*",
  credentials: true,
};

app.use(cors(corsOptions));

//middleware
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

//routes
app.use("/welcome", (_, res, next) => {
  res.send("This is the impactshaala backend");
});
app.use("/api/company", companyRoutes);
app.use("/api/post", postRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);
app.use("/api/collaboration", collabRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/notification", notificationRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/invitation", invitationRoutes);
app.use("/api/accomplishment", accomplishmentRoutes);

const server = app.listen(PORT, () => {
  connect();
  console.log(`Listening on ${PORT}`);
});

// Socket.io
import { socketAPI } from "./socket/api.js";
import { io } from "./socket/server.js";

io.attach(server);
socketAPI();
