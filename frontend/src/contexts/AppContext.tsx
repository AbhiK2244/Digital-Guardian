import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { User, ScanResult, Badge } from '../types';

interface AppState {
  user: User | null;
  scanHistory: ScanResult[];
  isLoading: boolean;
  error: string | null;
}

interface AppAction {
  type: string;
  payload?: any;
}

const initialState: AppState = {
  user: {
    id: '1',
    name: 'Digital Guardian',
    email: 'user@example.com',
    level: 'Bronze',
    points: 150,
    badges: [
      {
        id: '1',
        name: 'First Steps',
        description: 'Completed your first quiz',
        icon: '🏆',
        earnedAt: new Date()
      }
    ],
    digitalHealthScore: 75
  },
  scanHistory: [],
  isLoading: false,
  error: null
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    case 'ADD_POINTS':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          points: state.user.points + action.payload
        } : null
      };
    case 'ADD_SCAN_RESULT':
      return {
        ...state,
        scanHistory: [action.payload, ...state.scanHistory]
      };
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_ERROR':
      return { ...state, error: action.payload };
    default:
      return state;
  }
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};