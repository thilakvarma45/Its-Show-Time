const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-4">
      {icon && <div className="text-6xl mb-4">{icon}</div>}
      <h3 className="text-xl font-semibold text-slate-900 mb-2">{title}</h3>
      {description && <p className="text-slate-600 text-center mb-6 max-w-md">{description}</p>}
      {action}
    </div>
  );
};

export default EmptyState;
