import { Router } from "express";
import { getAllIinvitation,getinvitationsByUserId,completeInvitation,addInvitation,delInvitation} from "../controllers/invitation.js";

const router = Router();
router.get("/", getAllIinvitation)
router.get("/byUserId/:userid", getinvitationsByUserId)
router.post("/", addInvitation)
router.post("/delete", delInvitation); // הוספה מפורשת ל־POST
router.put("/invitations/:id/complete", completeInvitation);

export default router;