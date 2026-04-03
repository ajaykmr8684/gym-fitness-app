import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Member, Bill, Reminder } from '../types';
import { getMembers, getBills, getReminders } from '../utils/db';

interface AppContextType {
  members: Member[];
  bills: Bill[];
  reminders: Reminder[];
  loading: boolean;
  error: string | null;
  refreshData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [members, setMembers] = useState<Member[]>([]);
  const [bills, setBills] = useState<Bill[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [membersData, billsData, remindersData] = await Promise.all([
        getMembers(),
        getBills(),
        getReminders(),
      ]);
      setMembers(membersData);
      setBills(billsData);
      setReminders(remindersData);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Error refreshing data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  return (
    <AppContext.Provider value={{ members, bills, reminders, loading, error, refreshData }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
