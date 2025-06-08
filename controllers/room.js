import { roomModel } from "../models/room.js"

//פונקציה להחזרת  כמות החדרים לפי הדפים
// עדכון מספר החדרים לעמוד
export async function getTotalRoomPages(req, res) {
    let limit = parseInt(req.query.limit) || 6; // היה 4, עכשיו 6

    console.log(`📢 בקשת מספר עמודים התקבלה עם limit=${limit}`); // בדיקה

    try {
        let result = await roomModel.countDocuments();
        console.log(`✅ מספר כולל של חדרים: ${result}`);

        res.json({
            totalCount: result,
            totalPages: Math.ceil(result / limit),
            limit: limit
        });
    } catch (err) {
        console.error("❌ שגיאה בחישוב מספר עמודים:", err);
        res.status(400).json({ title: "cannot get all pages", message: err.message });
    }
}


//פונקציה להחזרת כל החדרים
// פונקציה להחזרת כל החדרים לפי דף מסוים
export const getAllRooms = async (req, res) => {
    let limit = parseInt(req.query.limit) || 6;
    let page = parseInt(req.query.page) || 1;
    try {
        let data = await roomModel.find().skip((page - 1) * limit).limit(limit);
        res.json(data);
        console.log('Data from database:', data);  // הדפסת הנתונים שמתקבלים

    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot get all", message: "somethings wrong" });
    }
};



//פונקציה להחזרת חדר לפ מזהה
export const getByID = async (req, res) => {

    let { id } = req.params;
    try {

        let data = await roomModel.findById(id);
        if (!data)
            return res.status(404).json({ title: "error cannot get by id", message: "not valid  id parameter found" })
        res.json(data);
        console.log("getByID")
    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot get by id", message: "somethongs wrong" })
    }

}
//---------------פונקציה למחיקת מוצר לפי קוד----------------
export const deleteById = async (req, res) => {

    let { id } = req.params;
    try {

        let data = await roomModel.findByIdAndDelete(id);
        if (!data)
            return res.status(404).json({ title: "error cannot get by id", message: "not valid  id parameter found" })
        res.json(data);
        console.log("deleteById")

    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot get by id", message: "somethongs wrong" })
    }

}

//פונקציה לעדכון חדר לפי מזהה
export const updateByID = async (req, res) => {


    let { id } = req.params;

    if (req.body.num && req.body.num < 2 || req.body.numBads && req.body.numBads < 2)
        return res.status(404).json({ title: "wrong name or numBads", message: "wrong data" })
    try {

        let data = await roomModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!data)
            return res.status(404).json({ title: "error cannot update by id", message: "not valid  id parameter found" })
        res.json(data);
        console.log("updateByID")

    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot update by id", message: "somethongs wrong" })
    }

}
//פונקצייה להוספת חדר
 export const add = async (req, res) => {
    try {
        // בדיקה אם כל הנתונים הדרושים קיימים
        if (!req.body.num || !req.body.numBads) {
            return res.status(400).json({ 
                title: "Missing Data", 
                message: "חובה להזין מספר חדר ומספר מיטות" 
            });
        }

        // בדיקה אם הערכים תקינים
        if (req.body.num < 100 || req.body.numBads < 1) {
            return res.status(400).json({ 
                title: "Invalid Data", 
                message: "מספר החדר חייב להיות מעל 100 ומספר המיטות חייב להיות 1 ומעלה" 
            });
        }

        // בדיקה אם החדר כבר קיים במסד הנתונים
        let existingRoom = await roomModel.findOne({ num: req.body.num });
        if (existingRoom) {
            return res.status(400).json({ 
                title: "Room Already Exists", 
                message: `חדר מספר ${req.body.num} כבר קיים במערכת, יש להכניס חדר נוסף עם מספר אחר` 
            });
        }

        // יצירת חדר חדש
        let newRoom = new roomModel(req.body);
        let data = await newRoom.save();

        // החזרת תשובה במקרה של הצלחה
        res.status(201).json({ 
            title: "Room Added Successfully", 
            message: "החדר נוסף בהצלחה!", 
            room: data 
        });

    } catch (err) {
        console.error("Error adding room:", err);
        res.status(500).json({ 
            title: "Server Error", 
            message: "אירעה שגיאה בשרת, נסה שוב מאוחר יותר" 
        });
    }
};