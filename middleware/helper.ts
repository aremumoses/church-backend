const SibApiV3Sdk = require('sib-api-v3-sdk');

export const sendOtpToEmail = async (email: string, name: string): Promise<void> => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_KEY!;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.sender = { name: "Church-app", email: "iamfidelisokoh@gmail.com" };
  sendSmtpEmail.to = [{ email, name }];
  sendSmtpEmail.templateId = 2;
  sendSmtpEmail.params = { name };
  sendSmtpEmail.headers = {
    'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('Mail sent successfully');
  } catch (error: any) {
    console.error('Error sending email:', error?.response?.body || error);
    throw new Error('Failed to send registration email');
  }
};
export const sendForgetOtpToEmail = async (email: string, name: string, otp: string): Promise<void> => {
  const defaultClient = SibApiV3Sdk.ApiClient.instance;
  const apiKey = defaultClient.authentications['api-key'];
  apiKey.apiKey = process.env.BREVO_KEY!;

  const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

  const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

  sendSmtpEmail.sender = { name: "Church-app", email: "iamfidelisokoh@gmail.com" };
  sendSmtpEmail.to = [{ email, name }];
  sendSmtpEmail.templateId = 3;
  sendSmtpEmail.params = { name, otp };
  sendSmtpEmail.headers = {
    'X-Mailin-custom': 'custom_header_1:custom_value_1|custom_header_2:custom_value_2'
  };

  try {
    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log('OTP sent successfully');
  } catch (error: any) {
    console.error('Error sending email:', error?.response?.body || error);
    throw new Error('Failed to send OTP email');
  }
};
