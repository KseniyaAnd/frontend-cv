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
import IconButton from './IconButton';
import { getMe, CurrentUserProfile } from '@/app/api/graphql/profile';

function Logo() {
  return (
    <div className="flex items-center gap-3 px-2">
      <div className="relative flex h-7.5 w-7.5 items-center justify-center rounded-[4px] bg-text">
        <span className="absolute left-1.75 top-1.5 h-4.25 w-1.25 rounded-xs bg-background" />
        <span className="absolute right-1.5 top-1.5 h-1.25 w-1.25 rounded-[1px] bg-primary" />
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
          px-4.5
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
        flex w-66 flex-col
        justify-between
        border-r border-border
        bg-background
        px-3 py-7
      "
    >
      <div>
        <div className="relative mb-8.5 h-7.5">
          <Logo />

          <IconButton
            size="md"
            ariaLabel="Collapse sidebar"
            className="absolute -right-px top-10.5"
          >
            <ChevronLeft size={20} />
          </IconButton>
        </div>

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
