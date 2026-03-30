var express = require("express");
var router = express.Router();
let mongoose = require('mongoose');
let { checkLogin } = require('../utils/authHandler');
let messageModel = require('../schemas/messages');

// Lấy message cuối cùng của mỗi user mà user hiện tại nhắn tin hoặc user khác nhắn cho user hiện tại
router.get('/', checkLogin, async function(req, res, next) {
    try {
        let currentUserID = new mongoose.Types.ObjectId(req.userId);

        let messages = await messageModel.aggregate([
            {
                $match: {
                    $or: [{ from: currentUserID }, { to: currentUserID }]
                }
            },
            {
                $sort: { createdAt: -1 }
            },
            {
                $group: {
                    _id: {
                        $cond: {
                            if: { $eq: ["$from", currentUserID] },
                            then: "$to",
                            else: "$from"
                        }
                    },
                    lastMessage: { $first: "$$ROOT" }
                }
            },
            {
                $lookup: {
                    from: "users", // name of the users collection
                    localField: "_id",
                    foreignField: "_id",
                    as: "partner"
                }
            },
            {
                $unwind: {
                    path: "$partner",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    "partner.password": 0,
                    "partner.forgotPasswordToken": 0,
                    "partner.forgotPasswordTokenExp": 0
                }
            },
            {
                $sort: { "lastMessage.createdAt": -1 }
            }
        ]);

        res.send(messages);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Lấy toàn bộ message from: user hiện tại, to :userID và from: userID và to:user hiện tại
router.get('/:userID', checkLogin, async function(req, res, next) {
    try {
        let userID = req.params.userID;
        let currentUserID = req.userId;

        // validate object ids
        if (!mongoose.Types.ObjectId.isValid(userID)) {
             return res.status(400).send({ message: "Invalid userID" });
        }

        let messages = await messageModel.find({
            $or: [
                { from: currentUserID, to: userID },
                { from: userID, to: currentUserID }
            ]
        }).sort({ createdAt: 1 });

        res.send(messages);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

// Post nội dung
router.post('/', checkLogin, async function(req, res, next) {
    try {
        let { type, content, to } = req.body;
        let currentUserID = req.userId;

        if (!['text', 'file'].includes(type) || !content || !to) {
            return res.status(400).send({ message: "Invalid payload: type must be 'text' or 'file', content and to are required." });
        }

        if (!mongoose.Types.ObjectId.isValid(to)) {
             return res.status(400).send({ message: "Invalid 'to' userID" });
        }

        let newMessage = new messageModel({
            from: currentUserID,
            to: to,
            contentMessage: {
                type: type,
                content: content
            }
        });

        await newMessage.save();
        res.status(201).send(newMessage);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
});

module.exports = router;
