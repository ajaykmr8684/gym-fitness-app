import { useState } from 'react';
import { Plus, Edit, Trash2, Search, Users } from 'lucide-react';
import { Modal } from '../components/Modal';
import { MemberForm } from '../components/MemberForm';
import { useAppContext } from '../context/AppContext';
import { addMember, updateMember, deleteMember, formatDate } from '../utils/db';
import { Member } from '../types';

export const Members = () => {
  const { members, refreshData } = useAppContext();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);

  const filteredMembers = members.filter(m =>
    m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.phone.includes(searchTerm)
  );

  const handleAddMember = async (data: Omit<Member, 'id'>) => {
    try {
      await addMember(data);
      setIsModalOpen(false);
      setSelectedMember(null);
      await refreshData();
    } catch (error) {
      alert('Error adding member');
      console.error(error);
    }
  };

  const handleUpdateMember = async (data: Omit<Member, 'id'>) => {
    if (!selectedMember) return;
    try {
      await updateMember(selectedMember.id, data);
      setIsModalOpen(false);
      setSelectedMember(null);
      await refreshData();
    } catch (error) {
      alert('Error updating member');
      console.error(error);
    }
  };

  const handleDeleteMember = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      try {
        await deleteMember(id);
        await refreshData();
      } catch (error) {
        alert('Error deleting member');
        console.error(error);
      }
    }
  };

  const handleOpenAddModal = () => {
    setSelectedMember(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (member: Member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
      {/* Professional Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        padding: '1.5rem 2rem',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <div>
          <h1 style={{fontSize: '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem'}}>Members</h1>
          <p style={{fontSize: '0.875rem', color: '#cbd5e1'}}>Total: {members.length} members</p>
        </div>
        <button
          onClick={handleOpenAddModal}
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
          <span>Add Member</span>
        </button>
      </div>

      {/* Search Bar */}
      <div style={{position: 'relative'}}>
        <Search size={18} style={{position: 'absolute', left: '1rem', top: '0.875rem', color: '#94a3b8'}} />
        <input
          type="text"
          placeholder="Search by name, email, or phone..."
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

      {/* Members Table - Professional */}
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
                <th style={{padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Name</th>
                <th style={{padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Email</th>
                <th style={{padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Phone</th>
                <th style={{padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Plan</th>
                <th style={{padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Expiry</th>
                <th style={{padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Status</th>
                <th style={{padding: '1rem 1.25rem', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Amount</th>
                <th style={{padding: '1rem 1.25rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr 
                  key={member.id} 
                  style={{
                    borderBottom: '1px solid #e2e8f0',
                    transition: 'background-color 200ms'
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <td style={{padding: '1rem 1.25rem'}}>
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.75rem'}}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.85rem'
                      }}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <span style={{fontWeight: '600', color: '#1e293b'}}>{member.name}</span>
                    </div>
                  </td>
                  <td style={{padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#64748b'}}>{member.email}</td>
                  <td style={{padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#64748b'}}>{member.phone}</td>
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
                      {member.membershipType}
                    </span>
                  </td>
                  <td style={{padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#64748b'}}>{formatDate(member.expiryDate)}</td>
                  <td style={{padding: '1rem 1.25rem'}}>
                    <span style={{
                      display: 'inline-block',
                      padding: '0.375rem 0.75rem',
                      background: member.status === 'active' ? '#dcfce7' : '#fef3c7',
                      color: member.status === 'active' ? '#166534' : '#92400e',
                      borderRadius: '4px',
                      fontSize: '0.85rem',
                      fontWeight: '600'
                    }}>
                      {member.status === 'active' ? '● Active' : '● Inactive'}
                    </span>
                  </td>
                  <td style={{padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 'bold', color: '#0369a1'}}>₹{member.amount}</td>
                  <td style={{padding: '1rem 1.25rem', textAlign: 'center'}}>
                    <div style={{display: 'flex', justifyContent: 'center', gap: '0.5rem'}}>
                      <button
                        onClick={() => handleOpenEditModal(member)}
                        style={{
                          padding: '0.5rem',
                          background: '#f0f9ff',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          color: '#0369a1',
                          transition: 'all 200ms',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#e0f2fe')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#f0f9ff')}
                        title="Edit"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteMember(member.id)}
                        style={{
                          padding: '0.5rem',
                          background: '#fef3c7',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          color: '#92400e',
                          transition: 'all 200ms',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                        onMouseEnter={(e) => (e.currentTarget.style.background = '#fde68a')}
                        onMouseLeave={(e) => (e.currentTarget.style.background = '#fef3c7')}
                        title="Delete"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredMembers.length === 0 && (
          <div style={{textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem', color: '#94a3b8'}}>
            <Users size={48} style={{marginLeft: 'auto', marginRight: 'auto', marginBottom: '1rem', opacity: 0.5}} />
            <p style={{fontSize: '1.125rem', fontWeight: '600', color: '#1e293b'}}>No members found</p>
            <p style={{fontSize: '0.875rem', marginTop: '0.5rem'}}>Try a different search or add a new member</p>
          </div>
        )}
      </div>

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        title={selectedMember ? 'Edit Member' : 'Add New Member'}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMember(null);
        }}
      >
        <MemberForm
          member={selectedMember || undefined}
          onSubmit={selectedMember ? handleUpdateMember : handleAddMember}
          onCancel={() => {
            setIsModalOpen(false);
            setSelectedMember(null);
          }}
        />
      </Modal>
    </div>
  );
};
