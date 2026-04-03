import { useState, ReactNode } from 'react';
import { Plus, Edit, Trash2, Search, Users, Eye, RefreshCw, Filter } from 'lucide-react';
import { Modal } from '../components/Modal';
import { MemberForm } from '../components/MemberForm';
import { useAppContext } from '../context/AppContext';
import { Member } from '../types';
import { addMember, updateMember, deleteMember, formatDate, membershipPlans } from '../utils/db';
import { useIsMobile } from '../hooks/useIsMobile';

type StatusFilter = 'all' | 'active' | 'inactive' | 'expired';

const getEffectiveStatus = (member: Member): 'active' | 'inactive' | 'expired' => {
  if (member.status !== 'active') return member.status as 'inactive';
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(member.expiryDate);
  expiry.setHours(0, 0, 0, 0);
  if (expiry < today) return 'expired';
  return 'active';
};

const STATUS_BADGE: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: '#dcfce7', color: '#166534', label: '● Active' },
  inactive: { bg: '#fef3c7', color: '#92400e', label: '● Inactive' },
  expired: { bg: '#fee2e2', color: '#991b1b', label: '● Expired' },
};

export const Members = () => {
  const { members, refreshData } = useAppContext();
  const isMobile = useIsMobile();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMember, setSelectedMember] = useState<Member | null>(null);
  const [viewMember, setViewMember] = useState<Member | null>(null);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all');
  const [renewingMemberId, setRenewingMemberId] = useState<string | null>(null);

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.phone.includes(searchTerm);
    if (!matchesSearch) return false;
    if (statusFilter === 'all') return true;
    return getEffectiveStatus(m) === statusFilter;
  });

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

  const handleRenewMember = async (member: Member) => {
    if (renewingMemberId === member.id) return;
    if (!window.confirm(`Renew ${member.name}'s ${member.planType} plan?`)) return;

    setRenewingMemberId(member.id);
    try {
      const plan = membershipPlans.find((p) => p.type === member.planType);
      const duration = plan?.duration ?? 30;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const currentExpiry = new Date(member.expiryDate);
      currentExpiry.setHours(0, 0, 0, 0);

      const base = currentExpiry > today ? new Date(currentExpiry) : new Date(today);
      base.setDate(base.getDate() + duration);
      const newExpiry = base.toISOString().split('T')[0];

      await updateMember(member.id, { expiryDate: newExpiry, status: 'active' });
      await refreshData();
    } catch (error) {
      alert('Error renewing member');
      console.error(error);
    } finally {
      setRenewingMemberId(null);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: isMobile ? '1rem' : '1.5rem' }}>
      <div
        style={{
          background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
          color: 'white',
          padding: isMobile ? '1rem' : '1.5rem 2rem',
          borderRadius: '8px',
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'space-between',
          alignItems: isMobile ? 'flex-start' : 'center',
          gap: isMobile ? '0.8rem' : 0,
        }}
      >
        <div>
          <h1 style={{ fontSize: isMobile ? '1.35rem' : '1.75rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>Members</h1>
          <p style={{ fontSize: '0.875rem', color: '#cbd5e1' }}>Total: {members.length} members</p>
        </div>
        <button
          onClick={handleOpenAddModal}
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
            whiteSpace: 'nowrap',
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

      <div style={{ display: 'flex', gap: '0.75rem', alignItems: isMobile ? 'stretch' : 'center', flexDirection: isMobile ? 'column' : 'row' }}>
        <div style={{ position: 'relative', flex: 1 }}>
          <Search size={18} style={{ position: 'absolute', left: '1rem', top: '0.875rem', color: '#94a3b8' }} />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: '100%',
              paddingLeft: '2.75rem',
              paddingRight: '1rem',
              paddingTop: '0.75rem',
              paddingBottom: '0.75rem',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '0.95rem',
              transition: 'all 200ms',
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
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0, width: isMobile ? '100%' : 'auto' }}>
          <Filter size={16} style={{ color: '#64748b' }} />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
            style={{
              width: isMobile ? '100%' : 'auto',
              padding: '0.75rem 1rem',
              border: '1px solid #cbd5e1',
              borderRadius: '6px',
              fontSize: '0.9rem',
              background: 'white',
              color: '#1e293b',
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="expired">Expired</option>
          </select>
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '8px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Name</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Email</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Phone</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Plan</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Expiry</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'left', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Status</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'right', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Amount</th>
                <th style={{ padding: '1rem 1.25rem', textAlign: 'center', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => {
                const effStatus = getEffectiveStatus(member);
                const badge = STATUS_BADGE[effStatus];
                return (
                  <tr
                    key={member.id}
                    style={{ borderBottom: '1px solid #e2e8f0', transition: 'background-color 200ms' }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
                  >
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div
                          style={{
                            width: '32px',
                            height: '32px',
                            background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                          }}
                        >
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        <button
                          onClick={() => setViewMember(member)}
                          style={{ fontWeight: '600', color: '#1e293b', background: 'none', border: 'none', cursor: 'pointer', padding: 0, fontSize: '0.9rem' }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.color = '#0ea5e9')}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.color = '#1e293b')}
                        >
                          {member.name}
                        </button>
                      </div>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#64748b' }}>{member.email}</td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: '#64748b' }}>{member.phone}</td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ display: 'inline-block', padding: '0.375rem 0.75rem', background: '#f0f9ff', color: '#0369a1', borderRadius: '4px', fontSize: '0.85rem', fontWeight: '500' }}>
                        {member.planType.charAt(0).toUpperCase() + member.planType.slice(1)}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', fontSize: '0.9rem', color: effStatus === 'expired' ? '#dc2626' : '#64748b', fontWeight: effStatus === 'expired' ? '600' : '400' }}>
                      {formatDate(member.expiryDate)}
                    </td>
                    <td style={{ padding: '1rem 1.25rem' }}>
                      <span style={{ display: 'inline-block', padding: '0.375rem 0.75rem', background: badge.bg, color: badge.color, borderRadius: '4px', fontSize: '0.85rem', fontWeight: '600' }}>
                        {badge.label}
                      </span>
                    </td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'right', fontWeight: 'bold', color: '#0369a1' }}>₹{member.amount}</td>
                    <td style={{ padding: '1rem 1.25rem', textAlign: 'center' }}>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                        <button
                          onClick={() => setViewMember(member)}
                          style={{ padding: '0.5rem', background: '#f0f9ff', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#0369a1', transition: 'all 200ms', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#e0f2fe')}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#f0f9ff')}
                          title="View Details"
                        >
                          <Eye size={16} />
                        </button>
                        <button
                          onClick={() => handleRenewMember(member)}
                          disabled={renewingMemberId === member.id}
                          style={{ padding: '0.5rem', background: '#f0fdf4', border: 'none', borderRadius: '6px', cursor: renewingMemberId === member.id ? 'not-allowed' : 'pointer', color: '#10b981', transition: 'all 200ms', display: 'flex', alignItems: 'center', justifyContent: 'center', opacity: renewingMemberId === member.id ? 0.6 : 1 }}
                          onMouseEnter={(e) => {
                            if (renewingMemberId !== member.id) (e.currentTarget as HTMLElement).style.background = '#dcfce7';
                          }}
                          onMouseLeave={(e) => {
                            (e.currentTarget as HTMLElement).style.background = '#f0fdf4';
                          }}
                          title="Renew Membership"
                        >
                          <RefreshCw size={16} />
                        </button>
                        <button
                          onClick={() => handleOpenEditModal(member)}
                          style={{ padding: '0.5rem', background: '#f0f9ff', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#0369a1', transition: 'all 200ms', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#e0f2fe')}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#f0f9ff')}
                          title="Edit"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteMember(member.id)}
                          style={{ padding: '0.5rem', background: '#fef2f2', border: 'none', borderRadius: '6px', cursor: 'pointer', color: '#dc2626', transition: 'all 200ms', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.background = '#fee2e2')}
                          onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.background = '#fef2f2')}
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredMembers.length === 0 && (
          <div style={{ textAlign: 'center', paddingTop: '3rem', paddingBottom: '3rem', color: '#94a3b8' }}>
            <Users size={48} style={{ marginLeft: 'auto', marginRight: 'auto', marginBottom: '1rem', opacity: 0.5 }} />
            <p style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1e293b' }}>No members found</p>
            <p style={{ fontSize: '0.875rem', marginTop: '0.5rem' }}>Try a different search or add a new member</p>
          </div>
        )}
      </div>

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

      <Modal isOpen={viewMember !== null} title="Member Details" onClose={() => setViewMember(null)}>
        {viewMember && (
          <MemberDetailView
            member={viewMember}
            onEdit={() => {
              setViewMember(null);
              handleOpenEditModal(viewMember);
            }}
            onClose={() => setViewMember(null)}
          />
        )}
      </Modal>
    </div>
  );
};

