# Email and WhatsApp Integration Guide

## Overview

This guide explains how to set up real email and WhatsApp functionality for your gym management app.

## Email Integration with SendGrid

SendGrid is a popular email service with a generous free tier (100 emails/day).

### Step 1: Create SendGrid Account
1. Go to [SendGrid](https://sendgrid.com)
2. Sign up for a free account
3. Verify your email

### Step 2: Create API Key
1. Go to Settings > API Keys
2. Click "Create API Key"
3. Give it a name like "Gym Billing App"
4. Copy the API key

### Step 3: Update Environment Variables
Add to `.env.local`:
```
VITE_SENDGRID_API_KEY=your_api_key_here
VITE_SENDGRID_FROM_EMAIL=noreply@yourgym.com
```

### Step 4: Update notifications.ts

Replace the `sendBillEmail` function in `src/utils/notifications.ts`:

```typescript
import axios from 'axios';

export const sendBillEmail = async (
  memberEmail: string,
  memberName: string,
  billAmount: number,
  billDate: string,
  dueDate: string
): Promise<boolean> => {
  try {
    const response = await axios.post('https://api.sendgrid.com/v3/mail/send', {
      personalizations: [
        {
          to: [{ email: memberEmail, name: memberName }],
          subject: `Your Gym Bill - Shri Ram Fitness`,
        },
      ],
      from: {
        email: import.meta.env.VITE_SENDGRID_FROM_EMAIL,
        name: 'Shri Ram Fitness',
      },
      content: [
        {
          type: 'text/html',
          value: `
            <html>
              <body>
                <h2>Hello ${memberName},</h2>
                <p>Your gym billing statement for Shri Ram Fitness.</p>
                <table style="border-collapse: collapse;">
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Bill Date:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${billDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd;">Due Date:</td>
                    <td style="padding: 10px; border: 1px solid #ddd;">${dueDate}</td>
                  </tr>
                  <tr>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Amount Due:</td>
                    <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">₹${billAmount}</td>
                  </tr>
                </table>
                <p>Please make the payment by the due date.</p>
                <p>Thank you for being a member of Shri Ram Fitness!</p>
              </body>
            </html>
          `,
        },
      ],
    }, {
      headers: {
        Authorization: `Bearer ${import.meta.env.VITE_SENDGRID_API_KEY}`,
        'Content-Type': 'application/json',
      },
    });

    return response.status === 202;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
};
```

## WhatsApp Integration with Twilio

Twilio provides WhatsApp Cloud API integration.

### Step 1: Create Twilio Account
1. Go to [Twilio](https://www.twilio.com)
2. Sign up for a free account
3. Get your Account SID and Auth Token from the dashboard

### Step 2: Set Up WhatsApp Business Account
1. Follow Twilio's WhatsApp Business setup guide
2. Get your WhatsApp Business Phone Number
3. Get your WhatsApp Template approvals (for WhatsApp Cloud API)

### Step 3: Update Environment Variables
Add to `.env.local`:
```
VITE_TWILIO_ACCOUNT_SID=your_account_sid
VITE_TWILIO_AUTH_TOKEN=your_auth_token
VITE_TWILIO_WHATSAPP_NUMBER=whatsapp:+1234567890
```

### Step 4: Update notifications.ts

Replace the `sendBillWhatsApp` function in `src/utils/notifications.ts`:

```typescript
import axios from 'axios';

export const sendBillWhatsApp = async (
  memberPhone: string,
  memberName: string,
  billAmount: number,
  dueDate: string
): Promise<boolean> => {
  try {
    const accountSid = import.meta.env.VITE_TWILIO_ACCOUNT_SID;
    const authToken = import.meta.env.VITE_TWILIO_AUTH_TOKEN;
    const fromNumber = import.meta.env.VITE_TWILIO_WHATSAPP_NUMBER;
    const toNumber = `whatsapp:${memberPhone}`;

    const response = await axios.post(
      `https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`,
      {
        From: fromNumber,
        To: toNumber,
        Body: `Hi ${memberName}, your gym bill of ₹${billAmount} is due on ${dueDate}. Please pay at your earliest convenience. - Shri Ram Fitness`,
      },
      {
        auth: {
          username: accountSid,
          password: authToken,
        },
      }
    );

    return response.status === 201;
  } catch (error) {
    console.error('Error sending WhatsApp:', error);
    return false;
  }
};
```

## Alternative: WhatsApp Cloud API

For a more professional setup, use WhatsApp Cloud API:

1. Sign up at [WhatsApp for Business](https://www.whatsapp.com/business/api/)
2. Get your Business Account ID and Access Token
3. Create message templates
4. Follow similar axios implementation

## Testing

Before going live:
1. Test email sending with a test member
2. Test WhatsApp with your own number
3. Check email spam folders
4. Verify WhatsApp message formatting

## Best Practices

- **Email Templates**: Create professional HTML email templates
- **Rate Limiting**: Implement delays to avoid hitting API rate limits
- **Error Handling**: Log all email/WhatsApp failures
- **Batch Operations**: Group similar notifications for efficiency
- **Opt-in Management**: Always respect member preferences
- **Template Compliance**: Follow WhatsApp's message template guidelines

## Troubleshooting

### Emails not sending
- Check API key is correct
- Verify sender email is authorized in SendGrid
- Check email logs in SendGrid dashboard

### WhatsApp not working
- Verify phone number format (include country code)
- Check if business account is approved
- Ensure templates are pre-approved
- Check message content compliance

---

For more details, refer to:
- [SendGrid Documentation](https://docs.sendgrid.com/)
- [Twilio WhatsApp Documentation](https://www.twilio.com/docs/whatsapp)
