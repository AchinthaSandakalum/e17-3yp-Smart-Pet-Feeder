const express = require("express");

const { body } = require("express-validator/check");

const userControllers = require("../controllers/authUser");

const User = require("../models/user");

const isAuthUser = require("../middleware/is-auth-user");

const isAuth2faUser = require("../middleware/is-auth-2fa-user");

const router = express.Router();


router.put('/signup',
    [
        body('email')
            .isEmail()
            .withMessage('Please enter a valid email!')
            .custom((value,{req}) =>{
                   return  User.findOne({email:value})
                        .then(userDoc =>{
                                if (userDoc){
                                        return Promise.reject('E-mail already in use')
                                }
                        })
            })
            .normalizeEmail(),
        body('password').trim()
            .isLength({min: 6}).withMessage('Password is too short'),
        body('name').trim()
            .not().isEmpty().withMessage('name field cannot be empty'),
        body('confirmPassword').trim()
            .custom((value,{req})=>{
                if (value !== req.body.password){
                    throw new Error('Passwords has to match');
                }
                return true;
            }),
        body('phoneNumber')
            .custom((value,{req}) =>{
                const mobile_regex = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
                if(!value.match(mobile_regex)){
                    throw new Error('Incorrect phone number!')
                }
                return true;
            })

],userControllers.signUp);


router.post('/login',userControllers.login);

router.post('/token',userControllers.postGetToken);

router.post('/post_schedules' ,[
    body("title").not().isEmpty().withMessage("Title Cannot be empty!"),
    body("date_time").not().isEmpty().withMessage("Date and time undefined")
], isAuthUser, userControllers.postSchedule);

router.post('/delete_schedule',isAuthUser,userControllers.postDeleteSchedule);

router.post('/post_feedback',isAuthUser,userControllers.postFeedback);

router.post('/post_markRead',isAuthUser,userControllers.postMarkedAsRead);

router.post('/verifyLogin',isAuth2faUser,userControllers.postVerifyLogin);


//=================================================== GET ==============================================================


router.get('/get_status',isAuthUser,userControllers.getStatus);

router.get('/get_schedules',isAuthUser,userControllers.getActiveSchedules);

router.get('/get_history',isAuthUser,userControllers.getScheduleHistory);

router.get('/get_notifications',isAuthUser,userControllers.getNotifications);


module.exports = router;

