import nodemailer from "nodemailer"

const sendSingelMail = async (commaSepratedStringRecipient, subject, plainTextMessage, htmlMessage) => {
  let transporter = nodemailer.createTransport({
    host: "smtp.stud.ntnu.no",
    port: 25,
    secure: false, // true for 465, false for other ports
  })

  let mail = {
    from: "\"Odin at GitEdu 👻\" <odin-gitedu@ntnu.no>", // sender address
    bcc: commaSepratedStringRecipient, // list of receivers
    subject: subject, // Subject line
    text: plainTextMessage, // plain text body
  }

  if (htmlMessage) {
    mail.html = htmlMessage
  }

  let info = transporter.sendMail(mail).then(r => r).catch(error => ({ ...error, error: "failed to send mail" }))

  return info
}

export { sendSingelMail }

/*
const sendMail = async () => {
    setLoadingCreateGroups(true)
    const data = await fetcher(
      "/api/mail",
      {
        commaSepratedStringRecipient: "pettegre@stud.ntnu.no, torestef@stud.ntnu.no",
        subject: "test",
        plainTextMessage: "message",
        //htmlMessage: "<div>hi</div>"
      }
    )
    setLoadingCreateGroups(false)
    console.log("mail sent, data")
  }
*/