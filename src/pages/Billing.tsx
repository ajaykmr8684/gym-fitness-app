import { useState } from 'react';
import { Plus, Mail, MessageCircle, Download, Trash2, Search, FileText, CheckCircle2 } from 'lucide-react';
import { Modal } from '../components/Modal';
import { useAppContext } from '../context/AppContext';
import { addBill, updateBill, formatDate } from '../utils/db';
import { sendBillEmail, sendBillWhatsApp } from '../utils/notifications';
import { generateBillPDF } from '../utils/pdf';
import { Bill, Member } from '../types';

export const Billing = () => {
  const { members, bills, refreshData } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    memberId: '',
    amount: 0,
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
  });

  const selectedMember = members.find(m => m.id === formData.memberId);
  const filteredBills = bills.filter(b =>
    b.memberName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    b.memberId.includes(searchTerm)
  );

  const handleCreateBill = async () => {
    if (!formData.memberId || !formData.amount) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      const member = members.find(m => m.id === formData.memberId);
      if (!member) return;

      await addBill({
        memberId: formData.memberId,
        memberName: member.name,
        planType: member.planType || 'monthly',
        amount: formData.amount,
        amountPaid: 0,
        billingDate: new Date().toISOString().split('T')[0],
        dueDate: formData.dueDate,
        status: 'pending',
        notes: formData.notes,
        emailSent: false,
        whatsappSent: false,
      });

      setFormData({
        memberId: '',
        amount: 0,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        notes: '',
      });
      setIsModalOpen(false);
      await refreshData();
    } catch (error) {
      alert('Error creating bill');
      console.error(error);
    }
  };

  const handleSendEmail = async (bill: Bill) => {
    const member = members.find(m => m.id === bill.memberId);
    if (!member) return;

    try {
      const sent = await sendBillEmail(
        member.email,
        member.name,
        bill.amount,
        bill.billingDate,
        bill.dueDate
      );

      if (sent) {
        alert('Email draft opened in Gmail! You can review and send it.');
      }
    } catch (error) {
      alert('Error opening Gmail');
      console.error(error);
    }
  };

  const handleSendWhatsApp = async (bill: Bill) => {
    const member = members.find(m => m.id === bill.memberId);
    if (!member) return;

    try {
      const sent = await sendBillWhatsApp(
        member.phone,
        member.name,
        bill.amount,
        bill.dueDate
      );

      if (sent) {
        alert('WhatsApp Web opened! You can review and send the message.');
      }
    } catch (error) {
      alert('Error opening WhatsApp');
      console.error(error);
    }
  };

  const handleDeleteBill = async (id: string) => {
    // Since we can't delete in Firestore easily with updateDoc, we'll mark it as paid
    // In a real app, you'd want actual delete capability
    alert('Use the amount paid field to mark bills as completed');
  };

  const markAsPaid = async (bill: Bill) => {
    try {
      await updateBill(bill.id, { 
        status: 'paid',
        amountPaid: bill.amount
      });
      await refreshData();
      alert('Bill marked as paid!');
    } catch (error) {
      alert('Error updating bill');
      console.error(error);
    }
  };

  const handleDownloadPDF = (bill: Bill) => {
    const member = members.find(m => m.id === bill.memberId);
    if (!member) return;
    
    generateBillPDF(bill, member);
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
      {/* Professional Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        padding: '2rem',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem'}}>Billing</h1>
          <p style={{fontSize: '0.875rem', color: '#cbd5e1'}}>Manage and track member payments</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.85rem 1.5rem',
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
          <span>Create Bill</span>
        </button>
      </div>

      {/* Summary Cards */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem'}}>
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1.5rem'
        }}>
          <p style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem'}}>Total Bills</p>
          <p style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#0369a1'}}>{bills.length}</p>
        </div>
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1.5rem'
        }}>
          <p style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem'}}>Paid</p>
          <p style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#10b981'}}>{bills.filter(b => b.status === 'paid').length}</p>
        </div>
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '8px',
          padding: '1.5rem'
        }}>
          <p style={{fontSize: '0.875rem', color: '#64748b', marginBottom: '0.5rem'}}>Pending</p>
          <p style={{fontSize: '1.875rem', fontWeight: 'bold', color: '#f97316'}}>{bills.filter(b => b.status === 'pending').length}</p>
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

      {/* Bills Table */}
      {filteredBills.length > 0 ? (
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
                  <th style={{padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Amount</th>
                  <th style={{padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Billing Date</th>
                  <th style={{padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Due Date</th>
                  <th style={{padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Status</th>
                  <th style={{padding: '1rem 1.25rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredBills.map((bill) => (
                  <tr 
                    key={bill.id} 
                    style={{
                      borderBottom: '1px solid #e2e8f0',
                      transition: 'background-color 200ms'
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{padding: '1rem 1.25rem'}}>
                      <div style={{fontWeight: '600', color: '#1e293b'}}>{bill.memberName}</div>
                      <div style={{fontSize: '0.85rem', color: '#64748b', marginTop: '0.25rem'}}>ID: {bill.memberId}</div>
                    </td>
                    <td style={{padding: '1rem 1.25rem', fontWeight: 'bold', color: '#0369a1'}}>₹{bill.amount}</td>
                    <td style={{padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#64748b'}}>{formatDate(bill.billingDate)}</td>
                    <td style={{padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#64748b'}}>{formatDate(bill.dueDate)}</td>
                    <td style={{padding: '1rem 1.25rem'}}>
                      <span style={{
                        display: 'inline-block',
                        padding: '0.375rem 0.75rem',
                        background: bill.status === 'paid' ? '#dcfce7' : '#fef3c7',
                        color: bill.status === 'paid' ? '#166534' : '#92400e',
                        borderRadius: '4px',
                        fontSize: '0.85rem',
                        fontWeight: '600'
                      }}>
                        {bill.status === 'paid' ? '● Paid' : '● Pending'}
                      </span>
                    </td>
                    <td style={{padding: '1rem 1.25rem'}}>
                      <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem', flexWrap: 'wrap'}}>
                        <button
                          onClick={() => handleDownloadPDF(bill)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            background: '#f0f9ff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#0369a1',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            transition: 'all 200ms',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#e0f2fe')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#f0f9ff')}
                          title="Download PDF"
                        >
                          <FileText size={14} />
                          PDF
                        </button>
                        <button
                          onClick={() => handleSendEmail(bill)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            background: '#f0f9ff',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#0369a1',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            transition: 'all 200ms',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#e0f2fe')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#f0f9ff')}
                          title="Send Email"
                        >
                          <Mail size={14} />
                        </button>
                        <button
                          onClick={() => handleSendWhatsApp(bill)}
                          style={{
                            padding: '0.5rem 0.75rem',
                            background: '#f0fdf4',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            color: '#10b981',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            transition: 'all 200ms',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem'
                          }}
                          onMouseEnter={(e) => (e.currentTarget.style.background = '#e0fdf4')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = '#f0fdf4')}
                          title="Send WhatsApp"
                        >
                          <MessageCircle size={14} />
                        </button>
                        <button
                          onClick={() => markAsPaid(bill)}
                          disabled={bill.status === 'paid'}
                          style={{
                            padding: '0.5rem 0.75rem',
                            background: bill.status === 'paid' ? '#dcfce7' : '#fef3c7',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: bill.status === 'paid' ? 'not-allowed' : 'pointer',
                            color: bill.status === 'paid' ? '#166534' : '#92400e',
                            fontSize: '0.85rem',
                            fontWeight: '600',
                            transition: 'all 200ms',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.375rem',
                            opacity: bill.status === 'paid' ? 0.6 : 1
                          }}
                          onMouseEnter={(e) => bill.status !== 'paid' && (e.currentTarget.style.background = '#fde68a')}
                          onMouseLeave={(e) => (e.currentTarget.style.background = bill.status === 'paid' ? '#dcfce7' : '#fef3c7')}
                          title="Mark as Paid"
                        >
                          <CheckCircle2 size={14} />
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
          <FileText size={48} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: '1rem', opacity: 0.5}} />
          <p style={{fontSize: '1.125rem', fontWeight: '600', color: '#1e293b'}}>No bills found</p>
          <p style={{fontSize: '0.875rem', marginTop: '0.5rem', color: '#64748b'}}>Create your first bill to get started</p>
        </div>
      )}

      {/* Create Bill Modal */}
      <Modal
        isOpen={isModalOpen}
        title="Create New Bill"
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

          {selectedMember && (
            <div style={{
              background: '#f0f9ff',
              padding: '1rem',
              borderRadius: '6px',
              border: '1px solid #e0f2fe',
              fontSize: '0.9rem'
            }}>
              <p style={{color: '#0369a1', marginBottom: '0.25rem'}}><strong>Member:</strong> {selectedMember.name}</p>
              <p style={{color: '#0369a1', marginBottom: '0.25rem'}}><strong>Default Amount:</strong> ₹{selectedMember.amount}</p>
              <p style={{color: '#0369a1'}}><strong>Plan:</strong> {selectedMember.planType.charAt(0).toUpperCase() + selectedMember.planType.slice(1)}</p>
            </div>
          )}

          <div>
            <label style={{
              display: 'block',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '0.5rem',
              fontSize: '0.95rem'
            }}>Amount *</label>
            <input
              type="number"
              value={formData.amount || ''}
              onChange={e => setFormData({ ...formData, amount: parseFloat(e.target.value) || 0 })}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '1px solid #cbd5e1',
                borderRadius: '6px',
                fontSize: '0.95rem',
                fontFamily: 'inherit'
              }}
              placeholder="0"
            />
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
            }}>Notes</label>
            <textarea
              value={formData.notes}
              onChange={e => setFormData({ ...formData, notes: e.target.value })}
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
              placeholder="Any additional notes..."
            />
          </div>

          <div style={{display: 'flex', gap: '1rem', paddingTop: '1rem'}}>
            <button
              onClick={handleCreateBill}
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
              Create Bill
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
