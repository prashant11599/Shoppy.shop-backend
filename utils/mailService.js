const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
import { EMAIL,PASSWORD } from '../config';

export const sendEmail = (userEmail) => {

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
            intro: "Your have successsfully register to my webapp ",
            table : {
                data : [
                    {
                        item : "congratulations you have successfully created account ",
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
        subject: " new account created",
        html: mail
    }

    transporter.sendMail(message);
        
}


