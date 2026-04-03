import { useState, useMemo } from 'react';
import { Member } from '../types';
import { membershipPlans, calculateExpiryDate, calculateMembershipPrice, basePricing } from '../utils/db';
import { CheckCircle } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';

interface MemberFormProps {
  member?: Member;
  onSubmit: (data: Omit<Member, 'id'>) => void | Promise<void>;
  onCancel: () => void;
}

export const MemberForm = ({ member, onSubmit, onCancel }: MemberFormProps) => {
  const isMobile = useIsMobile();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: member?.name || '',
    email: member?.email || '',
    phone: member?.phone || '',
    planType: (member?.planType || 'monthly') as 'monthly' | 'quarterly' | 'halfyear' | 'annual',
    strength: member?.strength !== undefined ? member.strength : true,
    cardio: member?.cardio !== undefined ? member.cardio : false,
    training: member?.training !== undefined ? member.training : false,
    joinDate: member?.joinDate || new Date().toISOString().split('T')[0],
    notes: member?.notes || '',
    whatsappOptIn: member?.whatsappOptIn || false,
  });

  // Calculate pricing based on current selections
  const pricing = useMemo(() => {
    return calculateMembershipPrice(formData.planType, formData.strength, formData.cardio, formData.training);
  }, [formData.planType, formData.strength, formData.cardio, formData.training]);

  const plan = membershipPlans.find(p => p.type === formData.planType);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      const expiryDate = calculateExpiryDate(plan?.duration || 30);

      await onSubmit({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        planType: formData.planType,
        planDuration: plan?.duration || 30,
        strength: formData.strength,
        cardio: formData.cardio,
        training: formData.training,
        baseAmount: pricing.baseAmount,
        discountPercentage: pricing.discountPercentage,
        amount: pricing.finalAmount,
        amountPaid: member?.amountPaid || 0,
        joinDate: formData.joinDate,
        expiryDate: expiryDate,
        status: 'active',
        notes: formData.notes,
        whatsappOptIn: formData.whatsappOptIn,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{display: 'flex', flexDirection: 'column', gap: '1.5rem'}}>
      {/* Name Field */}
      <div>
        <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem'}}>
          Full Name <span style={{color: '#0ea5e9'}}>*</span>
        </label>
        <input
          type="text"
          required
          value={formData.name}
          onChange={e => setFormData({ ...formData, name: e.target.value })}
          placeholder=""
          style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem'}}
        />
      </div>

      {/* Email and Phone */}
      <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '1rem'}}>
        <div>
          <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem'}}>
            Email <span style={{color: '#0ea5e9'}}>*</span>
          </label>
          <input
            type="email"
            required
            value={formData.email}
            onChange={e => setFormData({ ...formData, email: e.target.value })}
            placeholder=""
            style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem'}}
          />
        </div>
        <div>
          <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem'}}>
            Phone <span style={{color: '#0ea5e9'}}>*</span>
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={e => setFormData({ ...formData, phone: e.target.value })}
            placeholder=""
            style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem'}}
          />
        </div>
      </div>

      {/* Plan Duration Selection */}
      <div>
        <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.75rem'}}>
          Plan Duration <span style={{color: '#0ea5e9'}}>*</span>
        </label>
        <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '0.75rem'}}>
          {membershipPlans.map(plan => (
            <button
              key={plan.type}
              type="button"
              onClick={() => setFormData({ ...formData, planType: plan.type })}
              style={{
                position: 'relative',
                padding: '1rem',
                borderRadius: '6px',
                border: `2px solid ${formData.planType === plan.type ? '#0ea5e9' : '#cbd5e1'}`,
                backgroundColor: formData.planType === plan.type ? '#f0f9ff' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 200ms',
                transform: formData.planType === plan.type ? 'scale(1.02)' : 'scale(1)',
                boxShadow: formData.planType === plan.type ? '0 2px 8px rgba(14, 165, 233, 0.2)' : 'none'
              }}
            >
              {formData.planType === plan.type && (
                <CheckCircle size={14} style={{position: 'absolute', top: '-7px', right: '-7px', color: '#0ea5e9', backgroundColor: 'white', borderRadius: '50%'}} />
              )}
              <div style={{fontWeight: '600', color: '#1e293b', fontSize: '0.95rem'}}>{plan.durationLabel}</div>
              {plan.discount > 0 && (
                <div style={{fontSize: '0.75rem', color: '#10b981', fontWeight: '600', marginTop: '0.25rem'}}>
                  {plan.discount}% OFF
                </div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Features Selection */}
      <div>
        <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.75rem'}}>
          Features <span style={{color: '#0ea5e9'}}>*</span>
        </label>
        <div style={{display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr 1fr', gap: '0.75rem'}}>
          {/* Strength */}
          <div
            onClick={() => setFormData({ ...formData, strength: !formData.strength })}
            style={{
              padding: '1rem',
              borderRadius: '6px',
              border: `2px solid ${formData.strength ? '#0ea5e9' : '#cbd5e1'}`,
              backgroundColor: formData.strength ? '#f0f9ff' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 200ms'
            }}
          >
            <input
              type="checkbox"
              checked={formData.strength}
              onChange={() => {}}
              style={{accentColor: '#0ea5e9', marginRight: '0.5rem', cursor: 'pointer'}}
            />
            <label style={{fontWeight: '600', color: '#1e293b', fontSize: '0.9rem', cursor: 'pointer'}}>
              Strength
            </label>
            <div style={{fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem'}}>
              ₹{basePricing.strength}/mo
            </div>
          </div>

          {/* Cardio */}
          <div
            onClick={() => setFormData({ ...formData, cardio: !formData.cardio })}
            style={{
              padding: '1rem',
              borderRadius: '6px',
              border: `2px solid ${formData.cardio ? '#0ea5e9' : '#cbd5e1'}`,
              backgroundColor: formData.cardio ? '#f0f9ff' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 200ms'
            }}
          >
            <input
              type="checkbox"
              checked={formData.cardio}
              onChange={() => {}}
              style={{accentColor: '#0ea5e9', marginRight: '0.5rem', cursor: 'pointer'}}
            />
            <label style={{fontWeight: '600', color: '#1e293b', fontSize: '0.9rem', cursor: 'pointer'}}>
              Cardio
            </label>
            <div style={{fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem'}}>
              +₹{basePricing.cardio}/mo
            </div>
          </div>

          {/* Training */}
          <div
            onClick={() => setFormData({ ...formData, training: !formData.training })}
            style={{
              padding: '1rem',
              borderRadius: '6px',
              border: `2px solid ${formData.training ? '#0ea5e9' : '#cbd5e1'}`,
              backgroundColor: formData.training ? '#f0f9ff' : '#ffffff',
              cursor: 'pointer',
              transition: 'all 200ms'
            }}
          >
            <input
              type="checkbox"
              checked={formData.training}
              onChange={() => {}}
              style={{accentColor: '#0ea5e9', marginRight: '0.5rem', cursor: 'pointer'}}
            />
            <label style={{fontWeight: '600', color: '#1e293b', fontSize: '0.9rem', cursor: 'pointer'}}>
              Personal Training
            </label>
            <div style={{fontSize: '0.8rem', color: '#64748b', marginTop: '0.5rem'}}>
              +₹{basePricing.training}/mo
            </div>
          </div>
        </div>
      </div>

      {/* Price Breakdown */}
      <div style={{
        padding: '1rem',
        backgroundColor: '#f8fafc',
        border: '1px solid #e2e8f0',
        borderRadius: '6px'
      }}>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #cbd5e1'}}>
          <span style={{fontSize: '0.9rem', fontWeight: '500', color: '#64748b'}}>Monthly Base:</span>
          <span style={{fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>₹{basePricing.strength + (formData.cardio ? basePricing.cardio : 0) + (formData.training ? basePricing.training : 0)}</span>
        </div>
        <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #cbd5e1'}}>
          <span style={{fontSize: '0.9rem', fontWeight: '500', color: '#64748b'}}>{plan?.durationLabel}:</span>
          <span style={{fontSize: '0.9rem', fontWeight: '600', color: '#1e293b'}}>₹{pricing.baseAmount}</span>
        </div>
        {pricing.discountPercentage > 0 && (
          <div style={{display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid #cbd5e1'}}>
            <span style={{fontSize: '0.9rem', fontWeight: '500', color: '#10b981'}}>Discount ({pricing.discountPercentage}%):</span>
            <span style={{fontSize: '0.9rem', fontWeight: '600', color: '#10b981'}}>-₹{pricing.baseAmount - pricing.finalAmount}</span>
          </div>
        )}
        <div style={{display: 'flex', justifyContent: 'space-between'}}>
          <span style={{fontSize: '1rem', fontWeight: '700', color: '#1e293b'}}>Total Price:</span>
          <span style={{fontSize: '1.25rem', fontWeight: '800', color: '#0ea5e9'}}>₹{pricing.finalAmount}</span>
        </div>
      </div>

      {/* Join Date */}
      <div>
        <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem'}}>Join Date</label>
        <input
          type="date"
          value={formData.joinDate}
          onChange={e => setFormData({ ...formData, joinDate: e.target.value })}
          style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem'}}
        />
      </div>

      {/* WhatsApp Opt-in */}
      <div style={{display: 'flex', gap: '1rem', padding: '1rem', backgroundColor: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0'}}>
        <input
          type="checkbox"
          id="whatsapp"
          checked={formData.whatsappOptIn}
          onChange={e => setFormData({ ...formData, whatsappOptIn: e.target.checked })}
          style={{width: '20px', height: '20px', cursor: 'pointer', accentColor: '#0ea5e9', flexShrink: 0, marginTop: '0.25rem'}}
        />
        <label htmlFor="whatsapp" style={{cursor: 'pointer', flex: 1}}>
          <p style={{fontWeight: '600', color: '#1e293b', fontSize: '0.9rem', marginBottom: '0.25rem'}}>WhatsApp Notifications</p>
          <p style={{fontSize: '0.8rem', color: '#64748b'}}>Receive reminders and updates via WhatsApp</p>
        </label>
      </div>

      {/* Notes */}
      <div>
        <label style={{display: 'block', fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', marginBottom: '0.5rem'}}>Additional Notes</label>
        <textarea
          value={formData.notes}
          onChange={e => setFormData({ ...formData, notes: e.target.value })}
          placeholder=""
          rows={3}
          style={{width: '100%', padding: '0.75rem 1rem', border: '1px solid #cbd5e1', borderRadius: '6px', fontSize: '0.95rem', resize: 'vertical', fontFamily: 'inherit'}}
        />
      </div>

      {/* Action Buttons */}
      <div style={{display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', marginTop: 'auto'}}>
        <button
          type="submit"
          disabled={isSubmitting}
          style={{
            flex: 1,
            padding: '0.85rem 1.5rem',
            background: isSubmitting
              ? 'linear-gradient(135deg, #7dd3fc 0%, #38bdf8 100%)'
              : 'linear-gradient(135deg, #0ea5e9 0%, #0369a1 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            transition: 'all 200ms',
            boxShadow: '0 2px 4px rgba(14, 165, 233, 0.2)',
            opacity: isSubmitting ? 0.8 : 1
          }}
          onMouseEnter={(e) => {
            if (!isSubmitting) {
              (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 8px rgba(14, 165, 233, 0.3)';
              (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.boxShadow = '0 2px 4px rgba(14, 165, 233, 0.2)';
            (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
          }}
        >
          {isSubmitting ? 'Saving...' : member ? '✓ Update Member' : '+ Add Member'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          style={{
            flex: 1,
            padding: '0.85rem 1.5rem',
            background: 'white',
            color: '#64748b',
            border: '1px solid #cbd5e1',
            borderRadius: '6px',
            fontSize: '0.95rem',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 200ms'
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = '#f8fafc';
            (e.currentTarget as HTMLElement).style.borderColor = '#94a3b8';
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.backgroundColor = 'white';
            (e.currentTarget as HTMLElement).style.borderColor = '#cbd5e1';
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};
