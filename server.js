import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectToDB } from "./config/DB.js";
import roomRouter from "./routers/room.js";
import userRouter from "./routers/user.js";
import invitationRouter from "./routers/invitation.js";
import logToFile from "./middlewares/logTOFilrMiddleware.js";
import { jwtt } from "./Utils/generateToken.js";

dotenv.config();
connectToDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use(logToFile);

app.use("/api/rooms", roomRouter);
app.use("/api/user", userRouter);
app.use("/api/invitation", invitationRouter);

const PORT = process.env.PORT || 8080; // לוודא שהפורט מוגדר נכון

app.listen(PORT, () => {
    console.log(`App is listening on port ${PORT}`);
});
