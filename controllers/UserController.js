import { userotpModel, userRegisterModel } from '../models/userModel.js';
import bcrypt from 'bcrypt';
import { registerValidation, loginValidation } from './UserValidation.js';
import CustomErrorHandler from '../utils/customErrorHandler.js';
import Jwtservice from '../utils/jwtService.js';
import { HASH_SECRET, REFRESH_JWT_SECRET } from '../config/index.js';
import { sendEmail } from '../utils/mailService.js';
import crypto from 'crypto';
import { sendEmailotp } from '../utils/mailServiceOtp.js';

// code for registration of new user
export const userRegistration = async (req, res, next) => {
    const { firstName, lastName, userName, email, phone, password, confirmPassword } = req.body;
    if (!userName || !email || !firstName || !lastName || !phone || !password || !confirmPassword) {
        return next(CustomErrorHandler.emptyField("all fields are required"));
    }
    try {
        const exist = await userRegisterModel.exists({ email:email});
        if (exist) {
            return next(CustomErrorHandler.alreadyExist('This email is already taken.'));
        }
        const { error } = registerValidation(req.body);
        if (error) {
            return next(error);
        }

    } catch (err) {
        return next(err);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedpassword = await bcrypt.hash(password, salt);

    try {
        const newUser = new userRegisterModel({
            firstName,
            lastName,
            email,
            userName,
            phone,
            password: hashedpassword,
        });

        await newUser.save();

        const access_token = Jwtservice.sign({ _id: newUser._id });
        const refresh_token = Jwtservice.sign({ _id: newUser._id }, '1d', REFRESH_JWT_SECRET);

        try {
            await sendEmail(email);
        } catch (error) {
            return next(error);
        }

        res.cookie('jwt_access', access_token, {
            httpOnly: true,
            expires: new Date(Date.now() + (1000 * 15 * 60 * 60 * 24)),
        })
        res.cookie('jwt_refresh', refresh_token, {
            httpOnly: true,
            expires: new Date(Date.now() + (1000 * 15 * 60 * 60 * 24)),
        })
        res.status(201).send({ "id": newUser._id, "status": "success", "message": "Registration Success,please check your email", });

    } catch (error) {
        return next(error);
    }
}

// code for login of existing user
export const userLogin = async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(CustomErrorHandler.emptyField("all fields are required"));
    }
    const { error } = loginValidation(req.body);
    if (error) {
        return next(error);
    }
    try {
        // console.log(email);
        const user = await userRegisterModel.findOne({ email: email });
        // console.log(user);
        if (!user) {
            return next(CustomErrorHandler.wrongCredentials());
        }
        const match = await bcrypt.compare(req.body.password, user.password);
        if (!match) {
            return next(CustomErrorHandler.wrongCredentials());
        }
        const access_token = Jwtservice.sign({ _id: user._id });
        const refresh_token = Jwtservice.sign({ _id: user._id }, '1d', REFRESH_JWT_SECRET);

        res.cookie('jwt_access', access_token, {
            httpOnly: true,
            expires: new Date(Date.now() + (1000 * 15 * 60 * 60 * 24)),
        })

        res.cookie('jwt_refresh', refresh_token, {
            httpOnly: true,
            expires: new Date(Date.now() + (1000 * 15 * 60 * 60 * 24)),
        })
        res.status(201).send({ "id": user._id, "status": "success", "message": "login Successful" });

    } catch (err) {
        return next(err);
    }
}
export const forgotPassword = async (req, res, next) => {
    const { email } = req.body;
    // console.log(email);
    try {
        const exist = await userRegisterModel.exists({ email: email });
        if (!exist) {
            return next(CustomErrorHandler.notFound('you are not a valid user. Please Register'));
        }
    } catch (error) {
        return next(error);
    }
    const otp = crypto.randomInt(1000, 9999);
    const expires = Date.now() + (1000 * 60 * 2);
    const data = `${email}.${otp}.${expires}`;
    const hash = crypto.createHmac('sha256', HASH_SECRET).update(data).digest('hex');
    try {
        sendEmailotp(email, otp);
    } catch (error) {
        return next(error);
    }
    res.status(200).json({ email, message: "otp is send to your mail", hash: `${hash}.${expires}` });
}
export const VerifyPassword = async (req, res, next) => {
    const { new_password, otp, hash,email} = req.body;
    // console.log(req.body);
    if (!otp || !new_password || !hash) {
        return next(CustomErrorHandler.emptyField("all fields are required"));
    }
    const [hashedotp, expires] = hash.split('.');
    if (Date.now() > expires) {
        return next(CustomErrorHandler.otpExpired());
    }
    const data = `${email}.${otp}.${expires}`;
    const newhash = crypto.createHmac('sha256', HASH_SECRET).update(data).digest('hex');
    if (newhash === hashedotp) {
        try {
            // console.log(email);
            const user = await userRegisterModel.findOne({ email: email });
            // console.log(user);
            if (!user) {
                return next(CustomErrorHandler.wrongCredentials());
            }
            const salt = await bcrypt.genSalt(10);
            const hashedpassword = await bcrypt.hash(new_password, salt);
            const access_token = Jwtservice.sign({ _id: user._id });
            const refresh_token = Jwtservice.sign({ _id: user._id }, '1d', REFRESH_JWT_SECRET);
            await userRegisterModel.findByIdAndUpdate(user._id, { password: hashedpassword });

            res.cookie('jwt_access', access_token, {
                httpOnly: true,
                expires: new Date(Date.now() + (1000 * 15 * 60 * 60 * 24)),
            })
            res.cookie('jwt_refresh', refresh_token, {
                httpOnly: true,
                expires: new Date(Date.now() + (1000 * 15 * 60 * 60 * 24)),
            })

            res.status(201).send({ "id": user._id, "status": "success", "message": "reset password successfully" });

        } catch (error) {
            return next(error);
        }
    } else {
        return next(CustomErrorHandler.invalidOtp());
    }
}
// // code for profile of a user
export const userInfo = async (req, res, next) => {
    try {
        const User = await userRegisterModel.findOne({ _id: req.user._id }).select('-password -updatedAt -__v');
        if (!User) {
            return next(CustomErrorHandler.notFound());
        }
        res.json(User);
    } catch (error) {
        return next(error);
    }
}