const Section = ({ label, children }: { label: string; children: ReactNode }) => (
  <div>
    <p
      style={{
        fontSize: '0.75rem',
        fontWeight: '700',
        color: '#94a3b8',
        textTransform: 'uppercase',
        letterSpacing: '0.05em',
        marginBottom: '0.5rem',
      }}
    >
      {label}
    </p>
    {children}
  </div>
);

const Row = ({ label, value }: { label: string; value: ReactNode }) => (
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0', borderBottom: '1px solid #f1f5f9' }}>
    <span style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: '500', minWidth: '130px' }}>{label}</span>
    <span style={{ fontSize: '0.9rem', color: '#1e293b', fontWeight: '600', textAlign: 'right' }}>{value}</span>
  </div>
);

const MemberDetailView = ({
  member,
  onEdit,
  onClose,
}: {
  member: Member;
  onEdit: () => void;
  onClose: () => void;
}) => {
  const effStatus = getEffectiveStatus(member);
  const badge = STATUS_BADGE[effStatus];
  const features = [
    member.strength && 'Strength',
    member.cardio && 'Cardio',
    member.training && 'Personal Training',
  ]
    .filter(Boolean)
    .join(' + ');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '1rem', background: '#f0f9ff', borderRadius: '8px' }}>
        <div
          style={{
            width: '52px',
            height: '52px',
            background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.25rem',
            flexShrink: 0,
          }}
        >
          {member.name.charAt(0).toUpperCase()}
        </div>
        <div>
          <p style={{ fontSize: '1.1rem', fontWeight: '700', color: '#0f172a', margin: 0 }}>{member.name}</p>
          <span
            style={{
              display: 'inline-block',
              marginTop: '0.25rem',
              padding: '0.2rem 0.6rem',
              borderRadius: '4px',
              background: badge.bg,
              color: badge.color,
              fontSize: '0.8rem',
              fontWeight: '600',
            }}
          >
            {badge.label}
          </span>
        </div>
      </div>

      <Section label="Contact">
        <Row label="Email" value={member.email} />
        <Row label="Phone" value={member.phone} />
        <Row label="WhatsApp" value={member.whatsappOptIn ? '✓ Opted in' : '✗ Not opted in'} />
      </Section>

      <Section label="Membership">
        <Row label="Plan" value={member.planType.charAt(0).toUpperCase() + member.planType.slice(1)} />
        <Row label="Features" value={features || '—'} />
        <Row label="Join Date" value={formatDate(member.joinDate)} />
        <Row
          label="Expiry Date"
          value={<span style={{ color: effStatus === 'expired' ? '#dc2626' : '#1e293b' }}>{formatDate(member.expiryDate)}</span>}
        />
      </Section>

      <Section label="Billing">
        <Row label="Plan Amount" value={`₹${member.amount}`} />
        <Row label="Amount Paid" value={`₹${member.amountPaid}`} />
        {member.discountPercentage > 0 && <Row label="Discount" value={`${member.discountPercentage}%`} />}
      </Section>

      {member.notes && (
        <Section label="Notes">
          <p style={{ fontSize: '0.9rem', color: '#1e293b', margin: 0 }}>{member.notes}</p>
        </Section>
      )}

      <div style={{ display: 'flex', gap: '1rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
        <button
          onClick={onEdit}
          style={{
            flex: 1,
            padding: '0.75rem',
            background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          Edit Member
        </button>
        <button
          onClick={onClose}
          style={{
            flex: 1,
            padding: '0.75rem',
            background: '#f1f5f9',
            color: '#64748b',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
          }}
        >
          Close
        </button>
      </div>
    </div>
  );
};
