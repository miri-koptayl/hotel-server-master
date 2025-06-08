import { Router } from "express";
import { addUserSignUp, getAllUsers,updateUserPassword, getUserById, getUserByUserNamePasswordLogin, update } from "../controllers/user.js";

const router = Router();
router.get("/",getAllUsers)
router.get("/:id",getUserById)
router.put("/:id",update)
router.put("/update-password", updateUserPassword)
router.post("/",addUserSignUp)
router.post("/login/",getUserByUserNamePasswordLogin)

export default router;