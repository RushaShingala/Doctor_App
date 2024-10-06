const { Sequelize, Op, QueryTypes, where, or, Model } = require('sequelize');
const express = require("express");
const app = express();
const bodyparser = require('body-parser');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
const db = require("../Config/db");
const commonfun = require("../Common_Function/common_fun");
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const nodemailer = require('nodemailer');
const moment = require('moment');
const { PhoneNumberUtil, PhoneNumberFormat } = require("google-libphonenumber");
const phoneUtil = PhoneNumberUtil.getInstance();
const commonfun1=require("../Common_Function/common_fun")

exports.Sign_Up = async (req, res) => {
    try {

        const { email, password } = req.body;

        const UserCheck = await db.User.findOne({
            where: {
                email: email
            }
        });

        if (UserCheck) {
            return res.status(200).json({ status: 0, message: "User Already Register!" });
        }
        else {

            const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
            const newpassword = await bcrypt.hash(password, 10);

            const isUser = await db.User.create({
                email: email,
                password: newpassword,
                otp: otp,
                is_verify: 0,
                is_account_setup: 0,
                otp_created_at: new Date()
            });

            const subject = "send otp"
            await commonfun.sendOTPByEmail(email, otp, subject);

            return res.status(200).json({ status: 1, message: "Otp Sent Your Verified Email", isUser });
        }

    } catch (error) {
        return res.status(500).json({ status: 0, message: "Internal Server Error" });

    }
}

exports.verify_otp = async (req, res) => {
    try {
        var { email, otp } = req.body;

        var check_user = await db.User.findOne({
            where: {
                email: email,
            }
        });

        if (!check_user) {
            return res.status(404).json({ status: 0, message: "The user not found" });
        }
        var user_id = check_user.id;
        var odate = check_user.otp_created_at;
        console.log(odate);
        if (check_user.otp != otp) {
            return res.status(400).json({ status: 0, message: "Invalid OTP. Please try again with the correct code." });
        }
        else {
            const currentTime = new Date();
            const otpCreationTime = new Date(check_user.otp_created_at);
            const otpExpirationTime = new Date(
                otpCreationTime.getTime() + 1 * 60 * 1000
            ); // Assuming OTP expires in 1  minutes
            if (currentTime > otpExpirationTime) {
                return res.status(400).json({ status: 0, message: "Otp has been expired" });
            }
            else {
                var vdata = await db.User.update({
                    otp: null,
                    otp_created_at: null,
                    is_verify: 1

                }, {
                    where: {
                        email: email
                    }
                });
                console.log("verify");

            }
        }
        return res.status(200).json({ status: 1, message: `Verify successfully`, });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 0, message: "Internal Server Error" });
    }
}

exports.Sign_In = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log(req.body);
        var isUser = await db.User.findOne({
            where: {
                email: email
            }
        });
        if (!isUser) {
            return res.status(400).json({ status: 0, message: "Email does't exist our records" });
        }
        var user_id = isUser.id;
        const isemail = isUser.email;
        const isMatch = await bcrypt.compare(password, isUser.password);
        if (isMatch == false) {
            return res.status(400).json({ status: 0, message: "Email or Password invalid" });
        } else if (isUser.is_verify == 0) {

            const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
            const subject = "send otp"
            await commonfun.sendOTPByEmail(email, otp, subject);

            await db.User.update({

                otp: otp,
                otp_created_at: new Date()
            },
                { where: { email: email } });
            res.status(200).json({ status: 2, message: "Otp sent to your regsiter email Successfully", otp });

        } else {

            const { device_id, device_type, device_token } = req.body;
            console.log(req.body);
            const randomDigit = Math.floor(Math.random() * 9) + 1;

            let devicedetails = await db.Token.findOne({
                where: {
                    device_id: device_id,
                }
            });
            if (!devicedetails) {
                devicedetails = await db.Token.create({
                    device_id,
                    device_type,
                    device_token,
                    userid: user_id
                });
            } else {
                devicedetails.device_type = device_type,
                    devicedetails.device_token = device_token;
                await devicedetails.save();
            }
            devicedetails.tokenVersion += randomDigit;
            await devicedetails.save();
            const usertoken = jwt.sign({
                "sub": devicedetails.id, "tokenVersion":
                    devicedetails.tokenVersion
            }, 'test');

            return res.status(200).json({ status: 1, message: "Login complete! You can now access your account", isUser, usertoken: usertoken, });
        }
    } catch (error) {
        return res.status(500).json({ status: 0, message: "Internal Server Error" });

    }
}

