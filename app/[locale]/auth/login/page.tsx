'use client';

import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Box, Button, TextField, Typography, Alert } from '@mui/material';
import { PasswordInput } from '../PasswordInput';
import { useRouter } from 'next/navigation';
import { login } from '../../../../lib/graphql/auth';

type LoginForm = {
  email: string;
  password: string;
};

export default function LoginPage() {
  const t = useTranslations('auth');
  const router = useRouter();
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit } = useForm<LoginForm>({
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: LoginForm) => {
    setServerError(null);
    setLoading(true);
    try {
      const result = await login(values);

      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('refresh_token', result.refresh_token);

      router.push('/');
    } catch (err: any) {
      const message = err?.response?.errors?.[0]?.message ?? t('errors.invalidCredentials');
      setServerError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        minHeight: 'calc(100vh - 80px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmit)}
        sx={{
          width: 560,
          maxWidth: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Typography
          variant="h2"
          sx={{
            fontSize: { xs: 40, md: 56 },
            fontWeight: 500,
            lineHeight: 1.1,
            mb: 1,
            textAlign: 'center',
          }}
        >
          {t('welcomeBack')}
        </Typography>

        <Typography
          variant="body1"
          color="text.secondary"
          sx={{
            mb: 5,
            fontSize: 18,
            textAlign: 'center',
          }}
        >
          {t('loginSubtitle')}
        </Typography>

        {serverError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {serverError}
          </Alert>
        )}

        <Controller
          name="email"
          control={control}
          rules={{ required: true }}
          render={({ field }) => (
            <TextField {...field} fullWidth label={t('email')} variant="outlined" sx={{ mb: 3 }} />
          )}
        />

        <PasswordInput
          control={control}
          name="password"
          fullWidth
          label={t('password')}
          variant="outlined"
          sx={{ mb: 6 }}
        />

        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              width: 220,
              height: 48,
              borderRadius: '999px',
              textTransform: 'uppercase',
              fontWeight: 700,
            }}
          >
            {loading ? '...' : t('login')}
          </Button>

          <Button
            type="button"
            variant="text"
            color="inherit"
            onClick={() => router.push('/auth/forgot-password')}
            sx={{
              color: 'text.secondary',
              textTransform: 'uppercase',
              fontWeight: 600,
            }}
          >
            {t('forgotPassword')}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
