'use client';

import React from 'react';
import { Tabs, Tab, Box } from '@mui/material';
import { useTranslations } from 'next-intl';
import { usePathname, useRouter } from '../../../i18n/routing';

export default function AuthHeader() {
  const t = useTranslations('auth');
  const pathname = usePathname();
  const router = useRouter();

  const currentTab = pathname.includes('/signup') ? '/auth/signup' : '/auth/login';

  const handleChange = (_: React.SyntheticEvent, newValue: string) => {
    router.push(newValue);
  };

  return (
    <Box sx={{ width: '100%', display: 'flex', justifyContent: 'center', pt: 2 }}>
      <Tabs
        value={currentTab}
        onChange={handleChange}
        textColor="primary"
        indicatorColor="primary"
        sx={{
          '& .MuiTabs-indicator': {
            height: 3,
          },
          '& .MuiTab-root': {
            fontWeight: 600,
            fontSize: '0.875rem',
            px: 4,
          },
        }}
      >
        <Tab label={t('login')} value="/auth/login" />
        <Tab label={t('signup')} value="/auth/signup" />
      </Tabs>
    </Box>
  );
}