exports.ForgetPassword = async (req, res) => {

    try {
        const otp = `${Math.floor(1000 + Math.random() * 9000)}`;
        const { email } = req.body;
        console.log(email);

        const isUser = await db.User.findOne({
            where: {
                email: email
            }
        });
        if (!isUser) {
            return res.status(404).json({ status: 0, message: "The user not found" });
        }
        if (isUser) {
            const subject = req.body.is_flag;
            await commonfun.sendOTPByEmail(email, otp, subject);
        }
        const verify_data = await db.User.update({
            otp: otp,
            otp_created_at: new Date(),
        }, {
            where: {
                email: email
            }
        });

        return res.status(200).json({ status: 1, message: `Otp sent to your regsiter email For ${req.body.is_flag}`, otp });

    } catch (error) {
        return res.status(500).json({ status: 0, message: "Internal Server Error" });

    }
}

exports.ResetPassword = async (req, res) => {

    try {
        const { email, password } = req.body;

        const isUser = await db.User.findOne({
            where: {
                email: email
            }
        });
        if (!isUser) {
            return res.status(404).json({ status: 0, message: "The user not found" });
        }

        console.log(isUser.id)

        const reset_password = await bcrypt.hash(password, 10);
        await db.User.update(
            {
                password: reset_password,
                otp: null,
            },
            {
                where: {
                    email: email
                }
            });
        const tokens = await db.Token.findAll({
            where: {
                userid: isUser.id
            }
        });
        const randomNumber = Math.floor(1 + Math.random() * 9);
        for (let token of tokens) {
            token.tokenVersion += randomNumber;
            await token.save();
        }
        return res.status(200).json({ status: 1, message: "password reset successfully" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ status: 0, message: "Internal Server Error" });
    }
}

exports.add_doctor = async (req, res) => {
    try {
        const { name, about, specialization, slot_date, start_time, end_time } = req.body;

        const file = req.files.profile_image[0];
        const imageUrlWithExt = file.filename;
        console.log(imageUrlWithExt);

        const data = await db.Doctor.create(
            {
                name,
                about,
                specialization,
                profile_image: `uploads/profile_image/${imageUrlWithExt}`,

            })

        const slots = [];
        let currentStartTime = new Date(`${slot_date}T${start_time}`);
        const currentEndTime = new Date(`${slot_date}T${end_time}`);

        while (currentStartTime < currentEndTime) {
            const nextEndTime = new Date(currentStartTime);
            nextEndTime.setHours(nextEndTime.getHours() + 1); 


            slots.push({
                doctor_id: data.id,
                slot_date: currentStartTime.toISOString().split('T')[0], 
                start_time: currentStartTime.toTimeString().slice(0, 5), 
                end_time: nextEndTime.toTimeString().slice(0, 5),
                status: 'available'
            });


            currentStartTime.setHours(currentStartTime.getHours() + 1); 
        }

        await db.Slot.bulkCreate(slots);

        return res.status(200).json({ status: 1, message: "Doctor Added Successfully!", data });

    } catch (error) {
        return res.status(500).json({ status: 0, message: "Internal Server Error" });
    }
}


