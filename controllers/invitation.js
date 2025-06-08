import { roomModel } from "../models/room.js";
import { invitationModel } from "../models/invitation.js"
import { userModel } from "../models/user.js";

export const getAllIinvitation = async (req, res) => {

    try {
        let data = await invitationModel.find();
        res.json(data)
    }
    catch (err) {

        res.status(400).json({ title: "error cannot get all", message: err.message })
    }

}


export const getinvitationsByUserId = async (req, res) => {
    let { userid } = req.params;
    try {
        let data = await invitationModel.find({ userId: userid });
        res.json(data)
    }
    catch (err) {

        res.status(400).json({ title: "error cannot get by id", message: err.message })
    }
}
export const completeInvitation = async (req, res) => {
    try {
        const { invitationId } = req.params;
        if (!invitationId) {
            return res.status(400).json({
                title: "Missing required details",
                message: "invitationId is required",
            });
        }

        const updatedInvitation = await invitationModel.findByIdAndUpdate(
            invitationId,
            { isFinish: true },
            { new: true }
        );

        if (!updatedInvitation) {
            return res.status(404).json({
                title: "Invitation not found",
                message: `No invitation found with ID ${invitationId}`,
            });
        }

        return res.json({
            title: "Invitation updated",
            updatedInvitation,
        });
    } catch (err) {
        res.status(500).json({
            title: "Error updating invitation",
            message: err.message,
        });
    }
};

export const addInvitation = async (req, res) => {
    try {
        let { userId, orderRooms, EmailAddress, pay } = req.body;

        if (!userId || !orderRooms || orderRooms.length === 0 || !pay) {
            return res.status(400).json({
                title: "Missing required details",
                message: "userId, orderRooms, and payment details are required",
            });
        }

        const user = await userModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                title: "Error adding invitation",
                message: "No user with such ID",
            });
        }

        // יצירת מערך החדרים עם הפרטים המלאים + סימון כתפוס
        let orderDetails = [];

        for (let item of orderRooms) {
            const room = await roomModel.findById(item._id);
            if (!room) {
                return res.status(404).json({
                    title: "Room not found",
                    message: `Room with ID ${item._id} does not exist`,
                });
            }

            room.isOccupied = true;
            await room.save();

            orderDetails.push({
                _id: room._id,
                num:room.num,
                imagePath:room.imagePath,
                name: room.name,
                price: room.price,
                quantity: item.quantity || 1
            });
        }

        // יצירת ההזמנה בפועל
        const invitation = new invitationModel({
            userId,
            orderRooms: orderDetails,
            EmailAddress,
            pay,
        });
        

        await invitation.save();

        return res.json(invitation);
    } catch (err) {
        res.status(400).json({
            title: "Error cannot add invitation",
            message: err.message,
        });
    }
};

export const delInvitation = async (req, res) => {
    try {
        const { invitationId } = req.body;
        if (!invitationId) {
            return res.status(400).json({
                title: "Missing required details",
                message: "invitationId is required",
            });
        }

        const deletedInvitation = await invitationModel.findByIdAndDelete(invitationId);
        if (!deletedInvitation) {
            return res.status(404).json({
                title: "Invitation not found",
                message: `No invitation found with ID ${invitationId}`,
            });
        }

        for (let room of deletedInvitation.orderRooms) {
            const roomToUpdate = await roomModel.findById(room._id);
            if (roomToUpdate) {
                roomToUpdate.isOccupied = false;
                await roomToUpdate.save();
            }
        }

        return res.json({
            title: "Invitation deleted",
            deletedInvitation,
        });
    } catch (err) {
        res.status(500).json({
            title: "Error deleting invitation",
            message: err.message,
        });
    }
};
