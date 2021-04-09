const sgMail = require('@sendgrid/mail')

sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'aagaaz.ali555@gmail.com',
        subject: 'Thanks for joining',
        text: 'Welcome to Unify'
    })
}

const sendDonorFormMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'aagaaz.ali555@gmail.com',
        subject: 'Thanks for filling donation form',
        text: `Further detail will be emailed after reviewing your form`
    })
}

const sendProgramFormMail = (email, name) => {
    sgMail.send({
        to: email,
        from: 'aagaaz.ali555@gmail.com',
        subject: 'Thanks for registering a program.',
        text: `Further detail will be emailed after reviewing your form`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendDonorFormMail,
    sendProgramFormMail
}