exports.get_doctors = async (req, res) => {
    try {

        const { page = 1 } = req.query;
        const limit = 10;
        const offset = (page - 1) * limit;

        const { count } = await db.Doctor.findAndCountAll({
        });

        const { rows: doctors } = await db.Doctor.findAndCountAll({
            include: [{
                model: db.Slot,
            }],
            limit: limit,
            offset: offset,
        });

        if (doctors.length === 0) {
            return res.status(404).json({ status: 0, message: "No doctors found" });
        }

        return res.status(200).json({
            status: 1,
            message: "Doctors Retrived Successfully",
            data: doctors,
            totalPages: Math.ceil(count / limit),
        });
    } catch (error) {
        return res.status(500).json({ status: 0, message: "Internal Server Error" });
    }
};

exports.add_appointment = async (req, res) => {
    try {

        const { id ,email} = req.user;
        const { doctor_id, slot_id, date, phone_no, country_code, iso_code, firstname, lastname} = req.body;

        const existingAppointment = await db.Appointment.findOne({
            where: {
                doctor_id,
                slot_id,
                date
            },
        });

        if (existingAppointment) {
            return res.status(200).json({ status: 0, message: "Doctor is not available at this time." });
        }


        try {
            var number = phoneUtil.parse(phone_no, iso_code);
        } catch (error) {
            return res.status(400).json({ Status: 0, message: "Number or ISO code not matched" });
        }

        const isValid = phoneUtil.isValidNumber(number);
        if (!isValid) {
            return res.status(400).json({ Status: 0, message: "Phone number is not correct" });
        }



        const data = await db.Appointment.create({
            doctor_id,
            user_id: id,
            slot_id,
            date
        });

        await db.User.update(
        {
            firstname,
            lastname,
            phone_no,
            country_code,
            iso_code
        },
        {
            where:{
                id:id
            }
        }
    )
    const time=await db.Slot.findOne({where:{id:slot_id}})
    const data1 = {
        email: email,
        firstname: firstname,
        lastname: lastname,
        date:date,
        start_time:time.start_time,
        end_time:time.end_time,
    };

    console.log(data1)
    await commonfun1.confirmedmail(data1)


        return res.status(200).json({
            status: 1,
            message: "Appointment Booked Successfully",
            data
        });

    } catch (error) {
        return res.status(500).json({ status: 0, message: "Internal Server Error" });
    }
}

exports.get_appointment = async (req,res)=>{
    try{
        const {id}= req.user;
        const data=await db.Appointment.findAll({
            where:{
                user_id:id
            },
            include:[
                {
                model:db.User,
                attributes:[
                    'id',
                    'firstname',

                    'lastname',
                    'email'
                 ]
                },
                {
                    model:db.Doctor,
                    attributes:['name'],
                },
                {
                        model:db.Slot

                },

        ]})



        return res.status(200).json({
            status: 1,
            message: "Appointment Retrived Successfully",
            data
        });

    }catch(error)
    {
        return res.status(500).json({ status: 0, message: "Internal Server Error" });
    }
}

exports.logout= async (req,res)=>{
    try {
        var device_id = req.token;
        console.log(device_id);
        await db.Token.destroy({
            where: { device_id }
        });

        return res.status(200).json({ status: 1, message: "You're logged out. Thanks for using our app!" });

    } catch (error) {
        return res.status(500).json({ status: 0, message: "Internal Server Error" });
    }
}

exports.cancle_appointment=async(req,res)=>{
    try{

        const {Appointment_id} = req.query;

        const isappoitment=await db.Appointment.findOne({where:{
            id:Appointment_id
        }});

        if(!isappoitment)
        {
            return res.status(400).json({
                status: 0,
                message: "Appointment Not Found",
            });
        }

        isappoitment.destroy();

        return res.status(200).json({ status: 1, message: "Your Appointment Cancelled Successfully!" });

    }catch(error)
    {
        return res.status(500).json({ status: 0, message: "Internal Server Error" });
    }
}