const {validationResult} = require('express-validator/check');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const Admin = require('../models/admin');

const Feedback = require('../models/feedback');

const Notification = require('../models/notification');

const User = require('../models/user');

const mongoose = require('mongoose');

const Speakeasy = require('speakeasy');
const constants = require("constants");

const ObjectId = mongoose.Types.ObjectId;

exports.login = (req,res,next) =>{
    const email = req.body.email;
    const password = req.body.password;
    let loadAdmin;

    Admin.findOne({email:email})
        .then(user =>{
            if(!user){
                const error = new Error('Admin not found!');
                error.statusCode = 404;
                throw error;
            }
            loadAdmin = user;
            return bcrypt.compare(password,user.password);
        })
        .then(isEqual =>{
            if (!isEqual){
                const error = new Error('Incorrect Password!');
                error.statusCode = 401;
                throw error;
            }
            // const token = jwt.sign({
            //         email:loadAdmin.email,
            //         adminId:loadAdmin._id.toString()
            //     },
            //     'Smart-Pet-Feeder-2021-Admin',
            //     {expiresIn: '1h'}
            // );
            //
            // res.status(201).json({
            //     idToken:token,
            //     expiresIn:"3600",
            //     userId: loadAdmin._id.toString()
            // });
            const secret = Speakeasy.generateSecret({length:20});
            loadAdmin.secret = secret.base32;
            loadAdmin.mobileNumber ="0768699448";
            loadAdmin.name = "Shenal Admin";
            return loadAdmin.save();
        })
        .then(validationResult =>{

            const otp = Speakeasy.totp({
                secret:validationResult.secret,
                encoding:"base32",

            })
            console.log(otp);
            const oneTimeToken = jwt.sign({
                adminId:validationResult._id
                },
                'One-Time-Token',
                {expiresIn: '300s'}
            )
            res.status(200).json({message:"Secret saved in database",oneTimeToken});
        })
        .catch(err=>{
            next(err);
        })
}

exports.postVerifyLogin = (req,res,next)=>{
    const adminId = req.adminId;
    const otp = req.body.otp;
    Admin.findById(adminId)
        .then(admin=>{
            if (!admin){
                const error = new Error("Admin not found");
                error.statusCode =404;
                throw error;
            }

            const verified = Speakeasy.totp.verify({
                secret:admin.secret,
                encoding:"base32",
                token:otp,
                window:2
            })


            if (verified){
                const token = jwt.sign({
                        email:admin.email,
                        adminId:admin._id.toString()
                    },
                    'Smart-Pet-Feeder-2021-Admin',
                    {expiresIn: '1h'}
                );
                res.status(200).json({token:token,message:"Successfully login"});
            }
            else{
                res.status(400).json({message:"Wrong input"});
            }

        })
        .catch(err=>{
            next(err);
        })
}


exports.postActiveStatus = (req,res,next) =>{
    const userId = new ObjectId(req.body.userId);
    const isActive = req.body.isActive;

    User.findById({_id:userId})
        .then(user =>{
            if (!user){
                const error = new Error("User Not Found!");
                error.statusCode = 404;
                throw error;
            }
            user.isActive = isActive;
            return user.save();
        })
        .then(result =>{
            res.status(200).json({message:"Successful",userId:userId});
        })
        .catch(err => {
            next(err);
        })
}


exports.postReply = (req,res,next)=>{
    const feedbackId = req.body.feedbackId;
    const message = req.body.message;
    const title = req.body.title;
    const userId = req.body.userId;
    const creator = req.body.adminId;

    const notification = new Notification({
        userId:userId,
        title:title,
        message:message,
        creator:creator,
        isRead:false,
        date_time: new Date()

    });

    Feedback.findById(feedbackId)
        .then(feedback =>{
            feedback.reply = message;
            feedback.isHandle = true;
            return feedback.save();
        })
        .then(result =>{
            return notification.save();
        })
        .then(result=>{
            User.findById(userId)
                .then(user=>{

                    user.notifications.push(result._id);
                    return user.save();
                })
        })
        .then(result =>{
            res.status(201).json({message:"Message sent"});
        })
        .catch(err=>next(err))
}

exports.getFeedbacks = (req,res,next) =>{
    Feedback.find({ })
        .populate('userId')
        .then(result =>{
            const feedbacks = result.map(feedback =>{
                return {
                    _id:feedback._id,
                    userId:feedback.userId._id,
                    email:feedback.userId.email ,
                    title:feedback.title,
                    message:feedback.message,
                    isHandle:feedback.isHandle,
                    date_time:feedback.date_time,
                    reply:feedback.reply
                }
            })
            res.status(200).json(feedbacks);
        })
        .catch(err =>
        next(err)
        )
}



exports.getUsers = (req,res,next) =>{
    User.find({})
        .then(users =>{
            const editedUsers = users.map(user =>{
                return {userId: user._id,
                    name:user.name,
                    email:user.email,
                    isActive:user.isActive};
            })
            res.status(200).json(editedUsers);
        })
        .catch(err => next(err))
}

exports.getUsersDetails = (req,res,next) =>{
    User.find({})
        .then(users =>{
            const userCount = users.length;
            let activeUsers  = 0;
            users.forEach(user =>{
                if (user.isActive){
                    activeUsers++;
                }
            })

            res.status(200).json({userCount:userCount,activeUsers:activeUsers});
        })
        .catch(err=>{
            next(err)
        })
}