import express from 'express'
import mongoose from "mongoose";
import {loginValidation, postCreateValidation, registerValidation} from "./validations/validation.js";
import {PostController, UserController, CommentsController} from './controlers/index.js'
import multer from 'multer'
import cors from 'cors'
import {checkAuth, handleValidationErrors} from "./utils/index.js";

const DB_URL = `mongodb+srv://vizantium:qwerty2002@cluster0.5fnlez0.mongodb.net/blog?retryWrites=true&w=majority`


mongoose
    .connect(process.env.MONGODB_URI)
    .then(() => console.log('DB ok'))
    .catch((err) => console.log('DB error', err))

const app = express()

const storage = multer.diskStorage({
    destination: (_, __, cb) => {
        cb(null, 'uploads')
    },
    filename: (_, file, cb) => {
        cb(null, file.originalname)
    }
});

const upload = multer({ storage })

app.use(express.json())
app.use(cors())
app.use('/uploads', express.static('uploads'))


app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
    res.json({
        url: `/uploads/${req.file.originalname}`
    })
})

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login)
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register)
app.get('/auth/me', checkAuth, UserController.getMe)

app.get('/tags', PostController.getLastTags)

app.get('/posts', PostController.getAll)
app.get('/posts/sortByRating', PostController.getAllByRating)
app.get('/posts/tags', PostController.getLastTags)
app.get('/posts/:id', PostController.getOne)
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create)
app.delete('/posts/:id', checkAuth, PostController.remove)
app.patch('/posts/:id', checkAuth, postCreateValidation, handleValidationErrors, PostController.update)

app.get('/comments/:id', CommentsController.getComments)
app.post('/comments', checkAuth, CommentsController.create)



app.listen(process.env.PORT || 4444, (err) => {
    if (err) {
        return console.log(err);
    }

    console.log('Server OK');
});