const nodemailer = require("nodemailer");
require("dotenv").config();



const sendOTPByEmail = async (email, otp, subject) => {

  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rushashingala@gmail.com',
        pass: 'wexdprqzxoshavkb'


      },
      tls: {
        rejectUnauthorized: false // Add this line to ignore SSL verification
      }
    });

    let mailOption = {
      from: 'cubes.dev12@gmail.com',
      to: email,
      subject: subject,
      // text: otp
      html: `<body style="font-family: Helvetica, Arial, sans-serif; margin: 0px; padding: 0px; background-color: #D3D3D3;">
      <table role="presentation" style="width: 100%; border-collapse: collapse; border: 0px; border-spacing: 0px; font-family: Arial, Helvetica, sans-serif; ">
        <tbody>
          <tr>
            <td align="center" style="padding: 1rem 2rem; vertical-align: top; width: 100%;">
              <table role="presentation" style="max-width: 300px; border-collapse: collapse; border: 0px; border-spacing: 0px; text-align: left;">
                <tbody>
                  <tr>
                    <td style="padding: 20px 0px 0px;">
                      <div style="text-align: center;">
                        <div style="padding: 20px; background-color: #fff; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
                          <div class="header" style="text-align: center; margin-bottom: 5px;">
                                 <img src="" alt="App Logo" style="width: 100px; height: 90px;">
                              </div>
                          <h2 style="color: #000000; margin-top: 0; margin-bottom: 15px; text-align: center;">Email Verification</h2>
                          <p style="color: #000000; line-height: 1;">Your verification code is: <span class="otp-code" style="font-size: 24px; font-weight: bold; color: #f88591; margin-bottom: 20px;">${otp}</span></p>
                          <p style="color: #000000; line-height: 1;">Please use this code to verify your email address.</p>
                          <div class="footer" style="margin-top: 20px; color: #000000; font-size: 12px; text-align: center;">
                            <p>This email was sent automatically. Please do not reply.</p>
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </body>
          `
    };

    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.error("Error sending emailxx:", error);
      }
      else {
        console.log("Email sent:", info.response);
      }
    })

  } catch (error) {
    console.log(error);
  }
}


const confirmedmail = async (data) => {
  try {
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'rushashingala@gmail.com',
        pass: 'wexdprqzxoshavkb'


      },
      tls: {
        rejectUnauthorized: false // Add this line to ignore SSL verification
      }
    });

    let mailOption = {
      from: 'cubes.dev12@gmail.com',
      to: data.email,
      subject: "Confirmation Mail",
      // text: otp
      html: `
      <body
  style="
    font-family: Helvetica, Arial, sans-serif;
    margin: 0px;
    padding: 0px;
    background-color: #d3d3d3;
  "
>
  <table
    role="presentation"
    style="
      width: 100%;
      border-collapse: collapse;
      border: 0px;
      border-spacing: 0px;
      font-family: Arial, Helvetica, sans-serif;
    "
  >
    <tbody>
      <tr>
        <td
          align="center"
          style="padding: 1rem 2rem; vertical-align: top; width: 100%"
        >
          <table
            role="presentation"
            style="
              max-width: 500px;
              border-collapse: collapse;
              border: 0px;
              border-spacing: 0px;
              text-align: left;
            "
          >
            <tbody>
              <tr>
                <td style="padding: 20px 0px 0px">
                  <div style="text-align: center">
                    <div
                      style="
                        padding: 20px;
                        background-color: #fff;
                        border-radius: 10px;
                        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                      "
                    >

                      <h3
                        style="
                          margin-top: 0;
                          margin-bottom: 15px;
                          text-align: center;
                        "
                      >
                        Your Appointment is Confirmed for ${data.date}
                      </h3>
                      <p style="line-height: 1">
                        Hi ${data.firstname} ${data.lastname}, Thank you for scheduling with us.
                      </p>
                      <p>
                        This email confirms the details of your upcoming
                        appointment:
                      </p>
                      <p>
                        Appointment details:
                        <br />
                        email: ${data.email} <br />
                        Date: ${data.date} <br />
                        Time: ${data.start_time}-${data.end_time}  <br />
                      </p>
                      <p>
                        If you need to reschedule or cancel, kindly inform us at
                        least 24 hours before your appointment.
                      </p>
                      <p>
                        Best regards, Eye Care Hospital
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </td>
      </tr>
    </tbody>
  </table>
</body>
      `
    };

    transporter.sendMail(mailOption, (error, info) => {
      if (error) {
        console.error("Error sending emailxx:", error);
      }
      else {
        console.log("Email sent:", info.response);
      }
    })

  } catch (error) {
    console.log(error);
  }
}
module.exports = { sendOTPByEmail, confirmedmail } 