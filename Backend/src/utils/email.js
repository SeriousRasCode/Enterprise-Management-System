import nodemailer from "nodemailer";

export const sendResetEmail = async (email, token, fullName) => {
  const transporter = nodemailer.createTransport({
     host: "smtp.gmail.com",
  port: 587,
  secure: false,
  family: 4,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
const safeName = fullName ? fullName : "User";
  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  await transporter.sendMail({
    from: `"Enterprise Support" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Password Reset Request",
    html: `
      <div style="margin:0; padding:0; background-color:#f4f6f8; font-family: Arial, sans-serif;">
        <table align="center" width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;">
          <tr>
            <td align="center">
              
              <!-- Card -->
              <table width="500" cellpadding="0" cellspacing="0" 
                     style="background:#ffffff; border-radius:10px; overflow:hidden; box-shadow:0 4px 12px rgba(0,0,0,0.08);">
                
                <!-- Header -->
                <tr>
                  <td style="background:linear-gradient(90deg, #0f5841, #194f87); padding:20px; text-align:center;">
                    <h2 style="color:#ffffff; margin:0;">Password Reset</h2>
                  </td>
                </tr>

                <!-- Body -->
                <tr>
                  <td style="padding:30px; color:#333333;">
                   <p style="font-size:16px; margin-bottom:20px;">
  Hello <strong>${safeName}</strong>,
</p>

                    <p style="font-size:15px; line-height:1.6;">
                      We received a request to reset your password. Click the button below to set a new password.
                    </p>

                    <!-- Button -->
                    <div style="text-align:center; margin:30px 0;">
                      <a href="${resetLink}" 
                         style="
                           background-color:#0f5841;
                           color:#ffffff;
                           text-decoration:none;
                           padding:12px 24px;
                           border-radius:6px;
                           font-size:16px;
                           font-weight:bold;
                           display:inline-block;
                         ">
                        Reset Password
                      </a>
                    </div>

                    <p style="font-size:14px; color:#666666;">
                      This link will expire in <strong>15 minutes</strong>.
                    </p>

                    <p style="font-size:14px; color:#666666; margin-top:20px;">
                      If you did not request this, please ignore this email.
                    </p>

                    <hr style="border:none; border-top:1px solid #eeeeee; margin:30px 0;" />

                    <!-- Fallback link -->
                    <p style="font-size:12px; color:#888888;">
                      If the button does not work, copy and paste this link into your browser:
                    </p>
                    <p style="font-size:12px; word-break:break-all;">
                      <a href="${resetLink}" style="color:#194f87;">${resetLink}</a>
                    </p>
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#f9fafb; padding:15px; text-align:center; font-size:12px; color:#999999;">
                    © ${new Date().getFullYear()} Enterprise Management System<br/>
                    Secure • Reliable • Professional
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>
      </div>
    `,
  });
};