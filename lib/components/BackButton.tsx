'use client';

import { useRouter } from 'next/navigation';

import { Button } from '@/lib/components/Button';

type BackButtonProps = {
  children: React.ReactNode;
};

export function BackButton({ children }: BackButtonProps) {
  const router = useRouter();

  return (
    <Button variant="primary" onClick={() => router.back()}>
      {children}
    </Button>
  );
}
