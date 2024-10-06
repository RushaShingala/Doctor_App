const { check, validationResult } = require('express-validator');
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const { authPlugins } = require('mysql2');
const authenticate = require('../Middleware/authenticate');


const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        if (file.fieldname === 'product_image') {
            cb(null, 'uploads/product_image');
        }  else if (file.fieldname === 'profile_image') {
            cb(null, 'uploads/profile_image');
        }else if (file.fieldname === 'business_image') {
            cb(null, 'uploads/business_image');
        }
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname.replace(/\s+/g, ""));
    }
});

const upload = multer({ storage });

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(422).json({ errors: errors.array() });
    }
    next();
};

exports.SignUp = () => {
    return [
        [
            check("email").not().isEmpty().withMessage("Email is required").isEmail().trim().escape(),
            check("password").not().isEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password must be 8 character length").
                matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
                .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
                .matches(/[0-9]/).withMessage("Password must contain at least one number")
                .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain at least one special character").trim().escape(),
        ],
        handleValidation
    ]
}



exports.Verify_Otp = () => {
    return [
        [
            check("email").not().isEmpty().withMessage("Email is required").isEmail().trim().escape(),
            check("otp").not().isEmpty().withMessage("Otp is required").trim().escape(),
        ],
        handleValidation

    ]
}

exports.ForgetPassword = () => {
    return [
        [
            check("email").not().isEmpty().withMessage("Email is required").isEmail().trim().escape(),
            check("is_flag").not().isEmpty() .withMessage("Flag is required").isIn(['Forget Password', 'Resend Otp']).withMessage("Flag must be either 'Forget Password' or 'Resend Otp'").trim().escape(),
        ],
        handleValidation
    ]
}

exports.SignIn = () => {
    return [
        [
            check("email").not().isEmpty().withMessage("Email is required").isEmail().trim().escape(),
            check("password").not().isEmpty().withMessage("password is required").trim().escape(),
            check("device_id").not().isEmpty().withMessage("device_id is required").trim().escape(),
            check("device_type").not().isEmpty().withMessage("device_type is required").trim().escape(),
        ],
        handleValidation

    ]
}

exports.ResetPassword = () => {
    return [
        [
            check("email").not().isEmpty().withMessage("Email is required").isEmail().trim().escape(),
            check("password").not().isEmpty().withMessage("Password is required").isLength({ min: 8 }).withMessage("Password must be 8 character length").
                matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
                .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
                .matches(/[0-9]/).withMessage("Password must contain at least one number")
                .matches(/[!@#$%^&*(),.?":{}|<>]/).withMessage("Password must contain at least one special character").trim().escape(),
        ],
        handleValidation

    ]
}


exports.add_doctor = () => {
    return [
        upload.fields([{ name: "profile_image" }]),
        [
            check("profile_image").custom((value, { req }) => {
                if (!req.files || !req.files.profile_image) {
                    throw new Error('Image is required');
                }
                if (req.files.profile_image.length > 1) {
                    req.files.profile_image.forEach(element => {
                        fs.unlinkSync(element.path);
                    });
                    throw new Error('Maximum 1 images allowed');
                }
                return true;
            }),
        ],
        handleValidation
    ]
}

exports.get_doctor = () => {
    return [
        [
        check("page").not().isEmpty().withMessage("Page is required").trim().escape(),
        ],
        handleValidation,
        authenticate
    ]
}

exports.add_appointment = () => {
    return [
        [
            check("doctor_id").not().isEmpty().withMessage("Doctor Id is required").trim().escape(),
            check("date").not().isEmpty().withMessage("Date is required").trim().escape(),
            check("slot_id").not().isEmpty().withMessage("Time is required").trim().escape(),
            check("country_code").not().isEmpty().withMessage("Country Code is required").trim().escape(),
            check("iso_code").not().isEmpty().withMessage("Iso Code is required").trim().escape(),
            check("phone_no").not().isEmpty().withMessage("Phone No is required").trim().escape(),
            check("firstname").not().isEmpty().withMessage("Firstname is required").trim().escape(),
            check("lastname").not().isEmpty().withMessage("Lastname is required").trim().escape(),
        ],
        handleValidation,
        authenticate
    ]
}
