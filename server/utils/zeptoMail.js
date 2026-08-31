
export const sendViaZeptoMail = async (toAddress, toName, subject, htmlBody) => {
  const apiKey = process.env.ZEPTO_API_KEY;
  if (!apiKey) {
    throw new Error('Email service not configured. Missing ZEPTO_API_KEY');
  }

  const payload = {
    from: { 
      address: process.env.ZEPTO_FROM_EMAIL, 
      name: process.env.ZEPTO_FROM_NAME || 'Prorido' 
    },
    to: [{ 
      email_address: { 
        address: toAddress, 
        name: toName || toAddress 
      } 
    }],
    subject: subject,
    htmlbody: htmlBody
  };

  const response = await fetch('https://api.zeptomail.com/v1.1/email', {
    method: 'post',
    headers: {
      'Authorization': apiKey,
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    const errText = await response.text();
    console.error('ZeptoMail Error:', errText);
    throw new Error('Email delivery failed');
  }
};
