import { useState } from "react";
import { CreateRoomDto } from "../../types/room.types";
import toast from "react-hot-toast";

/* ── Fonts & minimal global overrides ── */
const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Work+Sans:wght@400;500;600&family=Barlow+Condensed:wght@700;900&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    vertical-align: middle;
    line-height: 1;
    display: inline-block;
  }
  .icon-filled { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  .gold-glow { text-shadow: 0 0 8px rgba(246,190,57,0.45); }
  .card-shadow { box-shadow: 0 10px 30px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(212,160,23,0.18); }
  .create-glow { box-shadow: 0 0 15px rgba(246,190,57,0.3); }
  .create-glow:hover { box-shadow: 0 0 26px rgba(246,190,57,0.5); }
`;

interface RoomCreateProps {
  onClose: () => void;
  onCreateRoom: (roomData: CreateRoomDto) => Promise<void>;
}

export default function RoomCreate({ onClose, onCreateRoom }: RoomCreateProps) {
  const [formData, setFormData] = useState<CreateRoomDto>({
    name: "",
    isPrivate: false,
    password: "",
    maxPlayers: 4,
    turnTimeLimit: 30,
    autoRoll: false,
    startingMoney: 1500,
  });
  
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error("Room name is required");
      return;
    }

    if (formData.isPrivate && !formData.password?.trim()) {
      toast.error("Password is required for private rooms");
      return;
    }

    setLoading(true);
    try {
      await onCreateRoom(formData);
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field: keyof CreateRoomDto, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      <style>{GLOBAL_STYLE}</style>
      
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
        <div className="bg-[#1a1a1a] card-shadow rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="border-b border-[#333] p-6 flex items-center justify-between">
            <h2 className="font-['Noto_Serif'] text-2xl font-bold text-[#f6be39] gold-glow">
              Create New Room
            </h2>
            <button
              onClick={onClose}
              className="text-[#d3c5ae] hover:text-[#f6be39] transition-colors"
            >
              <span className="material-symbols-outlined text-2xl">close</span>
            </button>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Room Name */}
            <div>
              <label className="block font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-[0.2em] text-[#d3c5ae] mb-2">
                Room Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#444] rounded-lg text-[#e5e2e1] focus:border-[#d4a017] focus:outline-none transition-colors"
                placeholder="Enter room name..."
                maxLength={50}
                required
              />
            </div>

            {/* Room Type */}
            <div>
              <label className="block font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-[0.2em] text-[#d3c5ae] mb-2">
                Room Type
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="roomType"
                    checked={!formData.isPrivate}
                    onChange={() => handleInputChange('isPrivate', false)}
                    className="mr-2"
                  />
                  <span className="text-[#e5e2e1]">Public</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="roomType"
                    checked={formData.isPrivate}
                    onChange={() => handleInputChange('isPrivate', true)}
                    className="mr-2"
                  />
                  <span className="text-[#e5e2e1]">Private</span>
                </label>
              </div>
            </div>

            {/* Password (for private rooms) */}
            {formData.isPrivate && (
              <div>
                <label className="block font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-[0.2em] text-[#d3c5ae] mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#444] rounded-lg text-[#e5e2e1] focus:border-[#d4a017] focus:outline-none transition-colors"
                  placeholder="Enter password..."
                  required
                />
              </div>
            )}

            {/* Game Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Max Players */}
              <div>
                <label className="block font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-[0.2em] text-[#d3c5ae] mb-2">
                  Max Players
                </label>
                <select
                  value={formData.maxPlayers}
                  onChange={(e) => handleInputChange('maxPlayers', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#444] rounded-lg text-[#e5e2e1] focus:border-[#d4a017] focus:outline-none transition-colors"
                >
                  {[2, 3, 4, 5, 6, 7, 8].map(num => (
                    <option key={num} value={num}>{num} Players</option>
                  ))}
                </select>
              </div>

              {/* Turn Time Limit */}
              <div>
                <label className="block font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-[0.2em] text-[#d3c5ae] mb-2">
                  Turn Time Limit
                </label>
                <select
                  value={formData.turnTimeLimit}
                  onChange={(e) => handleInputChange('turnTimeLimit', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#444] rounded-lg text-[#e5e2e1] focus:border-[#d4a017] focus:outline-none transition-colors"
                >
                  <option value={10}>10 seconds</option>
                  <option value={20}>20 seconds</option>
                  <option value={30}>30 seconds</option>
                  <option value={45}>45 seconds</option>
                  <option value={60}>60 seconds</option>
                  <option value={90}>90 seconds</option>
                  <option value={120}>120 seconds</option>
                </select>
              </div>

              {/* Starting Money */}
              <div>
                <label className="block font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-[0.2em] text-[#d3c5ae] mb-2">
                  Starting Money
                </label>
                <select
                  value={formData.startingMoney}
                  onChange={(e) => handleInputChange('startingMoney', parseInt(e.target.value))}
                  className="w-full px-4 py-3 bg-[#2a2a2a] border border-[#444] rounded-lg text-[#e5e2e1] focus:border-[#d4a017] focus:outline-none transition-colors"
                >
                  <option value={500}>$500</option>
                  <option value={1000}>$1,000</option>
                  <option value={1500}>$1,500</option>
                  <option value={2000}>$2,000</option>
                  <option value={3000}>$3,000</option>
                  <option value={5000}>$5,000</option>
                </select>
              </div>

              {/* Auto Roll */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="autoRoll"
                  checked={formData.autoRoll}
                  onChange={(e) => handleInputChange('autoRoll', e.target.checked)}
                  className="mr-3 w-4 h-4"
                />
                <label htmlFor="autoRoll" className="text-[#e5e2e1] cursor-pointer">
                  Auto Roll Dice
                </label>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3 bg-transparent border-2 border-[#666] text-[#d3c5ae]
                  font-['Barlow_Condensed'] font-black uppercase text-base tracking-wide cursor-pointer
                  hover:border-[#d3c5ae] transition-colors duration-300"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#d4a017] text-[#261a00] border-0
                  font-['Barlow_Condensed'] font-black uppercase text-base tracking-wide cursor-pointer
                  create-glow hover:scale-105 active:scale-95 transition-all duration-300
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Creating...' : 'Create Room'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
