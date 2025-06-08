import { userModel } from "../models/user.js";
import { jwtt } from "../Utils/generateToken.js";
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config(); // טעינת משתני סביבה
// res.json(process.env.SECRET_KEY)

export const getAllUsers = async (req, res) => {
    try {
        let data = await userModel.find().select('-password');
        res.json(data);
    } catch (err) {
        console.log("err", err);
        res.status(400).json({ title: "error cannot get all", message: err.message });
    }
};

export const addUserSignUp = async (req, res) => {
    const { phone, email, username, password } = req.body;
    if (!phone || !email || !username || !password)
        return res.status(400).json({ title: "missing data", message: "All fields are required" });

    try {
        let existingUser = await userModel.findOne({ $or: [ { username }] });
        if (existingUser) {
            return res.status(409).json({ title: "User already exists", message: "Username already taken" });
        }

        let hashedPassword = await bcrypt.hash(password, 10);
        let newUser = new userModel({ ...req.body, password: hashedPassword });
        let data = await newUser.save();
        console.log(data)
        console.log(process.env.SECRET_KEY)
        await data.save();
        data.token = jwtt(data);
        let { username:xxx, _id, token, role:rrr,password:sss, ...x } = data;
        return res.json({ role:rrr, username:xxx, _id, token });
    } catch (err) {
        console.log("err", err);
        res.status(400).json({ title: "error cannot add", message: err.message });
    }
};

export const getUserByUserNamePasswordLogin = async (req, res) => {
    try {
        let { username, password } = req.body;
        if (!username || !password)
            return res.status(404).json({ title: "missing username or password", message: "missing details" });

        let user = await userModel.findOne({ username }).select('+password');
        if (!user)
            return res.status(404).json({ title: "cannot login", message: "no user with such details" });

        let isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(404).json({ title: "cannot login", message: "wrong password" });

        const token = jwtt(user);
        
        res.json({
            _id: user._id,
            username: user.username,
            email: user.email,
            role: user.role,
            token: token
        });
    } catch (err) {
        console.log("err", err);
        res.status(400).json({ title: "error cannot login", message: err.message });
    }
};


export const update = async (req, res) => {
    let { id } = req.params;

    if (req.body.password && req.body.password.length < 2)
        return res.status(404).json({ title: "wrong paswword", message: "wrong data" })
    try {

        let data = await userModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!data)
            return res.status(404).json({ title: "error cannot update by id", message: "not valid  id parameter found" })
        res.json(data);
    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot update by id", message: err.message })
    }

}
export const getUserById = async (req, res) => {

    let { id } = req.params;
    try {

        let data = await userModel.findById(id).select('-password');

        if (!data)

            return res.status(404).json({ title: "error cannot get by id", message: "not valid  id parameter found" })
        res.json(data);
    } catch (err) {
        console.log("err");
        res.status(400).json({ title: "error cannot get by id", message: err.message })
    }
}

export const updateUserPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    if (!newPassword)
        return res.status(400).json({ title: "missing data", message: "New password is required" });

    try {
        let user = await userModel.findOne({ email });
        if (!user) return res.status(404).json({ title: "user not found", message: "No user with this email" });

        user.password = await bcrypt.hash(newPassword, 10);
        let updatedUser = await user.save();
        res.json(updatedUser);
    } catch (err) {
        console.log("err", err);
        res.status(400).json({ title: "error", message: err.message });
    }
};
