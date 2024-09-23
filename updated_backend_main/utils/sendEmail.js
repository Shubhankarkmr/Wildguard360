import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { v4 as uuidv4 } from "uuid";
import { hashString } from "./index.js";
import Verification from "../models/emailVerification.js";
import PasswordReset from '../models/passwordreset.js';
dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: 'cse22093@iiitkalyani.ac.in',
    pass: 'uxuhrbfghjukdxee', 
  },
});




export const sendVerificationEmail = async (user, res) => {
  const { _id, email, lastName } = user;

  const token = _id + uuidv4();
  const link = `http://localhost:4000/users/verify/${_id}/${token}`;

  //   mail options
  const mailOptions = {
    from: 'cse22093@iiitkalyani.ac.in',
    to: email,
    subject: "Email Verification",
    html: `
      <div style='font-family: Arial, sans-serif; font-size: 20px; color: #333; background-color: #f7f7f7; padding: 20px; border-radius: 5px;'>
        <h3 style="color: rgb(8, 56, 188)">Please verify your email address</h3>
        <hr>
        <h4>Hi ${lastName},</h4>
        <p>
          Please verify your email address so we can know that it's really you.
          <br>
          <p>This link <b>expires in 1 hour</b></p>
          <br>
          <a href="${link}" style="color: #fff; padding: 14px; text-decoration: none; background-color: #000; border-radius: 8px; font-size: 18px;">Verify Email Address</a>
        </p>
        <div style="margin-top: 20px;">
          <h5>Best Regards</h5>
          <h5>WildMedia360 Team</h5>
        </div>
      </div>`,
  };

  try {
    const hashedToken = await hashString(token);

    const newVerifiedEmail = await Verification.create({
      userId: _id,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 3600000,
    });

    if (newVerifiedEmail) {
      await transporter.sendMail(mailOptions);
      res.status(201).send({
        success: "PENDING",
        message: "Verification email has been sent to your account. Check your email for further instructions.",
      });
    }
  } catch (error) {
    console.log(error);

    let errorMessage = "An error occurred while sending the verification email.";

    // Check for specific error types
    if (error.response) {
      // SMTP-specific error
      errorMessage = `SMTP Error: ${error.response}`;
    } else if (error.message.includes("create")) {
      // Mongoose or other DB-related errors
      errorMessage = `Database Error: ${error.message}`;
    } else if (error.message.includes("nodemailer")) {
      // Nodemailer-related errors
      errorMessage = `Email Error: ${error.message}`;
    } else {
      // Generic error message
      errorMessage = `Error: ${error.message}`;
    }

    res.status(500).json({ message: errorMessage });
  }
};


export const resetPasswordLink = async (user, res) => {
  const { _id, email } = user;

  const token = _id + uuidv4();
  const link = `http://localhost:4000/users/reset-password/${_id}/${token}`;

  //   mail options
  const mailOptions = {
    from: 'cse22093@iiitkalyani.ac.in',
    to: email,
    subject: "Password Reset",
    html: `
      <p style="font-family: Arial, sans-serif; font-size: 16px; color: #333; background-color: #f7f7f7; padding: 20px; border-radius: 5px;">
        Password reset link. Please click the link below to reset your password.
        <br>
        <p style="font-size: 18px;"><b>This link expires in 10 minutes</b></p>
        <br>
        <a href="${link}" style="color: #fff; padding: 10px; text-decoration: none; background-color: #000; border-radius: 8px; font-size: 18px;">Reset Password</a>.
      </p>`,
  };

  try {
    const hashedToken = await hashString(token);

    const resetEmail = await PasswordReset.create({
      userId: _id,
      email: email,
      token: hashedToken,
      createdAt: Date.now(),
      expiresAt: Date.now() + 600000,
    });

    if (resetEmail) {
      await transporter.sendMail(mailOptions);
      res.status(201).send({
        success: "PENDING",
        message: "Reset Password Link has been sent to your account.",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(404).json({ message: "Something went wrong" });
  }
};



