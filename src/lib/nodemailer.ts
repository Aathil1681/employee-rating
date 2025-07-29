import { google } from "googleapis";
import nodemailer from "nodemailer";

const getCredentials = async (): Promise<string | any> => {
  const oAuth2Client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENT_ID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REDIRECT_URI,
  );

  oAuth2Client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });

  return await oAuth2Client.getAccessToken();
};

export async function sendEmail({
  to,
  subject,
  html,
}: {
  to: string;
  subject: string;
  html: string;
}) {
  const credentials = await getCredentials();
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      type: "oauth2",
      user: process.env.EMAIL_USER,
      clientId: process.env.OAUTH_CLIENT_ID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: credentials,
    },
  });

  return await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: to,
    subject: subject,
    html,
  });
}
