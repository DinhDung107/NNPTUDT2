require('dotenv').config();
const xlsx = require('xlsx');
const nodemailer = require('nodemailer');
const crypto = require('crypto');

// 1. Hàm tạo password ngẫu nhiên 16 ký tự
function generateRandomPassword() {
  return crypto.randomBytes(8).toString('hex'); // 16 ký tự phân giải hệ thập lục phân
}

// 2. Cấu hình Nodemailer với Mailtrap
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS
  }
});

// 3. Đọc dữ liệu từ file Excel
async function processUsers() {
  try {
    const workbook = xlsx.readFile('user (1).xlsx');
    const sheetName = workbook.SheetNames[0];
    const sheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(sheet);

    console.log(`Tìm thấy ${data.length} người dùng trong file Excel.`);

    // Duyệt qua từng người dùng
    for (const row of data) {
      // Tuỳ thuộc vào cấu trúc file Excel mà trường có thể viết hoa hoặc viết thường
      const username = row.username || row.Username || row.USERNAME;
      const email = row.email || row.Email || row.EMAIL;

      if (!username || !email) {
         console.log('Bỏ qua dòng thiếu username hoặc email:', row);
         continue;
      }

      const password = generateRandomPassword();

      // Ở đây bạn có thể thêm logic lưu User vào cơ sở dữ liệu nếu có
      // db.users.insert({ username, email, password })

      console.log(`Đang gửi email cho: ${email} (User: ${username})`);

      // 4. Gửi email
      const mailOptions = {
        from: '"Hệ thống Admin" <admin@example.com>',
        to: email,
        subject: "Thông tin tài khoản đăng nhập",
        text: `Xin chào ${username},\n\nTài khoản của bạn đã được tạo.\n\nUsername: ${username}\nPassword: ${password}\n\nVui lòng bảo mật thông tin này.`
      };

      await transporter.sendMail(mailOptions);
      console.log(`Đã gửi email thành công tới ${email}`);
      
      // Delay 2 giây để tránh bị giới hạn mailtrap (550 5.7.0 Too many emails per second)
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log("Hoàn thành tất cả tác vụ!");

  } catch (error) {
    console.error('Lỗi xảy ra:', error);
  }
}

processUsers();