// code for logout of a user
export const userLogout = async (req, res, next) => {
    try {
        const cookie1 = req.cookies['jwt_access'];
        const cookie2 = req.cookies['jwt_refresh'];
        res.clearCookie('jwt_refresh');
        res.clearCookie('jwt_access');
    } catch (error) {
        return next(new Error("something went wrong "));
    }
    res.json({ status: "logout successful" })
}

// code for refreshing of the access token
export const tokenRefresh = async (req, res, next) => {
    const cookie = req.cookies['jwt_refresh'];
    //    if (cookie === undefined) return next(CustomErrorHandler.unAuthorized("unauthrized user"))
    try {
        let userId;
        try {
            const { _id } = Jwtservice.verify(cookie, REFRESH_JWT_SECRET);
            userId = _id;
            //    res.clearCookie('jwt_refresh');
        } catch (err) {
            return next(CustomErrorHandler.unAuthorized('Invalid refresh token'));
        }

        const user = await userRegisterModel.findOne({ _id: userId });
        if (!user) {
            return next(CustomErrorHandler.unAuthorized('No user found!'));
        }
        const access_token = Jwtservice.sign({ _id: user._id });
        const refresh_token = Jwtservice.sign({ _id: user._id }, '1d', REFRESH_JWT_SECRET);


        res.cookie('jwt_access', access_token, {
            httpOnly: true,
            expires: new Date(Date.now() + (1000 * 15 * 60 * 60 * 24)),
        })
        res.cookie('jwt_refresh', refresh_token, {
            httpOnly: true,
            expires: new Date(Date.now() + (1000 * 15 * 60 * 60 * 24)),
        })

        res.status(201).send({ "id": user._id, "status": "success", "message": "token generated successfully" });


    } catch (err) {
        return next(new Error('Something went wrong ' + err.message));
    }

}


// otp system for login and logout

export const sendOtp = async (req, res, next) => {
    const { phone, email } = req.body;
    if (!phone || !email) {
        return next(CustomErrorHandler.notFound());
    }
    const otp = crypto.randomInt(1000, 9999);
    const expires = Date.now() + (1000 * 60 * 2);
    const data = `${phone}.${otp}.${expires}`;
    const hash = crypto.createHmac('sha256', HASH_SECRET).update(data).digest('hex');

    try {
        sendEmailotp(email, otp);
    } catch (error) {
        return next(error);
    }
    res.status(200).json({ phone, email, message: "otp is send to your mail", hash: `${hash}.${expires}` });
}

export const verifyOtp = async (req, res, next) => {
    const { otp, hash, phone, email } = req.body;
    if (!phone || !hash || !otp) {
        return next(CustomErrorHandler.emptyField("all fields are required"));
    }
    const [hashedotp, expires] = hash.split('.');
    if (Date.now() > expires) {
        return next(CustomErrorHandler.otpExpired());
    }
    const data = `${phone}.${otp}.${expires}`;
    const newhash = crypto.createHmac('sha256', HASH_SECRET).update(data).digest('hex');
    if (newhash === hashedotp) {
        try {
            let user = await userotpModel.findOne({ email: email });
            if (!user) {
                user = new userotpModel({
                    phone,
                    email
                });
                await user.save();
            }
            const access_token = Jwtservice.sign({ _id: user._id });
            const refresh_token = Jwtservice.sign({ _id: user._id }, '1d', REFRESH_JWT_SECRET);

            res.cookie('jwt_access', access_token, {
                httpOnly: true,
                expires: new Date(Date.now() + (1000 * 15 * 60 * 60 * 24)),
            })
            res.cookie('jwt_refresh', refresh_token, {
                httpOnly: true,
                expires: new Date(Date.now() + (1000 * 15 * 60 * 60 * 24)),
            })

            res.status(200).send({ "status": "success", "message": "welcome to the website" });

        } catch (error) {
            return next(error);
        }
    } else {
        return next(CustomErrorHandler.invalidOtp());
    }
}


