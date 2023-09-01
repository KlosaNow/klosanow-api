import { infobip } from "./otpService";

const sendEmail = async (email: string, otp: number) => {
    return await infobip.channels.email.send({
        to: email,
        from: "anselemcloud@gmail.com",
        text: `Here is your one-time OTP: ${otp}`,
        subject: "Testing",
    });
};

export default sendEmail;
