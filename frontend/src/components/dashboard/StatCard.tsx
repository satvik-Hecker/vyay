type Props = {
  title: string;
  value: string;
  subtitle: string;
  primary?: boolean;
};

export default function StatCard({
  title,
  value,
  subtitle,
  primary,
}: Props) {
  return (
    <div
      className={`rounded-2xl p-6 transition ${
        primary
          ? "bg-linear-to-br from-lime-600 to-emerald-800 text-white"
          : "bg-zinc-800 text-white"
      }`}
    >
      <div className="flex justify-between items-start mb-6">

        <p className="text-sm opacity-80">{title}</p>

        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
          ↗
        </div>

      </div>

      <h3 className="text-3xl font-semibold mb-2">
        {value}
      </h3>

      <p className="text-xs opacity-70">
        {subtitle}
      </p>
    </div>
  );
}