import isAuthorized from "middelwares/authorized"
import { sendSingelMail } from "utils/mail"

const sendSingelMailAPI = async (req) => {
  const body = req.body
  const commaSepratedStringRecipient = body.commaSepratedStringRecipient
  const subject = body.subject
  const plainTextMessage = body.plainTextMessage
  const htmlMessage = body.htmlMessage

  return await sendSingelMail(commaSepratedStringRecipient, subject, plainTextMessage, htmlMessage)
}


async function mail(req, res, session) {

  const response = await sendSingelMailAPI(req)
  res.json(response)
}

//https://github.com/vercel/next.js/tree/canary/examples/api-routes-middleware
// https://nextjs.org/docs/routing/dynamic-routes#optional-catch-all-routes
export default isAuthorized(mail)