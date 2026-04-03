// Opens Gmail draft with bill details pre-filled
export const sendBillEmail = async (
  memberEmail: string,
  memberName: string,
  billAmount: number,
  billDate: string,
  dueDate: string
): Promise<boolean> => {
  try {
    const subject = encodeURIComponent('Your Gym Bill - Shree Ram Fitness Centre');
    const body = encodeURIComponent(
      `Hello ${memberName},\n\nYour gym billing statement has been generated.\n\nBill Details:\nBill Date: ${billDate}\nDue Date: ${dueDate}\nAmount Due: ₹${billAmount}\n\nPlease make the payment by the due date to keep your membership active.\n\nIf you have any questions, feel free to contact us.\n\nBest regards,\nShree Ram Fitness Centre\nEmail: shreeramfitnesshamirpur@gmail.com\nPhone: +91-8580521298`
    );
    
    // Open Gmail compose with pre-filled details
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${memberEmail}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
    
    return true;
  } catch (error) {
    console.error('Error opening Gmail:', error);
    alert('Could not open Gmail. Please make sure you are logged in to Gmail.');
    return false;
  }
};

// Opens WhatsApp Web with message pre-filled
export const sendBillWhatsApp = async (
  memberPhone: string,
  memberName: string,
  billAmount: number,
  dueDate: string
): Promise<boolean> => {
  try {
    // Format phone number - remove spaces and special characters, add country code if needed
    let phone = memberPhone.replace(/\D/g, ''); // Remove all non-digits
    
    // If phone doesn't start with country code, add India's code
    if (!phone.startsWith('91')) {
      phone = '91' + phone;
    }
    
    const message = encodeURIComponent(
      `Hi ${memberName},\n\nYour gym bill of ₹${billAmount} is due on ${dueDate}.\n\nPlease make the payment to keep your membership active.\n\nThank you!\nShree Ram Fitness Centre`
    );
    
    // Open WhatsApp Web with pre-filled message
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phone}&text=${message}`;
    window.open(whatsappUrl, '_blank');
    
    return true;
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    alert('Could not open WhatsApp. Please make sure WhatsApp Web is available and you are logged in.');
    return false;
  }
};

// Opens Gmail draft for reminders
export const sendReminderEmail = async (
  memberEmail: string,
  memberName: string,
  reminderType: string,
  message: string
): Promise<boolean> => {
  try {
    const subject = encodeURIComponent(`${reminderType} - Shree Ram Fitness Centre`);
    const body = encodeURIComponent(
      `Hello ${memberName},\n\n${message}\n\nIf you have any questions, please contact us.\n\nBest regards,\nShree Ram Fitness Centre\nEmail: shreeramfitnesshamirpur@gmail.com\nPhone: +91-8580521298`
    );
    
    const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${memberEmail}&su=${subject}&body=${body}`;
    window.open(gmailUrl, '_blank');
    
    return true;
  } catch (error) {
    console.error('Error opening Gmail:', error);
    alert('Could not open Gmail. Please make sure you are logged in.');
    return false;
  }
};

// Opens WhatsApp Web for reminders
export const sendReminderWhatsApp = async (
  memberPhone: string,
  memberName: string,
  message: string
): Promise<boolean> => {
  try {
    // Format phone number
    let phone = memberPhone.replace(/\D/g, '');
    if (!phone.startsWith('91')) {
      phone = '91' + phone;
    }
    
    const fullMessage = encodeURIComponent(`Hi ${memberName}, ${message}\n\nShree Ram Fitness Centre`);
    
    const whatsappUrl = `https://web.whatsapp.com/send?phone=${phone}&text=${fullMessage}`;
    window.open(whatsappUrl, '_blank');
    
    return true;
  } catch (error) {
    console.error('Error opening WhatsApp:', error);
    alert('Could not open WhatsApp. Please make sure you are logged in to WhatsApp Web.');
    return false;
  }
};
