import { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { Users, FileText, AlertCircle, TrendingUp, Target, Activity, ArrowUp, Database } from 'lucide-react';
import { seedDatabase } from '../utils/seedData';

export const Dashboard = () => {
  const { members, bills, refreshData } = useAppContext();
  const [seeding, setSeeding] = useState(false);
  const [seedMessage, setSeedMessage] = useState('');

  const handleSeedData = async () => {
    setSeeding(true);
    setSeedMessage('');
    try {
      const result = await seedDatabase();
      setSeedMessage(result.message);
      await refreshData();
      setTimeout(() => setSeedMessage(''), 5000);
    } catch (error) {
      setSeedMessage(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setSeeding(false);
    }
  };

  const activeMembers = members.filter(m => m.status === 'active').length;
  const totalRevenue = members.reduce((sum, m) => sum + m.amount, 0);
  const paidAmount = members.reduce((sum, m) => sum + m.amountPaid, 0);
  const pendingBills = bills.filter(b => b.status === 'pending').length;
  const overdueAmount = bills.filter(b => b.status === 'overdue').reduce((sum, b) => sum + (b.amount - b.amountPaid), 0);

  return (
    <div style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
      {/* Professional Header - Company Name with Seed Button */}
      <div style={{
        background: 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
        color: 'white',
        padding: '2.5rem 2rem',
        borderRadius: '12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        boxShadow: '0 4px 15px rgba(14, 165, 233, 0.2)'
      }}>
        <div style={{fontSize: '2.8rem', fontWeight: '800', letterSpacing: '-0.5px', textShadow: '0 2px 4px rgba(0,0,0,0.1)'}}>Shri Ram Fitness</div>
        {members.length === 0 && (
          <button
            onClick={handleSeedData}
            disabled={seeding}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 1.25rem',
              backgroundColor: 'rgba(255, 255, 255, 0.25)',
              border: '2px solid rgba(255, 255, 255, 0.5)',
              borderRadius: '8px',
              color: 'white',
              fontWeight: '600',
              fontSize: '0.9rem',
              cursor: seeding ? 'not-allowed' : 'pointer',
              opacity: seeding ? 0.7 : 1,
              transition: 'all 200ms',
              backdropFilter: 'blur(10px)'
            }}
            onMouseEnter={(e) => {
              if (!seeding) {
                (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.35)';
              }
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.backgroundColor = 'rgba(255, 255, 255, 0.25)';
            }}
          >
            <Database size={18} />
            {seeding ? 'Seeding...' : 'Load Demo Data'}
          </button>
        )}
      </div>

      {/* Seed Message */}
      {seedMessage && (
        <div style={{
          padding: '1rem',
          backgroundColor: seedMessage.includes('Error') ? '#fee2e2' : '#dcfce7',
          border: `1px solid ${seedMessage.includes('Error') ? '#fca5a5' : '#86efac'}`,
          borderRadius: '8px',
          color: seedMessage.includes('Error') ? '#991b1b' : '#166534',
          fontSize: '0.9rem',
          fontWeight: '500'
        }}>
          {seedMessage}
        </div>
      )}

      {/* Stats Cards - Fully Horizontal - ALL IN ONE ROW */}
      <div style={{display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '1rem'}}>
        <StatCard 
          icon={Users}
          label="Active Members"
          value={activeMembers}
          color="#0ea5e9"
          bgColor="#f0f9ff"
          trend="+12%"
        />
        <StatCard 
          icon={FileText}
          label="Pending Bills"
          value={pendingBills}
          color="#06b6d4"
          bgColor="#ecf0ff"
          trend=""
        />
        <StatCard 
          icon={TrendingUp}
          label="Total Revenue"
          value={`₹${totalRevenue}`}
          color="#10b981"
          bgColor="#f0fdf4"
          trend="+8%"
        />
        <StatCard 
          icon={AlertCircle}
          label="Overdue Amount"
          value={`₹${overdueAmount}`}
          color="#f97316"
          bgColor="#fff7ed"
          trend=""
        />
      </div>

      {/* Main Content - Compact & Horizontal */}
      <div style={{display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.5rem'}}>
        {/* Recent Members - Compact */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Users size={18} color="#0ea5e9" />
            <h3 style={{fontSize: '0.95rem', fontWeight: '600', color: '#1e293b'}}>Recent Members</h3>
          </div>
          
          <div style={{padding: '0.75rem', flex: 1, overflowY: 'auto'}}>
            {members.length > 0 ? (
              <div style={{display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
                {members.slice(-4).reverse().map((member) => (
                  <div 
                    key={member.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '0.625rem 0.75rem',
                      backgroundColor: '#f8fafc',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      cursor: 'pointer',
                      transition: 'background-color 200ms',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#f0f9ff')}
                    onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  >
                    <div style={{display: 'flex', alignItems: 'center', gap: '0.5rem', flex: 1, minWidth: 0}}>
                      <div style={{
                        width: '28px',
                        height: '28px',
                        background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white',
                        fontWeight: 'bold',
                        fontSize: '0.7rem'
                      }}>
                        {member.name.charAt(0).toUpperCase()}
                      </div>
                      <div style={{minWidth: 0}}>
                        <p style={{fontWeight: '500', color: '#1e293b', fontSize: '0.8rem'}}>{member.name.split(' ')[0]}</p>
                        <p style={{fontSize: '0.7rem', color: '#64748b'}}>{member.email.split('@')[0]}</p>
                      </div>
                    </div>
                    <span style={{
                      padding: '0.25rem 0.5rem',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: '500',
                      background: member.status === 'active' ? '#dcfce7' : '#fef3c7',
                      color: member.status === 'active' ? '#166534' : '#92400e',
                      flexShrink: 0
                    }}>
                      {member.status === 'active' ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p style={{textAlign: 'center', fontSize: '0.8rem', color: '#94a3b8', padding: '1rem 0'}}>
                No members yet
              </p>
            )}
          </div>
        </div>

        {/* Quick Actions - Compact */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Target size={18} color="#0ea5e9" />
            <h3 style={{fontSize: '0.95rem', fontWeight: '600', color: '#1e293b'}}>Quick Actions</h3>
          </div>
          
          <div style={{padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem'}}>
            <ActionButton 
              href="/members"
              icon={Users}
              label="Add Member"
              color="#0ea5e9"
            />
            <ActionButton 
              href="/billing"
              icon={FileText}
              label="Create Bill"
              color="#10b981"
            />
            <ActionButton 
              href="/reminders"
              icon={Activity}
              label="Send Reminder"
              color="#f97316"
            />
          </div>
        </div>

        {/* Summary Stats - Compact */}
        <div style={{
          background: 'white',
          borderRadius: '8px',
          border: '1px solid #e2e8f0',
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}>
          <div style={{
            padding: '1rem 1.25rem',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <TrendingUp size={18} color="#0ea5e9" />
            <h3 style={{fontSize: '0.95rem', fontWeight: '600', color: '#1e293b'}}>Summary</h3>
          </div>
          
          <div style={{padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>
            <SummaryStat label="Paid Amount" value={`₹${paidAmount}`} />
            <SummaryStat label="Pending Bills" value={pendingBills} />
            <SummaryStat label="Total Members" value={activeMembers} />
          </div>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon: Icon, label, value, color, bgColor, trend }: any) => (
  <div style={{
    background: bgColor,
    border: `1px solid ${color}40`,
    borderRadius: '8px',
    padding: '1.25rem',
    borderTop: `3px solid ${color}`
  }}>
    <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem'}}>
      <div style={{
        padding: '0.5rem',
        backgroundColor: `${color}20`,
        borderRadius: '6px'
      }}>
        <Icon size={20} color={color} />
      </div>
      {trend && (
        <div style={{display: 'flex', alignItems: 'center', gap: '0.25rem', fontSize: '0.75rem', fontWeight: '600', color: '#10b981'}}>
          <ArrowUp size={12} />
          {trend}
        </div>
      )}
    </div>
    <p style={{fontSize: '0.8rem', color: '#64748b', marginBottom: '0.375rem'}}>{label}</p>
    <p style={{fontSize: '1.75rem', fontWeight: 'bold', color: color}}>{value}</p>
  </div>
);

const ActionButton = ({ href, icon: Icon, label, color }: any) => (
  <a
    href={href}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem',
      backgroundColor: `${color}12`,
      border: `1px solid ${color}30`,
      borderRadius: '6px',
      textDecoration: 'none',
      color: color,
      fontWeight: '500',
      fontSize: '0.85rem',
      transition: 'all 200ms',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.backgroundColor = `${color}25`;
      (e.currentTarget as HTMLElement).style.borderColor = `${color}50`;
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.backgroundColor = `${color}12`;
      (e.currentTarget as HTMLElement).style.borderColor = `${color}30`;
    }}
  >
    <Icon size={16} />
    {label}
  </a>
);

const SummaryStat = ({ label, value }: any) => (
  <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingBottom: '0.75rem', borderBottom: '1px solid #e2e8f0'}}>
    <span style={{fontSize: '0.8rem', color: '#64748b', fontWeight: '500'}}>{label}</span>
    <span style={{fontSize: '1rem', fontWeight: 'bold', color: '#1e293b'}}>{value}</span>
  </div>
);
