import bcrypt from "bcrypt";
import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";

export const register = async (req, res) => {
    try {

        const pass = req.body.password
        const salt = await bcrypt.genSalt(10)
        const passwordHash = await bcrypt.hash(pass, salt)

        const doc = new UserModel({
            fullName: req.body.fullName,
            email: req.body.email,
            password: passwordHash,
            avatarUrl: req.body.avatarUrl,
        })

        const user = await doc.save()
        const token = jwt.sign({
                _id: user._id
            }, 'secret123', {
                expiresIn: '30d'
            },
        )

        const { password, ...userData} = user._doc

        res.json({...userData, token})
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Register failed'
        })
    }
}

export const login = async (req, res) => {
    try {
        const user = await UserModel.findOne({email: req.body.email});
        if(!user) {
            return res.status(404).json({
                message: 'email is invalid'
            })
        }

        const isInvalidPass = await bcrypt.compare(req.body.password, user._doc.password)

        if(!isInvalidPass) {
            return res.status(400).json({
                message: 'email or pass is invalid'
            })
        }

        const token = jwt.sign({
                _id: user._id
            }, 'secret123', {
                expiresIn: '30d'
            },
        )

        const { password, ...userData} = user._doc

        res.json({...userData, token})
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'Login failed'
        })
    }
}

export const getMe = async (req, res) => {
    try {
        const user = await UserModel.findById(req.userId)

        if(!user){
            return res.status(404).json({
                message: 'user not found'
            })
        }
        const { password, ...userData} = user._doc

        res.json(userData)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'no access'
        })
    }
}