interface Props { image: string; title: string; revenueLabel: string; revenue: string; accentColor?: string }

export default function AssetCard({ image, title, revenueLabel, revenue, accentColor = '#f6be39' }: Props) {
  return (
    <div className="group relative overflow-hidden h-48 bg-[#1c1b1b] p-6 flex flex-col justify-end border-l-4" style={{ borderColor: accentColor }}>
      <img src={image} alt={title} className="absolute inset-0 w-full h-full object-cover opacity-20 group-hover:scale-110 transition-transform duration-1000" />
      <div className="relative z-10">
        <div className="w-12 h-1 mb-3" style={{ background: accentColor }} />
        <h4 className="font-['Noto_Serif'] text-xl uppercase" style={{ color: accentColor }}>{title}</h4>
        <div className="flex justify-between items-center mt-2">
          <span className="font-['Barlow_Condensed'] text-xs font-bold text-[#cac6be] uppercase tracking-widest">{revenueLabel}</span>
          <span className="font-['Barlow_Condensed'] text-sm font-bold" style={{ color: accentColor }}>{revenue}</span>
        </div>
      </div>
    </div>
  );
}
