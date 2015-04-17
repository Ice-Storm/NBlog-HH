var nodemailer = require('nodemailer');

// create reusable transporter object using SMTP transport
var transporter = nodemailer.createTransport('SMTP',{
    host: 'smtp.qq.com',
    secureConnection: true, // use SSL
    port: 465, // por
    auth: {
        user: '523003801@qq.com',
        pass: 'bai3863114yu'
    }
});

// NB! No need to recreate the transporter object. You can use
// the same transporter object for all e-mails

// setup e-mail data with unicode symbols
var mailOptions = {
    from: 'Fred Foo ✔ <523003801@qq.com>', // sender address
    to: 'wcwz020140@163.com', // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world ✔', // plaintext body
    html: '<b>Hello world</b>' // html body
};
    
// send mail with defined transport object
transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info.response);
    }
});








/*var nodemailer = require('nodemailer');

var transporter = nodemailer.createTransport('SMTP',{
    host: 'smtp.163.com',
    auth: {
        user: 'wcwz020140@163.com',
        pass: 'bai3863114yu'
    }
});

var mailOptions = {
    from: 'wcwz020140@163.com', // sender address
    to: '523003801@qq.com', // list of receivers
    subject: 'Hello 小矫情✔', // Subject line
    text: 'Hello 小矫情✔', // plaintext body
    html: '<b>Hello 这是我的第一份邮件✔</b>' // html body
};

transporter.sendMail(mailOptions, function(error, info){
    if(error){
        console.log(error);
    }else{
        console.log('Message sent: ' + info);
    }
});*/
