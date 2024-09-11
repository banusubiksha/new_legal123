// ProfileContext.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ProfileContextType {
  photoUri: string | null;
  setPhotoUri: (uri: string | null) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [photoUri, setPhotoUri] = useState<string | null>(null);

  return (
    <ProfileContext.Provider value={{ photoUri, setPhotoUri }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
