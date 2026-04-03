import { useGameStore } from '../../store/gameStore';

interface Props {
  onClose?: () => void;
}

const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@700;900&family=Work+Sans:wght@400;500;600;700&family=Barlow+Condensed:wght@600;700;800;900&family=Playfair+Display:wght@700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    vertical-align: middle;
    line-height: 1;
    display: inline-block;
  }
  .text-glow { text-shadow: 0 0 8px rgba(246,190,57,0.4); }
  .luxury-gradient { background: linear-gradient(135deg, #f6be39 0%, #d4a017 100%); }
  .glass-overlay {
    backdrop-filter: blur(8px);
    background-color: rgba(14,14,14,0.85);
  }
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: #1c1b1b; }
  ::-webkit-scrollbar-thumb { background: #d4a017; }
`;

// Helper function to parse transaction from log message
function parseTransaction(logMessage: string, index: number) {
  const message = logMessage;
  let icon = 'info';
  let description = '';
  let highlight = '';
  let amount = '';
  let isPositive = false;
  let category = 'Hành động';
  let turn = index + 1;

  // Parse different types of transactions
  if (message.includes('mua') || message.includes('Mua')) {
    icon = 'domain';
    description = 'Bạn đã mua';
    category = 'Giao dịch bất động sản';
    const match = message.match(/→\s*(.+)/);
    if (match) highlight = match[1];
    amount = 'Giá trị đất';
  } else if (message.includes('Trả') && message.includes('→')) {
    icon = 'payments';
    description = 'Trả tiền thuê';
    category = 'Khoản thu nhập';
    isPositive = true;
    const match = message.match(/Trả\s*(\d+)₫\s*→\s*(.+)/);
    if (match) {
      amount = `+$${match[1]}`;
      highlight = match[2];
    }
  } else if (message.includes('Thuê') && message.includes('→')) {
    icon = 'account_balance';
    description = 'Thanh toán tiền thuê';
    category = 'Chi phí bất động sản';
    const match = message.match(/Thuê\s*(\d+)₫\s*→\s*(.+)/);
    if (match) {
      amount = `-$${match[1]}`;
      highlight = match[2];
    }
  } else if (message.includes('cầm cố') || message.includes('Cầm cố')) {
    icon = 'account_balance';
    description = 'Cầm cố tài sản';
    category = 'Thanh khoản khẩn cấp';
    isPositive = true;
    amount = 'Giá trị cầm cố';
  } else if (message.includes('Thuế')) {
    icon = 'receipt_long';
    description = 'Thuế';
    category = 'Thuế và lệ phí';
    const match = message.match(/-(\d+)₫/);
    if (match) amount = `-$${match[1]}`;
  } else if (message.includes('Qua Xuất Phát')) {
    icon = 'add_circle';
    description = 'Qua Xuất Phát';
    category = 'Thu nhập';
    isPositive = true;
    amount = '+$200';
  } else if (message.includes('VÀO TÙ')) {
    icon = 'gavel';
    description = 'Phạt vào tù';
    category = 'Hình phạt';
  } else if (message.includes('ra tù')) {
    icon = 'paid';
    description = 'Trả tiền ra tù';
    category = 'Chi phí pháp lý';
    const match = message.match(/-(\d+)₫/);
    if (match) amount = `-$${match[1]}`;
  } else if (message.includes('Rút thẻ')) {
    icon = 'casino';
    description = 'Rút thẻ';
    category = 'Cơ hội và Khí vận';
  } else if (message.includes('đổ đôi')) {
    icon = 'casino';
    description = 'Đổ xúc xắc đôi';
    category = 'Lucky shot';
  } else if (message.includes('tung')) {
    icon = 'casino';
    description = 'Tung xúc xắc';
    category = 'Di chuyển';
  }

  return {
    icon,
    description,
    highlight,
    amount,
    isPositive,
    turn,
    category,
    message
  };
}

export default function TransactionHistory({ onClose }: Props) {
  const log = useGameStore(s => s.log);
  
  // Parse log messages into transactions
  const transactions = log.map((message, index) => parseTransaction(message, index));
  
  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      {/* ── Backdrop ── */}
      <div className="fixed inset-0 z-40 flex items-center justify-center p-4 glass-overlay">

        {/* Background board image */}
        <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
          <img
            className="w-full h-full object-cover"
            style={{ filter: "grayscale(0.5)" }}
            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDPyMNc21bwvL3TDRllZ2TkdQzITVBYxpJeEQty8T9p4aMCNswedipDl28zpqYCDF5yIHrKgZo6NqjwAfNCM92yP50db1aHv6isMSeZGGk5hxPqYf_wsAgBrl9zSSIwdXkIHiGJXQ14vzJI4RV_J_jR_OZqeG2Eye0Y2vnVa84TfuePOq8i3eiiyNHCCp6gb1hQj3pys0cQmOX4I2E6BdfYWxsVnjY_YOPemilWsulfflir3uJi320p8lSTw5qOmfFmICSe-YNAHKo"
            alt="game board"
          />
        </div>

        {/* ── Modal ── */}
        <div className="relative z-10 w-full max-w-2xl bg-[#0e0e0e] border-2 border-[#d4a017] shadow-[0_20px_50px_rgba(0,0,0,0.9)] overflow-hidden flex flex-col max-h-[870px]">

          {/* Header */}
          <div className="p-8 border-b border-[#4f4634] bg-[#2a2a2a] flex flex-col items-center">
            <div className="flex items-center gap-3 mb-2">
              <span className="material-symbols-outlined text-[#f6be39] text-3xl">history_edu</span>
              <h1 className="text-glow font-['Playfair_Display'] text-3xl md:text-4xl text-[#f6be39] uppercase tracking-tighter">
                LỊCH SỬ GIAO DỊCH
              </h1>
            </div>
            <p className="font-['Barlow_Condensed'] text-[#bdcabe] tracking-[0.2em] text-xs uppercase">
              Bản Kê Tài Chính Đế Chế Macau
            </p>
          </div>

          {/* Scrollable list */}
          <div className="flex-1 overflow-y-auto p-6 space-y-1">
            {transactions.length === 0 ? (
              <div className="text-center py-12">
                <span className="material-symbols-outlined text-[#bdcabe] text-4xl mb-4">history</span>
                <p className="font-['Work_Sans'] text-[#bdcabe]">Chưa có giao dịch nào</p>
              </div>
            ) : (
              transactions.map((tx, i) => (
                <div
                  key={`${tx.turn}-${i}`}
                  className={`flex items-center gap-4 p-5 transition-colors group cursor-default
                    ${i % 2 === 0 ? "bg-[#201f1f]" : "bg-[#1c1b1b]"}
                    hover:bg-[#353534]`}
                >
                  {/* Icon */}
                  <div className="w-12 h-12 shrink-0 flex items-center justify-center bg-[#1c1b1b] border border-[#d4a017]/30 group-hover:border-[#d4a017] transition-all">
                    <span className="material-symbols-outlined text-[#f6be39]">{tx.icon}</span>
                  </div>

                  {/* Info */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <p className="font-['Work_Sans'] text-sm text-[#e5e2e1] leading-tight">
                        {tx.description}
                        {tx.highlight && (
                          <span className="font-bold text-[#e7e2da]"> {tx.highlight}</span>
                        )}
                      </p>
                      {tx.amount && (
                        <span
                          className={`font-['Barlow_Condensed'] text-lg font-bold ml-4 shrink-0
                            ${tx.isPositive ? "text-[#f6be39]" : "text-[#ffb4ab]"}`}
                        >
                          {tx.amount}
                        </span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="font-['Barlow_Condensed'] text-[10px] bg-[#4f4634]/30 px-2 py-0.5 text-[#bdcabe] uppercase">
                        #{tx.turn}
                      </span>
                      <span className="text-[10px] text-[#9b8f7a] uppercase tracking-widest">
                        {tx.category}
                      </span>
                    </div>
                    {/* Show original message for debugging */}
                    <div className="text-[10px] text-[#7a8fbb] opacity-60 mt-1">
                      {tx.message}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="p-8 border-t border-[#4f4634] bg-[#1c1b1b] flex justify-center">
            <button
              onClick={onClose}
              className="px-16 py-3 luxury-gradient text-[#261a00] font-['Barlow_Condensed'] font-black text-lg tracking-[0.3em] transition-transform active:scale-95 shadow-[0_4px_15px_rgba(212,160,23,0.4)] border-0 cursor-pointer"
            >
              ĐÓNG
            </button>
          </div>

        </div>
      </div>
    </>
  );
}
