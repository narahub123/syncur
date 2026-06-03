type SettingsPageHeaderProps = {
  title: string;
  description?: string;
};

const SettingsPageHeader = ({
  title,
  description,
}: SettingsPageHeaderProps) => {
  return (
    <section className="border-b border-gray-200 px-3 py-4">
      <h1 className="text-2xl font-bold">{title}</h1>

      {description && (
        <p className="mt-2 text-sm text-gray-500">{description}</p>
      )}
    </section>
  );
};

export default SettingsPageHeader;
