type ColorVariant = 'primary' | 'secondary' | 'tertiary' | 'locked';

interface Props { icon: string; label: string; color?: ColorVariant; locked?: boolean }

const COLOR_MAP: Record<ColorVariant, { ring: string; iconColor: string }> = {
  primary:   { ring: '#d4a017',                    iconColor: '#d4a017' },
  secondary: { ring: 'rgba(202,198,190,0.2)',       iconColor: '#cac6be' },
  tertiary:  { ring: 'rgba(189,202,190,0.2)',       iconColor: '#bdcabe' },
  locked:    { ring: 'rgba(155,143,122,0.3)',       iconColor: '#9b8f7a' },
};

export default function MedalCard({ icon, label, color = 'primary', locked = false }: Props) {
  const c = COLOR_MAP[locked ? 'locked' : color];
  return (
    <div className={`bg-[#201f1f] p-6 flex flex-col items-center gap-3 border transition-all duration-300 hover:border-[#f6be39] ${locked ? 'border-dashed border-[#4f4634]/20 opacity-50' : 'border-[#4f4634]/10'}`}>
      <div className="w-16 h-16 bg-[#353534] rounded-full flex items-center justify-center"
        style={{ boxShadow: `0 0 0 2px ${c.ring}, 0 0 0 6px #201f1f` }}>
        <span className="material-symbols-outlined text-4xl"
          style={{ color: c.iconColor, fontVariationSettings: locked ? "'FILL' 0" : "'FILL' 1" }}>
          {icon}
        </span>
      </div>
      <p className="font-['Barlow_Condensed'] text-[10px] font-black uppercase text-center text-[#e5e2e1] leading-tight">{label}</p>
    </div>
  );
}
