import mongoose from "mongoose";

export const roomSchema = new mongoose.Schema({
    id: Number,
    num: Number, // שם החדר
    roomCategories: [String], // קטגוריות של החדר
    description: String,
    price: Number,
    isOccupied:{type:Boolean,default:false},
    constructiondate: { type: Date, default: new Date() }, // תאריך בניית החדר
    numBads: Number, // מספר מיטות
    imagePath: { type: String }, // נתיב לתמונה של החדר
    amenities: [String], // שירותים נוספים בחדר
    author: {
        firstName: String,
        lastName: String,
        phone: Number
    },
   
});

export const roomModel = mongoose.model("room", roomSchema);
