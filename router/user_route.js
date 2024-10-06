const express = require('express');
const router = express.Router();
const userController = require('../Controller/user_controller')
const { check, validationResult } = require('express-validator');
const authenticate = require("../Middleware/authenticate");
const validation= require("../validation/user_validation");




router.post("/Sign_Up",validation.SignUp(),userController.Sign_Up);

router.post("/verify_otp",validation.Verify_Otp(),userController.verify_otp)

router.post("/Sign_In",validation.SignIn(),userController.Sign_In)

router.post("/ForgetPassword",validation.ForgetPassword(),userController.ForgetPassword)

router.post("/ResetPassword",validation.ResetPassword(),userController.ResetPassword)

router.post("/add_doctor",validation.add_doctor(),userController.add_doctor)

router.get("/get_doctors",validation.get_doctor(),userController.get_doctors)

router.post("/add_appointment",validation.add_appointment(),userController.add_appointment)

router.get("/get_appointment",authenticate,userController.get_appointment)

router.post("/logout",authenticate,userController.logout)

router.delete("/cancle_appointment",userController.cancle_appointment)

module.exports = router 