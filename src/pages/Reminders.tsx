import { useState } from 'react';
import { Plus, Mail, MessageCircle, Trash2, Search } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useAppContext } from '../context/AppContext';
import { addReminder, updateReminder, formatDate } from '../utils/db';
import { sendReminderEmail, sendReminderWhatsApp } from '../utils/notifications';
import { Reminder } from '../types';
import { useIsMobile } from '../hooks/useIsMobile';

export const Reminders = () => {
  const { members, reminders, refreshData } = useAppContext();
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    memberId: '',
    type: 'membership_expiry' as 'membership_expiry' | 'payment_due' | 'payment_overdue',
    message: '',
    dueDate: new Date().toISOString().split('T')[0],
  });

  const selectedMember = members.find(m => m.id === formData.memberId);
  const filteredReminders = reminders.filter(r =>
    r.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.memberId.includes(searchTerm)
  );

  const reminderTypes = {
    membership_expiry: 'Membership Expiry',
    payment_due: 'Payment Due',
    payment_overdue: 'Payment Overdue',
  };

  const handleCreateReminder = async () => {
    if (!formData.memberId || !formData.message) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const member = members.find(m => m.id === formData.memberId);
      if (!member) return;

      await addReminder({
        memberId: formData.memberId,
        memberName: member.name,
        type: formData.type,
        message: formData.message,
        dueDate: formData.dueDate,
        sent: false,
        sentVia: [],
      });

      setFormData({
        memberId: '',
        type: 'membership_expiry',
        message: '',
        dueDate: new Date().toISOString().split('T')[0],
      });
      setIsModalOpen(false);
      await refreshData();
    } catch (error) {
      alert('Error creating reminder');
      console.error(error);
    }
  };

  const handleSendEmail = async (reminder: Reminder) => {
    const member = members.find(m => m.id === reminder.memberId);
    if (!member) return;

    try {
      const sent = await sendReminderEmail(
        member.email,
        member.name,
        reminderTypes[reminder.type],
        reminder.message
      );

      if (sent) {
        alert('Email draft opened in Gmail! You can review and send it.');
      }
    } catch (error) {
      alert('Error opening Gmail');
      console.error(error);
    }
  };

  const handleSendWhatsApp = async (reminder: Reminder) => {
    const member = members.find(m => m.id === reminder.memberId);
    if (!member || !member.whatsappOptIn) {
      alert('Member has not opted in for WhatsApp notifications');
      return;
    }

    try {
      const sent = await sendReminderWhatsApp(
        member.phone,
        member.name,
        reminder.message
      );

      if (sent) {
        alert('WhatsApp Web opened! You can review and send the message.');
      }
    } catch (error) {
      alert('Error opening WhatsApp');
      console.error(error);
    }
  };

  const getMessagePreview = (type: string): string => {
    switch (type) {
      case 'membership_expiry':
        return "Your gym membership is expiring soon. Please renew to continue your membership.";
      case 'payment_due':
        return "Your gym bill is due. Please make payment at your earliest convenience.";
      case 'payment_overdue':
        return "Your payment is overdue. Please settle the amount immediately.";
      default:
        return "";
    }
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem'}}>
      {/* Professional Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        padding: isMobile ? '1rem' : '2rem',
        borderRadius: '8px',
        display: 'flex',
        flexDirection: isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: isMobile ? 'flex-start' : 'center',
        gap: isMobile ? '0.8rem' : 0
      }}>
        <div>
          <h1 style={{fontSize: isMobile ? '1.35rem' : '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem'}}>Reminders</h1>
          <p style={{fontSize: '0.875rem', color: '#cbd5e1'}}>Send timely notifications to members</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.5rem',
            width: isMobile ? '100%' : 'auto',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 200ms',
            boxShadow: '0 2px 4px rgba(14, 165, 233, 0.2)',
            whiteSpace: 'nowrap'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 8px rgba(14, 165, 233, 0.3)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 4px rgba(14, 165, 233, 0.2)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          <Plus size={20} />
          <span>Create Reminder</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fit, minmax(200px, 1fr))', gap: isMobile ? '0.75rem' : '1rem'}}>
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1.5rem'
        }}>
          <p style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem'}}>Total Reminders</p>
          <p style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#0369a1'}}>{reminders.length}</p>
        </div>
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1.5rem'
        }}>
          <p style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem'}}>Sent</p>
          <p style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#10b981'}}>{reminders.filter(r => r.sent).length}</p>
        </div>
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1.5rem'
        }}>
          <p style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem'}}>Pending</p>
          <p style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#f97316'}}>{reminders.filter(r => !r.sent).length}</p>
        </div>
      </div>

      {/* Search Bar */}
      <div style={{position: 'relative'}}>
        <Search size={18} style={{position: 'absolute', left: '1rem', top: '0.875rem', color: '#94a3b8'}} />
        <input
          type="text"
          placeholder="Search by member name or ID..."
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
          style={{
            width: '100%',
            paddingLeft: '2.75rem',
            paddingRight: '1rem',
            paddingTop: '0.75rem',
            paddingBottom: '0.75rem',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '0.95rem',
            transition: 'all 200ms'
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#0ea5e9';
            e.currentTarget.style.boxShadow = '0 0 0 3px rgba(14, 165, 233, 0.1)';
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = '#cbd5e1';
            e.currentTarget.style.boxShadow = 'none';
          }}
        />
      </div>

      {/* Reminders Table */}
      {filteredReminders.length > 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden'
        }}>
          <div style={{overflowX: 'auto'}}>
            <table style={{width: '100%', borderCollapse: 'collapse'}}>
              <thead>
                <tr style={{background: '#f8fafc', borderBottom: '1px solid #e2e8f0'}}>
                  <th style={{padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Member</th>
                  <th style={{padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Type</th>
                  <th style={{padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Message</th>
                  <th style={{padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Due Date</th>
                  <th style={{padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Status</th>
                  <th style={{padding: '1rem 1.25rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredReminders.map((reminder) => (
                  <tr 
                    key={reminder.id} 
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      transition: 'background-color 200ms'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{padding: '1rem 1.25rem'}}>
                      <div style={{fontWeight: '600', color: '#1e293b'}}>{reminder.memberName}</div>
                      <div style={{fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem'}}>ID: {reminder.memberId}</div>
                    </td>
                    <td style={{padding: '1rem 1.25rem'}}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.375rem 0.75rem',
                        background: '#f0f9ff',
                        color: '#0369a1',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: '500'
                      }}>
                        {reminderTypes[reminder.type]}
                      </span>
                    </td>
                    <td style={{padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#64748b', maxWidth: '300px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'}}>
                      {reminder.message}
                    </td>
                    <td style={{padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#64748b'}}>{formatDate(reminder.dueDate)}</td>
                    <td style={{padding: '1rem 1.25rem'}}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.375rem 0.75rem',
                        background: reminder.sent ? '#dcfce7' : '#fef3c7',
                        color: reminder.sent ? '#166534' : '#92400e',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {reminder.sent ? '● Sent' : '● Pending'}
                      </span>
                    </td>
                    <td style={{padding: '1rem 1.25rem'}}>
                      <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem'}}>
                        <button
                          onClick={() => handleSendEmail(reminder)}
                          disabled={reminder.sentVia.includes('email')}
                          style={{
                            padding: '0.5rem 0.75rem',
                            background: reminder.sentVia.includes('email') ? '#dcfce7' : '#f0f9ff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: reminder.sentVia.includes('email') ? 'default' : 'pointer',
                            color: reminder.sentVia.includes('email') ? '#166534' : '#0369a1',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            transition: 'all 200ms',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            opacity: reminder.sentVia.includes('email') ? 0.6 : 1
                          }}
                          onMouseEnter={(e) => !reminder.sentVia.includes('email') && (e.currentTarget.style.background = '#e0f2fe')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = reminder.sentVia.includes('email') ? '#dcfce7' : '#f0f9ff')}
                          title="Send Email"
                        >
                          <Mail size={14} />
                        </button>
                        <button
                          onClick={() => handleSendWhatsApp(reminder)}
                          disabled={reminder.sentVia.includes('whatsapp')}
                          style={{
                            padding: '0.5rem 0.75rem',
                            background: reminder.sentVia.includes('whatsapp') ? '#dcfce7' : '#f0fdf4',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: reminder.sentVia.includes('whatsapp') ? 'default' : 'pointer',
                            color: reminder.sentVia.includes('whatsapp') ? '#166534' : '#10b981',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            transition: 'all 200ms',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            opacity: reminder.sentVia.includes('whatsapp') ? 0.6 : 1
                          }}
                          onMouseEnter={(e) => !reminder.sentVia.includes('whatsapp') && (e.currentTarget.style.background = '#e0fdf4')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = reminder.sentVia.includes('whatsapp') ? '#dcfce7' : '#f0fdf4')}
                          title="Send WhatsApp"
                        >
                          <MessageCircle size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div style={{
          textAlign: 'center',
          paddingTop: '3rem',
          paddingBottom: '3rem',
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          color: '#94a3b8'
        }}>
          <MessageCircle size={48} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: '1rem', opacity: 0.5}} />
          <p style={{fontSize: '1.125rem', fontWeight: '600', color: '#1e293b'}}>No reminders found</p>
          <p style={{fontSize: '0.875rem', marginTop: '0.5rem', color: '#64748b'}}>Create your first reminder to keep members updated</p>
        </div>
      )}

      {/* Create Reminder Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Create New Reminder"
        onClose={() => setIsModalOpen(false)}
      >
        <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
          <div>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem',
              fontSize: '0.95rem'
            }}>Member *</label>
            <select
              value={formData.memberId}
              onChange={e => setFormData({ ...formData, memberId: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            >
              <option value="">Select a member</option>
              {members.map(m => (
                <option key={m.id} value={m.id}>
                  {m.name} - {m.email}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem',
              fontSize: '0.95rem'
            }}>Reminder Type *</label>
            <select
              value={formData.type}
              onChange={e => {
                setFormData({
                  ...formData,
                  type: e.target.value as 'membership_expiry' | 'payment_due' | 'payment_overdue',
                  message: getMessagePreview(e.target.value),
                });
              }}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            >
              <option value="membership_expiry">Membership Expiry</option>
              <option value="payment_due">Payment Due</option>
              <option value="payment_overdue">Payment Overdue</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem',
              fontSize: '0.95rem'
            }}>Due Date *</label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={e => setFormData({ ...formData, dueDate: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem',
              fontSize: '0.95rem'
            }}>Message *</label>
            <textarea
              value={formData.message}
              onChange={e => setFormData({ ...formData, message: e.target.value })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontFamily: 'inherit',
                minHeight: '70px',
                resize: 'none'
              }}
              placeholder=""
            />
          </div>

          <div style={{display: 'flex', gap: '1rem', paddingTop: '1rem'}}>
            <button
              onClick={handleCreateReminder}
              style={{
                flex: 1,
                padding: '0.85rem 1.5rem',
                background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 200ms'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 8px rgba(14, 165, 233, 0.3)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.boxShadow = 'none';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              Create Reminder
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                flex: 1,
                padding: '0.85rem 1.5rem',
                background: '#f1f5f9',
                color: '#1e293b',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 200ms'
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#e2e8f0';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = '#f1f5f9';
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
};
