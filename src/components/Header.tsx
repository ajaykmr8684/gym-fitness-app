import { Link } from 'react-router-dom';
import { Users, FileText, Clock, Menu, X, BarChart3, Dumbbell, LogOut, User } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useIsMobile } from '../hooks/useIsMobile';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { logout, currentUsername } = useAuth();
  const isMobile = useIsMobile(900);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  return (
    <>
      <header style={{
        background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        color: 'white',
        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 50,
        borderBottom: '2px solid #0ea5e9'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: isMobile ? '0.8rem 0.9rem' : '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: isMobile ? '0.6rem' : '1rem',
            textDecoration: 'none',
            color: 'white',
            transition: 'opacity 200ms',
            cursor: 'pointer'
          }}
          onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.9')}
          onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
          >
            <div style={{
              background: 'linear-gradient(135deg, #0ea5e9, #0369a1)',
              padding: isMobile ? '0.45rem' : '0.6rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Dumbbell size={isMobile ? 20 : 28} style={{color: 'white'}} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.125rem'}}>
              <p style={{fontSize: isMobile ? '1rem' : '1.4rem', fontWeight: '800', margin: 0, letterSpacing: '-0.5px'}}>Shri Ram Fitness</p>
            </div>
          </Link>
          
          {!isMobile && (
          <nav style={{display: 'flex', gap: '0.25rem', alignItems: 'center'}}>
            <NavLink to="/dashboard" icon={BarChart3} label="Dashboard" />
            <NavLink to="/members" icon={Users} label="Members" />
            <NavLink to="/billing" icon={FileText} label="Billing" />
            <NavLink to="/reminders" icon={Clock} label="Reminders" />
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.45rem',
                padding: '0.55rem 0.75rem',
                marginLeft: '0.4rem',
                borderRadius: '6px',
                border: '1px solid #475569',
                background: 'rgba(15, 23, 42, 0.3)',
                color: '#e2e8f0',
                fontWeight: 600,
                fontSize: '0.82rem',
                cursor: 'pointer',
                transition: 'all 200ms',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#0ea5e9';
                (e.currentTarget as HTMLElement).style.color = '#7dd3fc';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = '#475569';
                (e.currentTarget as HTMLElement).style.color = '#e2e8f0';
              }}
            >
              <User size={14} />
              <span>{currentUsername || 'User'}</span>
              <LogOut size={14} />
            </button>
          </nav>
          )}

          <button
            style={{display: isMobile ? 'inline-flex' : 'none', background: 'rgba(14, 165, 233, 0.2)', border: 'none', color: 'white', padding: '0.45rem', borderRadius: '8px', cursor: 'pointer', transition: 'background 200ms'}}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(14, 165, 233, 0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(14, 165, 233, 0.2)')}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {isMobile && mobileMenuOpen && (
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '0.75rem 0.9rem',
            borderTop: '1px solid #334155',
            background: 'rgba(15, 23, 42, 0.8)'
          }}>
            <MobileNavLink
              to="/dashboard"
              icon={BarChart3}
              label="Dashboard"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/members"
              icon={Users}
              label="Members"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/billing"
              icon={FileText}
              label="Billing"
              onClick={() => setMobileMenuOpen(false)}
            />
            <MobileNavLink
              to="/reminders"
              icon={Clock}
              label="Reminders"
              onClick={() => setMobileMenuOpen(false)}
            />
            <button
              onClick={handleLogout}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem 1rem',
                background: 'rgba(239, 68, 68, 0.14)',
                border: '1px solid rgba(239, 68, 68, 0.35)',
                borderRadius: '6px',
                color: '#fecaca',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              <LogOut size={20} />
              <span>Logout ({currentUsername || 'User'})</span>
            </button>
          </nav>
        )}
      </header>
    </>
  );
};

const NavLink = ({ to, icon: Icon, label }: any) => (
  <Link
    to={to}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem',
      padding: '0.6rem 1rem',
      borderRadius: '6px',
      textDecoration: 'none',
      color: '#cbd5e1',
      fontWeight: '500',
      transition: 'all 200ms',
      cursor: 'pointer',
      fontSize: '0.9rem'
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.background = 'rgba(14, 165, 233, 0.15)';
      (e.currentTarget as HTMLElement).style.color = '#0ea5e9';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.background = 'transparent';
      (e.currentTarget as HTMLElement).style.color = '#cbd5e1';
    }}
  >
    <Icon size={18} />
    <span>{label}</span>
  </Link>
);

const MobileNavLink = ({ to, icon: Icon, label, onClick }: any) => (
  <Link
    to={to}
    onClick={onClick}
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
      padding: '0.75rem 1rem',
      background: 'rgba(14, 165, 233, 0.1)',
      borderRadius: '6px',
      textDecoration: 'none',
      color: '#cbd5e1',
      fontWeight: '500',
      transition: 'all 200ms',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => {
      (e.currentTarget as HTMLElement).style.background = 'rgba(14, 165, 233, 0.2)';
      (e.currentTarget as HTMLElement).style.color = '#0ea5e9';
    }}
    onMouseLeave={(e) => {
      (e.currentTarget as HTMLElement).style.background = 'rgba(14, 165, 233, 0.1)';
      (e.currentTarget as HTMLElement).style.color = '#cbd5e1';
    }}
  >
    <Icon size={20} />
    <span>{label}</span>
  </Link>
);
