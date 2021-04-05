import mailchimp from '@mailchimp/mailchimp_marketing';

mailchimp.setConfig({
  apiKey: process.env.MAILCHIMP_NEWSLETTER_API,
  server: process.env.MAILCHIMP_SERVER
})


export const createMailchimpAudience = async (req, res, next) => {
  const { audienceName } = req.body
  const { userRole } = req.userData
  try {
    if (userRole !== 'admin') {
      return res.status(403).json({
        message: "You do not have permission to create an audience"
      })
    }
    const footerContactInfo = {
      company: "TracTrac Global",
      address1: "12 Ebitu Ukiwe Str.",
      address2: "Jabi",
      city: "Abuja",
      state: "FCT",
      zip: "",
      country: "Nigeria"
    };
    const campaignDefaults = {
      from_name: "TracTrac Global",
      from_email: "tractracnigeria@gmail.com",
      subject: "Newsletter Signup",
      language: "EN_US"
    };
    const response = await mailchimp.lists.createList({
      name: audienceName,
      contact: footerContactInfo,
      permission_reminder: "permission_reminder",
      email_type_option: true,
      campaign_defaults: campaignDefaults
    });

    if (response) {
      return res.status(200).json({
        message: "Successfully created an audience"
      })
    }

    return res.status(500).json({
      message: "Could not create audience"
    })
  } catch (error) {
    return next({
      message: "Error creating audience",
      err: error
    })
  }
}

export const subscribeContactToMailchimp = async (req, res, next) => {
  const { fname, lname, email } = req.body
  try {
    const listId = "fc4d473c00";

    const response = await mailchimp.lists.addListMember(listId, {
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: fname,
        LNAME: lname
      }
    });
    if(response) {
      return res.status(200).json({
        message: `Your email has been successfully subscribed to our Newsletter`
      })
    }
    return res.status(500).json({
      message: "Error subscribing to newsletter"
    })
  } catch (error) {
    return next({
      message: "Could not subscribe email to Newsletter",
      err: error
    })
  }
}


// export const run = async () => {
//   try {
//     const response = await mailchimp.lists.getAllLists();
//     console.log(response);
//   } catch (error) {
//     console.log(error)
//   }
// };
