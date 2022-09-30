import PostModel from "../models/Post.js";

export const getLastTags = async (req, res) => {
    try {
        const posts = await PostModel.find().limit(5).exec()

        const tags = posts.map(obj => obj.tags).flat().slice(0, 5)

        res.json(tags)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'failed to get tags'
        })
    }
}

export const getAll = async (req, res) => {
    try {
        const posts = await PostModel.find().sort('-createdAt').populate('user').exec()

        res.json(posts)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'failed to get posts'
        })
    }
}

export const getAllByRating = async (req, res) => {
    try {
        const posts = await PostModel.find().sort('-viewsCount').populate('user').exec()

        res.json(posts)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'failed to get posts'
        })
    }
}

export const remove = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndDelete({
            _id: postId
        }, (err, doc) => {
            if(err) {
                console.log(err)
                return res.status(500).json({
                    message: 'failed to remove post'
                })
            }

            if(!doc) {
                console.log(err)
                return res.status(404).json({
                    message: 'post not found'
                })
            }

            res.json({
                success: true
            })
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'failed to get posts'
        })
    }
}

export const getOne = async (req, res) => {
    try {
        const postId = req.params.id;

        PostModel.findOneAndUpdate(
            {
                _id: postId
            },
            {
                $inc: {viewsCount: 1}
            },
            {
                returnDocument: 'after'
            },
            (err, doc) => {
                if (err) {
                    console.log(err)
                    return res.status(500).json({
                        message: 'failed to get post'
                    })
                }

                if(!doc) {
                    return res.status(404).json({
                        message: 'post not found'
                    })
                }

                res.json(doc)
            }
        ).populate('user')
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'failed to get posts'
        })
    }
}

export const create = async (req, res) => {
    try {
        const doc = new PostModel({
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        })

        const post = await doc.save();
        res.json(post)
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'failed to create post '
        })
    }
}

export const update = async (req, res) => {
    try {
        const postId = req.params.id;

        await PostModel.updateOne({
            _id: postId
        }, {
            title: req.body.title,
            text: req.body.text,
            imageUrl: req.body.imageUrl,
            tags: req.body.tags.split(','),
            user: req.userId,
        })
        res.json({
            success : true
        })
    } catch (e) {
        console.log(e)
        res.status(500).json({
            message: 'failed to update post'
        })
    }
}