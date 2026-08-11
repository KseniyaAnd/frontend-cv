type NavigationItem = {
  label: string;
  onAction: () => void;
  isActive: boolean;
};

type NavigationTabsProps = {
  items: NavigationItem[];
};

export function NavigationTabs({ items }: NavigationTabsProps) {
  const baseButtonStyles =
    'relative px-6 py-3 text-sm font-bold uppercase tracking-wider transition-colors';
  const activeTabStyles = 'text-primary';
  const inactiveTabStyles = 'text-text-secondary hover:text-text';

  return (
    <header className="flex w-full justify-center pt-4">
      <nav className="flex">
        {items.map((item) => (
          <button
            key={item.label}
            type="button"
            onClick={item.onAction}
            className={`${baseButtonStyles} ${item.isActive ? activeTabStyles : inactiveTabStyles}`}
          >
            {item.label}
            {item.isActive && <span className="absolute bottom-0 left-0 h-0.5 w-full bg-primary" />}
          </button>
        ))}
      </nav>
    </header>
  );
}
