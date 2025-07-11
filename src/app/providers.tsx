import React from 'react';

const Providers: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // TODO: Wrap QueryClientProvider and other providers here later
  return <>{children}</>;
};

export { Providers };
export default Providers;
