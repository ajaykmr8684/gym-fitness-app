# Admin User Guide - Shri Ram Fitness

Welcome to the Shri Ram Fitness Gym Management System! This guide explains how to use every feature.

## 🏠 Dashboard

The dashboard is your gym's control center showing real-time stats.

### What You See:
- **Active Members**: Current count of members with active subscriptions
- **Pending Bills**: Number of unpaid bills
- **Total Revenue**: Currently owed by all members
- **Overdue Amount**: Money from past-due bills

### Quick Actions:
Four buttons for common tasks:
- **Manage Members**: Add/edit/view all members
- **Billing Management**: Create and send bills
- **Set Reminders**: Send automated reminders
- **View Dashboard**: Return to this stats page

---

## 👥 Members Section

Where you manage all your gym members.

### Viewing Members
1. Click "Members" in the top menu
2. See table with all members
3. Search by name, email, or phone (quick search box)

### Adding a New Member
1. Click "Add Member" button (top right)
2. Fill in the form:
   - **Name** ✓ Required - Full name of member
   - **Email** ✓ Required - For bill notifications
   - **Phone** ✓ Required - For WhatsApp messages
   - **Membership Plan** ✓ Required - Choose:
     - Monthly: ₹500 for 30 days
     - Quarterly: ₹1,400 for 90 days
     - Yearly: ₹5,000 for 365 days
   - **Join Date** - When they joined (defaults to today)
   - **Notes** - Any special info
   - **WhatsApp Opt-in** - If they want text notifications
3. Click "Add Member"
4. Member appears in the table immediately

### Editing a Member
1. Find member in the table
2. Click the ✏️ (edit) icon in the Actions column
3. Update any information
4. Click "Update Member"

### Deleting a Member
1. Click the 🗑️ (delete) icon
2. Confirm deletion
3. Member is removed from system

### Understanding Member Status
- **active**: Current member, membership not expired
- **inactive**: Member exists but not active
- **expired**: Membership has expired, needs renewal

---

## 💵 Billing Section

Create and track all member bills.

### Viewing Bills
1. Click "Billing" in the top menu
2. See all bills with their current status
3. Search for specific member bills

### Creating a Bill
1. Click "Create Bill" button
2. **Select Member** ✓ Choose from dropdown
   - Shows member name and plan info
3. **Amount** ✓ Bill amount (usually the membership price)
4. **Due Date** ✓ When payment is due
5. **Notes** - Optional notes about this bill
6. Click "Create Bill"

### Bill Status Legend
- **pending**: Bill created, not paid
- **paid**: Payment received
- **overdue**: Due date passed, not paid yet

### Sending Bills to Members

#### Via Email
1. Click the ✉️ (email) icon next to a bill
2. System sends bill details to member's email
3. Icon turns green ✓ indicating sent

#### Via WhatsApp
1. Click the 💬 (WhatsApp) icon next to a bill
2. Message sends to member's phone (if they opted in)
3. Icon turns green ✓ indicating sent

**Note**: WhatsApp only works if member has opted in for messages

### Marking Bills as Paid
1. Click ⬇️ (download/paid) icon to mark as paid
2. Status changes to "paid"
3. Amount paid updates automatically

---

## 🔔 Reminders Section

Send automated reminders to members.

### Types of Reminders
- **Membership Expiry**: Membership is expiring soon
- **Payment Due**: Bill is due soon
- **Payment Overdue**: Payment should have been made

### Creating a Reminder
1. Click "Reminders" in the top menu
2. Click "Create Reminder" button
3. Fill the form:
   - **Member** ✓ Select from list
   - **Reminder Type** ✓ Choose reason
   - **Due Date** ✓ When reminder applies
   - **Message** ✓ Custom message to send
4. Click "Create Reminder"

### Reminder Examples

**Membership Expiry:**
"Your gym membership is expiring on [date]. Please renew to continue."

**Payment Due:**
"Your gym bill of ₹[amount] is due on [date]. Please pay."

**Payment Overdue:**
"Your payment of ₹[amount] is overdue. Please pay immediately."

### Sending Reminders
Click reminder card to send via:
- **Email**: Direct to member's email
- **WhatsApp**: Text to member's phone

Reminders show "Sent" status once delivered.

---

## 📊 Key Features

### Real-time Updates
- Data updates instantly as you make changes
- Dashboard stats update in real-time
- No need to refresh page

### Search Functionality
- Search members by:
  - Name (partial matches work)
  - Email
  - Phone number
