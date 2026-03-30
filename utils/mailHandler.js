const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 25,
    secure: false, // Use true for port 465, false for port 587
    auth: {
        user: "afb860a426d68e",
        pass: "d3964b7baf52ff",
    },
});

module.exports = {
    sendMail: async function (to, url) {
        const info = await transporter.sendMail({
            from: 'admin@heha.com',
            to: to,
            subject: "Reset Password email",
            text: "click vao day de reset password", // Plain-text version of the message
            html: "click vao <a href=" + url + ">day</a> de reset password", // HTML version of the message
        });
    },
    sendPasswordMail: async function (to, username, password) {
        const info = await transporter.sendMail({
            from: 'admin@heha.com',
            to: to,
            subject: "Mật khẩu Của Bạn Được Khởi Tạo",
            text: `Xin chào ${username}, Mật khẩu của bạn là: ${password}`, // Plain-text version of the message
            html: `<p>Xin chào <strong>${username}</strong>,</p><p>Mật khẩu của bạn là: <strong>${password}</strong></p><p>Vui lòng đăng nhập và bảo mật thông tin.</p>`, // HTML version of the message
        });
    }
}