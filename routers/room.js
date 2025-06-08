import { Router } from "express";
import { add, deleteById, getAllRooms, getByID, updateByID, getTotalRoomPages } from "../controllers/room.js";
import { check } from "../middlewares/validateToken.js";

const router = Router();

router.get("/", getAllRooms);
router.get("/totalPages", getTotalRoomPages); // ✅ הוספת הנתיב שחסר
router.get("/:id", getByID);
router.delete("/:id",check, deleteById);
router.put("/:id",check, updateByID);
router.post("/",check ,add);

export default router;
