import { Member, Bill, Reminder } from '../types';
import { addMember, addBill, addReminder, calculateMembershipPrice } from './db';

// Dummy Members with new membership structure
const dummyMembers: Omit<Member, 'id'>[] = [
  {
    name: 'Rajesh Kumar',
    email: 'rajesh@example.com',
    phone: '+91-9876543210',
    planType: 'annual',
    planDuration: 365,
    strength: true,
    cardio: false,
    training: false,
    baseAmount: 14400,
    discountPercentage: 20,
    amount: 11520,
    amountPaid: 11520,
    joinDate: '2023-06-15',
    expiryDate: '2025-06-15',
    status: 'active',
    whatsappOptIn: true,
    notes: 'Regular member, interested in strength training',
  },
  {
    name: 'Priya Singh',
    email: 'priya@example.com',
    phone: '+91-9876543211',
    planType: 'quarterly',
    planDuration: 90,
    strength: true,
    cardio: true,
    training: false,
    baseAmount: 4275,
    discountPercentage: 5,
    amount: 4061,
    amountPaid: 0,
    joinDate: '2024-10-01',
    expiryDate: '2024-12-30',
    status: 'active',
    whatsappOptIn: true,
    notes: 'Yoga and fitness enthusiast',
  },
  {
    name: 'Amit Patel',
    email: 'amit@example.com',
    phone: '+91-9876543212',
    planType: 'monthly',
    planDuration: 30,
    strength: true,
    cardio: true,
    training: true,
    baseAmount: 2000,
    discountPercentage: 0,
    amount: 2000,
    amountPaid: 2000,
    joinDate: '2024-11-01',
    expiryDate: '2024-12-01',
    status: 'active',
    whatsappOptIn: false,
    notes: 'New member, trial period',
  },
  {
    name: 'Deepika Sharma',
    email: 'deepika@example.com',
    phone: '+91-9876543213',
    planType: 'annual',
    planDuration: 365,
    strength: true,
    cardio: false,
    training: true,
    baseAmount: 20400,
    discountPercentage: 20,
    amount: 16320,
    amountPaid: 8160,
    joinDate: '2024-05-20',
    expiryDate: '2025-05-20',
    status: 'active',
    whatsappOptIn: true,
    notes: 'Weight loss program participant',
  },
  {
    name: 'Vikram Reddy',
    email: 'vikram@example.com',
    phone: '+91-9876543214',
    planType: 'quarterly',
    planDuration: 90,
    strength: true,
    cardio: false,
    training: false,
    baseAmount: 3420,
    discountPercentage: 5,
    amount: 3249,
    amountPaid: 3249,
    joinDate: '2024-08-10',
    expiryDate: '2024-11-08',
    status: 'expired',
    whatsappOptIn: true,
    notes: 'Membership expired, has not renewed',
  },
  {
    name: 'Ananya Verma',
    email: 'ananya@example.com',
    phone: '+91-9876543215',
    planType: 'monthly',
    planDuration: 30,
    strength: true,
    cardio: true,
    training: false,
    baseAmount: 1500,
    discountPercentage: 0,
    amount: 1500,
    amountPaid: 1500,
    joinDate: '2024-09-15',
    expiryDate: '2024-10-15',
    status: 'inactive',
    whatsappOptIn: true,
    notes: 'Member on break, considering renewal',
  },
  {
    name: 'Rohan Gupta',
    email: 'rohan@example.com',
    phone: '+91-9876543216',
    planType: 'annual',
    planDuration: 365,
    strength: true,
    cardio: true,
    training: true,
    baseAmount: 24000,
    discountPercentage: 20,
    amount: 19200,
    amountPaid: 19200,
    joinDate: '2023-09-01',
    expiryDate: '2025-09-01',
    status: 'active',
    whatsappOptIn: false,
    notes: 'Advanced fitness member, personal training',
  },
  {
    name: 'Neha Kapoor',
    email: 'neha@example.com',
    phone: '+91-9876543217',
    planType: 'quarterly',
    planDuration: 90,
    strength: true,
    cardio: true,
    training: false,
    baseAmount: 4275,
    discountPercentage: 5,
    amount: 4061,
    amountPaid: 2031,
    joinDate: '2024-09-01',
    expiryDate: '2024-12-01',
    status: 'active',
    whatsappOptIn: true,
    notes: 'Zumba and cardio enthusiast',
  },
  {
    name: 'Sanjay Desai',
    email: 'sanjay@example.com',
    phone: '+91-9876543218',
    planType: 'monthly',
    planDuration: 30,
    strength: true,
    cardio: false,
    training: false,
    baseAmount: 1200,
    discountPercentage: 0,
    amount: 1200,
    amountPaid: 0,
    joinDate: '2024-11-10',
    expiryDate: '2024-12-10',
    status: 'active',
    whatsappOptIn: true,
    notes: 'Recent joinee, still exploring',
  },
  {
    name: 'Megha Nair',
    email: 'megha@example.com',
    phone: '+91-9876543219',
    planType: 'annual',
    planDuration: 365,
    strength: true,
    cardio: true,
    training: false,
    baseAmount: 20400,
    discountPercentage: 20,
    amount: 16320,
    amountPaid: 16320,
    joinDate: '2024-01-15',
    expiryDate: '2025-01-15',
    status: 'active',
    whatsappOptIn: true,
    notes: 'Corporate employee, morning sessions',
  },
];

