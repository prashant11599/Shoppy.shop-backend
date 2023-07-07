const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
import { EMAIL,PASSWORD } from '../config';

export const sendEmailotp= (userEmail,otp) => {

    let config = {
        service : 'gmail',
        auth : {
            user:EMAIL,
            pass: PASSWORD
        }
    }
    let transporter = nodemailer.createTransport(config);
    let MailGenerator = new Mailgen({
        theme: "default",
        product : {
            name: "Mailgen",
            link : 'https://mailgen.js/'
        }
    })

    let response = {
        body: {
            name :"user",
            intro: "Otp for reset-password",
            table : {
                data : [
                    {
                        item : `one time otp to reset-password ${otp} `,
                    }
                ]
            },
            outro: "Looking forward to explore the app"
        }
    }

    let mail = MailGenerator.generate(response)

    let message = {
        from : EMAIL,
        to : userEmail,
        subject: "account login",
        html: mail
    }

    transporter.sendMail(message);
        
}


