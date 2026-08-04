import React from 'react';
import AuthHeader from './AuthHeader';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-text transition-colors">
      <AuthHeader />

      <main className="flex flex-1 flex-col items-center justify-center px-4 py-4">
        <div className="w-full max-w-7xl">{children}</div>
      </main>
    </div>
  );
}