// Dummy Bills - using same bill structure
const createDummyBills = (memberIds: string[]): Omit<Bill, 'id'>[] => {
  const bills: Omit<Bill, 'id'>[] = [];
  const memberNames = dummyMembers.map(m => m.name);

  memberIds.forEach((memberId, index) => {
    const memberName = memberNames[index];
    const member = dummyMembers[index];
    const amount = member.amount;

    // Current/Due bill
    bills.push({
      memberId,
      memberName,
      planType: member.planType,
      amount,
      amountPaid: index % 3 === 0 ? amount : index % 2 === 0 ? 0 : amount / 2,
      billingDate: '2024-11-01',
      dueDate: '2024-12-01',
      status: index % 3 === 0 ? 'paid' : index % 2 === 0 ? 'pending' : 'overdue',
      emailSent: index % 2 === 0,
      whatsappSent: index % 3 === 0,
      notes: `${['Renewal', 'First bill', 'Delayed payment'][index % 3]}`,
    });

    // Previous bill
    bills.push({
      memberId,
      memberName,
      planType: member.planType,
      amount,
      amountPaid: amount,
      billingDate: '2024-10-01',
      dueDate: '2024-11-01',
      status: 'paid',
      emailSent: true,
      whatsappSent: index % 2 === 0,
      notes: 'Previous month payment',
    });
  });

  return bills;
};

// Dummy Reminders
const createDummyReminders = (memberIds: string[]): Omit<Reminder, 'id'>[] => {
  const reminders: Omit<Reminder, 'id'>[] = [];
  const memberNames = dummyMembers.map(m => m.name);

  memberIds.forEach((memberId, index) => {
    const memberName = memberNames[index];

    // Payment reminders
    if (index % 2 === 0) {
      reminders.push({
        memberId,
        memberName,
        type: 'payment_due',
        dueDate: '2024-12-15',
        message: `Payment due for membership renewal of ${memberName}. Amount: ₹${dummyMembers[index].amount}`,
        sent: true,
        sentDate: new Date().toISOString().split('T')[0],
        sentVia: ['email'],
      });
    }

    // Membership expiry reminders
    if (index % 3 === 0) {
      reminders.push({
        memberId,
        memberName,
        type: 'membership_expiry',
        dueDate: dummyMembers[index].expiryDate,
        message: `${memberName}'s membership is expiring on ${dummyMembers[index].expiryDate}. Please renew.`,
        sent: false,
        sentVia: [],
      });
    }

    // Overdue payment reminders
    if (index % 5 === 0) {
      reminders.push({
        memberId,
        memberName,
        type: 'payment_overdue',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        message: `Payment overdue for ${memberName}. Please settle the pending amount.`,
        sent: true,
        sentDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        sentVia: ['email', 'whatsapp'],
      });
    }
  });

  return reminders;
};

// Main seed function
export const seedDatabase = async (): Promise<{ success: boolean; message: string }> => {
  try {
    console.log('Starting seed data insertion...');

    // Add members in parallel
    const memberPromises = dummyMembers.map(member => {
      console.log(`Adding member: ${member.name}`);
      return addMember(member);
    });
    const memberResults = await Promise.all(memberPromises);
    const memberIds = memberResults.map(r => r.id);
    console.log(`✓ Added ${memberIds.length} members`);

    // Create and add bills in parallel
    const bills = createDummyBills(memberIds);
    const billPromises = bills.map(bill => {
      console.log(`Adding bill for: ${bill.memberName}`);
      return addBill(bill);
    });
    await Promise.all(billPromises);
    console.log(`✓ Added ${bills.length} bills`);

    // Create and add reminders in parallel
    const reminders = createDummyReminders(memberIds);
    const reminderPromises = reminders.map(reminder => {
      console.log(`Adding reminder for: ${reminder.memberName}`);
      return addReminder(reminder);
    });
    await Promise.all(reminderPromises);
    console.log(`✓ Added ${reminders.length} reminders`);

    console.log('✅ Seed data insertion completed successfully!');
    return {
      success: true,
      message: `Successfully seeded ${memberIds.length} members, ${bills.length} bills, and ${reminders.length} reminders`,
    };
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    return {
      success: false,
      message: `Error seeding database: ${error instanceof Error ? error.message : 'Unknown error'}`,
    };
  }
};
