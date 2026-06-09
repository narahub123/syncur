interface ResponsiveActionButtonProps {
  icon: React.ReactNode;
  label: string;
}

const ResponsiveActionButton = ({
  icon,
  label,
}: ResponsiveActionButtonProps) => {
  return (
    <div className="flex size-12 items-center justify-center rounded-full border border-gray-200 xl:w-full xl:gap-2 xl:rounded-none xl:border-0">
      <span className="shrink-0">{icon}</span>

      <span className="hidden xl:inline">{label}</span>
    </div>
  );
};

export default ResponsiveActionButton;
