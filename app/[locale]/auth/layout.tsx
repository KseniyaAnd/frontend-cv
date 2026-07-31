'use client';

import React from 'react';
import { Box, Container } from '@mui/material';
import AuthHeader from './AuthHeader';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
        color: 'text.primary',
      }}
    >
      <AuthHeader />

      <Container
        component="main"
        maxWidth={false}
        disableGutters
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          py: 4,
        }}
      >
        {children}
      </Container>
    </Box>
  );
}