- Search bills by member name
- Very quick - as you type

### Mobile Friendly
- Works on phones and tablets
- Touch-friendly buttons
- Responsive layout
- Use Chrome for best results

### Data is Saved Forever
- All data stored in cloud
- Automatic daily backups
- Never lose member information
- Accessible anytime, anywhere

---

## 💡 Tips & Best Practices

### Daily Workflow
1. **Morning**: Check dashboard for pending bills
2. **During Day**: Add new members
3. **Payment Time**: Create bills
4. **Follow-up**: Send reminders
5. **Evening**: Review overdue payments

### Bill Management
- Create bills right after member joins
- Send email immediately after creating bill
- Send WhatsApp reminder on due date
- Send overdue reminder 3 days after due date
- Mark as paid when member pays

### Member Communication
- Be professional in notes
- Use clear message language
- Include contact info for support
- Reference to bill due dates in messages

### Membership Renewals
When membership expires:
1. Note appears in member table
2. Contact member 5 days before expiry
3. Create new bill for renewal
4. Update their plan if changed
5. Extend expiry date automatically

---

## 🚨 Common Tasks

### "I forgot a member's password"
- No passwords needed! Cloud-based app
- Just bookmark and return anytime

### "Can I edit member after creating?"
- Yes! Click ✏️ icon in members table
- Changes save immediately

### "How long are records kept?"
- Forever! Cloud backup keeps all history
- You can access old records anytime

### "Can I print a bill?"
- Use browser print (Ctrl+P / Cmd+P)
- Print invoice for record keeping

### "How many members can I add?"
- Unlimited! (Within Firebase free tier limits)
- Works smoothly with 100-1000+ members

### "Can I delete old bills?"
- Currently no delete option (by design, for records)
- Mark as paid instead
- Future version will have archive option

---

## 🔒 Data Security

### Your Data is Safe
- Encrypted in transit and at rest
- Firebase security rules active
- Automatic daily backups
- Access anywhere (cloud-based)

### Best Practices
- Don't share login details
- Use HTTPS always (it's automatic)
- Update password regularly if you add authentication
- Review member list periodically

---

## 📱 Using on Mobile

### Getting Started
1. Go to your app URL on your phone
2. Bookmark it for quick access
3. Works in any mobile browser

### Mobile Features
- Fully responsive design
- Touch-optimized buttons
- Keyboard appears automatically
- Horizontal scroll on tables

### Tips
- Use landscape mode for tables
- Zoom in on numbers if needed
- Save to home screen for app-like experience

---

## 🆘 Troubleshooting

### Member Not Saving
1. Check internet connection
2. Refresh page (F5)
3. Try again
4. Check browser console for errors

### Bill Not Showing Up
1. Make sure bill was created (check database)
2. Refresh the page
3. Check member name spelling
4. Try search function

### Email/WhatsApp Not Sending
1. Check member's email/phone is correct
2. Member must opt-in for WhatsApp
3. Check internet connection
4. Try again in a moment

### App Running Slow
1. Too many members loaded? Refresh helps
2. Slow internet? Try again
3. Browser issue? Clear cache (Ctrl+Shift+Del)
4. Try different browser

---

## 📞 Support

### Common Questions
- **Can I have multiple users?** - Not yet, but planned
- **Can I export data?** - Firebase allows export
- **Can I import old data?** - Manual entry or custom import
- **Is daily backup automatic?** - Yes, Firebase handles it
- **What if server goes down?** - Firebase is 99.9% reliable

### Getting More Help
1. Check QUICKSTART.md for setup issues
2. Read README.md for detailed info
3. Check FIREBASE_SETUP.md for database issues
4. Review DEPLOYMENT.md if using custom domain

---

## 🎯 Best Practices Summary

✅ **DO:**
- Add members immediately
- Create bills promptly
- Send reminders regularly
- Check dashboard daily
- Update member info as needed

❌ **DON'T:**
- Share the admin URL publicly
- Store sensitive data in notes
- Forget to mark bills when paid
- Ignore overdue payments
- Delete important member records

---

**You're all set!** Start with the dashboard and explore each section.

Remember: The app is intuitive and saves everything automatically. Don't worry about breaking anything! 💪

For detailed information, see:
- **QUICKSTART.md** - Getting started
- **README.md** - Full feature list
- **FIREBASE_SETUP.md** - Database help
- **INTEGRATION_GUIDE.md** - Email/WhatsApp setup
