
import React, { createContext, useContext, ReactNode } from 'react';

// Simplified context to satisfy any remaining imports without functionality
const AuthContext = createContext<any>(undefined);

export const useAuth = () => {
  return {
    user: null,
    isAuthenticated: false,
    calculationsCount: 0,
    isLimitReached: false,
    login: () => {},
    logout: () => {},
    upgradeToPremium: () => {},
    incrementCalculationCount: () => {},
    showAuthModal: false,
    setShowAuthModal: () => {},
    showPaymentModal: false,
    setShowPaymentModal: () => {},
  };
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return <>{children}</>;
};
