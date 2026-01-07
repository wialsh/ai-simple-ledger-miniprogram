import { createContext, useContext } from 'react';
import { AppContextType } from '@/types';

// Initial dummy context for type safety
const initialContext: AppContextType = {} as any;
export const AppContext = createContext<AppContextType>(initialContext);

export const useAppContext = () => useContext(AppContext);

export type { AppContextType };
