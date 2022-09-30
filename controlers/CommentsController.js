import CommentsModel from "../models/Comments.js";


export const create = async (req, res) => {
    try {
        const doc = new CommentsModel({
            id: req.body.id,
            text: req.body.text,
            avatarUrl: req.body.avatarUrl,
            fullName: req.body.fullName,
        })

        const comment = await doc.save();
        res.json(comment)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'failed to create post '
        })
    }
}

export const getComments = async (req, res) => {
    try {
        const commentId = req.params.id
        console.log(commentId)
       const comments = await CommentsModel.find({id: `${commentId}`})
        res.json(comments)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'failed to get comments'
        })
    }
}