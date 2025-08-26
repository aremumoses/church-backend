"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendForgetOtpToEmail = exports.sendOtpToEmail = void 0;
const SibApiV3Sdk = require('sib-api-v3-sdk');
const sendOtpToEmail = (email, name) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_KEY;
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
        yield apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('Mail sent successfully');
    }
    catch (error) {
        console.error('Error sending email:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.body) || error);
        throw new Error('Failed to send registration email');
    }
});
exports.sendOtpToEmail = sendOtpToEmail;
const sendForgetOtpToEmail = (email, name, otp) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const defaultClient = SibApiV3Sdk.ApiClient.instance;
    const apiKey = defaultClient.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_KEY;
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
        yield apiInstance.sendTransacEmail(sendSmtpEmail);
        console.log('OTP sent successfully');
    }
    catch (error) {
        console.error('Error sending email:', ((_a = error === null || error === void 0 ? void 0 : error.response) === null || _a === void 0 ? void 0 : _a.body) || error);
        throw new Error('Failed to send OTP email');
    }
});
exports.sendForgetOtpToEmail = sendForgetOtpToEmail;
