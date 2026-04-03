import { Link, useNavigate } from 'react-router-dom';
import { Users, FileText, Clock, Menu, X, BarChart3, Dumbbell } from 'lucide-react';
import { useState } from 'react';

export const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

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
          padding: '1rem 1.5rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            display: 'flex',
            alignItems: 'center',
            gap: '1rem',
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
              padding: '0.6rem',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Dumbbell size={28} style={{color: 'white'}} />
            </div>
            <div style={{display: 'flex', flexDirection: 'column', gap: '0.125rem'}}>
              <p style={{fontSize: '1.4rem', fontWeight: '800', margin: 0, letterSpacing: '-0.5px'}}>Shri Ram Fitness</p>
            </div>
          </Link>
          
          <nav style={{display: 'flex', gap: '0.25rem', alignItems: 'center'}}>
            <NavLink to="/dashboard" icon={BarChart3} label="Dashboard" />
            <NavLink to="/members" icon={Users} label="Members" />
            <NavLink to="/billing" icon={FileText} label="Billing" />
            <NavLink to="/reminders" icon={Clock} label="Reminders" />
          </nav>

          <button
            style={{display: 'none', background: 'rgba(14, 165, 233, 0.2)', border: 'none', color: 'white', padding: '0.5rem', borderRadius: '8px', cursor: 'pointer', transition: 'background 200ms'}}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(14, 165, 233, 0.3)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'rgba(14, 165, 233, 0.2)')}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <nav style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            padding: '1rem 1.5rem',
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
