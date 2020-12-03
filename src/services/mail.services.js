import SendGridMail from "@sendgrid/mail";

SendGridMail.setApiKey(process.env.SENDGRID_API);
const sendMail = (to, from, firstName, lastName, phone) => {
  const msg = {
    to: to, // Change to your recipient
    from: from, // Change to your verified sender
    templateId: "d-44fbd10ccc984490b16825f23ce603c2",
    dynamicTemplateData: {
      name: `${firstName} ${lastName}`,
      phone: phone,
      email: to,
    },
  };
  SendGridMail.send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error) => {
      console.error(error);
    });
};
