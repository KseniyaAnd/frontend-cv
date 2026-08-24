'use client';

import { CurrentUserProfile } from '@/app/api/graphql/profile';

type SidebarProfileProps = {
  user: CurrentUserProfile | null;
};

export default function SidebarProfile({ user }: SidebarProfileProps) {
  const firstName = user?.first_name?.trim() ?? '';
  const lastName = user?.last_name?.trim() ?? '';

  const fullName = `${firstName} ${lastName}`.trim();

  const initial = firstName.charAt(0).toUpperCase() || lastName.charAt(0).toUpperCase() || '?';

  return (
    <div className="flex min-h-[54px] items-center gap-3 px-2">
      <div
        className="
          flex h-[42px] w-[42px]
          shrink-0 items-center justify-center
          rounded-full
          bg-primary
          text-[20px] font-medium
          text-primary-contrast
        "
      >
        {initial}
      </div>

      <span className="truncate text-[16px] text-text">{fullName || 'User'}</span>
    </div>
  );
}
