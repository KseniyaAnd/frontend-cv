'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Users,
  TrendingUp,
  Languages,
  FileText,
  Building2,
  Briefcase,
  FolderKanban,
  ChevronLeft,
} from 'lucide-react';
import SidebarProfile from './SidebarProfile';
import { getMe, CurrentUserProfile } from '@/app/api/graphql/profile';

function Logo() {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="relative flex h-[30px] w-[30px] items-center justify-center rounded-[4px] bg-text">
        <span className="absolute left-[7px] top-[6px] h-[17px] w-[5px] rounded-[2px] bg-background" />
        <span className="absolute right-[6px] top-[6px] h-[5px] w-[5px] rounded-[1px] bg-primary" />
      </div>

      <span className="text-[18px] font-semibold tracking-[-0.3px] text-text">CV Builder</span>
    </div>
  );
}

const menuItems = [
  {
    label: 'Employees',
    href: '/employees',
    icon: Users,
  },
  {
    label: 'Skills',
    href: '/skills',
    icon: TrendingUp,
  },
  {
    label: 'Languages',
    href: '/languages',
    icon: Languages,
  },
  {
    label: 'CVs',
    href: '/cvs',
    icon: FileText,
  },
];

const adminMenuItems = [
  {
    label: 'Departments',
    href: '/departments',
    icon: Building2,
  },
  {
    label: 'Positions',
    href: '/positions',
    icon: Briefcase,
  },
  {
    label: 'Projects',
    href: '/projects',
    icon: FolderKanban,
  },
];

export default function Sidebar() {
  const pathname = usePathname();
  const [user, setUser] = useState<CurrentUserProfile | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const data = await getMe();
        if (!cancelled) {
          setUser(data.me);
        }
      } catch (error) {
        console.error('Failed to load current user:', error);
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const isAdmin = user?.role === 'Admin';

  function renderMenuItem(item: (typeof menuItems)[number]) {
    const Icon = item.icon;
    const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);

    return (
      <Link
        key={item.href}
        href={item.href}
        className={`
          flex h-14 items-center gap-5
          rounded-r-[28px]
          px-[18px]
          text-[18px]
          transition-colors

          ${
            isActive
              ? 'bg-border font-medium text-text'
              : 'text-text-secondary hover:bg-border/50 hover:text-text'
          }
        `}
      >
        <Icon size={24} />

        <span>{item.label}</span>
      </Link>
    );
  }

  return (
    <aside
      className="
        fixed inset-y-0 left-0 z-40
        flex w-[264px] flex-col
        justify-between
        border-r border-border
        bg-background
        px-3 py-7
      "
    >
      <div>
        {/* Logo */}
        <div className="relative mb-[34px] h-[30px]">
          <Logo />

          {/* Collapse button */}
          <button
            type="button"
            aria-label="Collapse sidebar"
            className="
              absolute right-[-1px] top-[42px]
              flex h-8 w-8 items-center justify-center
              rounded-full
              bg-background
              text-text-secondary
              transition-colors
              hover:bg-border
              hover:text-text
            "
          >
            <ChevronLeft size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-2">
          {menuItems.map(renderMenuItem)}

          {isAdmin && (
            <>
              <div className="my-2 border-t border-border" />
              {adminMenuItems.map(renderMenuItem)}
            </>
          )}
        </nav>
      </div>

      <SidebarProfile user={user} />
    </aside>
  );
}
