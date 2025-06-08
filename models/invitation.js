import { Schema, model, Types } from "mongoose";
import { roomSchema } from "./room.js";



const invitationSchema = Schema({
    id: Number,
    date: { type: Date, default: new Date() },
    deadline: { type: Date, default: new Date() },
    EmailAddress: String,//כתובת קבלה
    userId: { type: Types.ObjectId, ref: "user" },
    orderRooms: [roomSchema],
    isFinish: { type: Boolean, default: false },
    Servicefees: Number,
    finaPrice: Number,
    pay:{number:Number,
        ThreeDigits:Number,
        validity:Date}

})

export const invitationModel = model("invitation", invitationSchema);