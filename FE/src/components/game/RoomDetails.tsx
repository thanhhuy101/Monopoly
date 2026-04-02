import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roomApi } from "../../services/roomApi";
import { GameRoom, RoomDetailsResponse } from "../../types/room.types";
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
`;

export default function RoomDetails() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [room, setRoom] = useState<RoomDetailsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [isCreator, setIsCreator] = useState(false);

  useEffect(() => {
    if (roomId) {
      loadRoomDetails();
    }
  }, [roomId]);

  const loadRoomDetails = async () => {
    if (!roomId) return;
    
    try {
      setLoading(true);
      const roomData = await roomApi.getRoomDetails(roomId);
      setRoom(roomData);
      
      // Check if current user is the creator (you might want to get this from auth context)
      const currentUserId = localStorage.getItem('userId');
      setIsCreator(roomData.creatorId === currentUserId);
    } catch (error) {
      console.error('Error loading room details:', error);
      toast.error('Failed to load room details');
      navigate('/rooms');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (!roomId) return;
    
    if (window.confirm('Are you sure you want to leave this room?')) {
      try {
        await roomApi.leaveRoom(roomId);
        toast.success('Left room successfully');
        navigate('/rooms');
      } catch (error) {
        console.error('Error leaving room:', error);
        toast.error('Failed to leave room');
      }
    }
  };

  const handleDeleteRoom = async () => {
    if (!roomId) return;
    
    if (window.confirm('Are you sure you want to delete this room? This action cannot be undone.')) {
      try {
        await roomApi.deleteRoom(roomId);
        toast.success('Room deleted successfully');
        navigate('/rooms');
      } catch (error) {
        console.error('Error deleting room:', error);
        toast.error('Failed to delete room');
      }
    }
  };

  const handleStartGame = () => {
    // This would typically navigate to the game page
    toast.success('Starting game...');
    // navigate(`/game/${roomId}`);
  };

  if (loading) {
    return (
      <>
        <style>{GLOBAL_STYLE}</style>
        <div className="bg-[#131313] text-[#e5e2e1] font-['Work_Sans'] min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#d4a017] border-t-transparent mx-auto"></div>
            <p className="font-['Barlow_Condensed'] text-lg text-[#d3c5ae] opacity-60 italic tracking-wider">
              Loading room details...
            </p>
          </div>
        </div>
      </>
    );
  }

  if (!room) {
    return (
      <>
        <style>{GLOBAL_STYLE}</style>
        <div className="bg-[#131313] text-[#e5e2e1] font-['Work_Sans'] min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <h2 className="font-['Noto_Serif'] text-6xl font-bold uppercase tracking-widest text-[#d4a017] opacity-30 gold-glow">
              ROOM NOT FOUND
            </h2>
            <button
              onClick={() => navigate('/rooms')}
              className="px-8 py-3 bg-[#d4a017] text-[#261a00] border-0
                font-['Barlow_Condensed'] font-black uppercase text-base tracking-wide cursor-pointer
                create-glow hover:scale-105 active:scale-95 transition-all duration-300"
            >
              Back to Rooms
            </button>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{GLOBAL_STYLE}</style>
      
      <div className="bg-[#131313] text-[#e5e2e1] font-['Work_Sans'] min-h-screen">
        <div className="max-w-4xl mx-auto pt-16 px-6 pb-16">

          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <button
              onClick={() => navigate('/rooms')}
              className="flex items-center gap-2 text-[#d3c5ae] hover:text-[#f6be39] transition-colors duration-200"
            >
              <span className="material-symbols-outlined">arrow_back</span>
              <span className="font-['Barlow_Condensed'] font-bold uppercase tracking-[0.2em]">Back</span>
            </button>

            <div className="flex items-center gap-4">
              {room.status === 'waiting' && (
                <button
                  onClick={handleStartGame}
                  className="px-6 py-3 bg-[#d4a017] text-[#261a00] border-0
                    font-['Barlow_Condensed'] font-black uppercase text-base tracking-wide cursor-pointer
                    create-glow hover:scale-105 active:scale-95 transition-all duration-300"
                >
                  Start Game
                </button>
              )}
              
              {isCreator && (
                <button
                  onClick={() => setShowEditModal(true)}
                  className="px-6 py-3 bg-transparent border-2 border-[#d4a017] text-[#f6be39]
                    font-['Barlow_Condensed'] font-black uppercase text-base tracking-wide cursor-pointer
                    hover:bg-[#d4a017] hover:text-[#261a00] transition-all duration-300"
                >
                  Edit Room
                </button>
              )}
              
              <button
                onClick={handleLeaveRoom}
                className="px-6 py-3 bg-transparent border-2 border-[#dc2626] text-[#dc2626]
                  font-['Barlow_Condensed'] font-black uppercase text-base tracking-wide cursor-pointer
                  hover:bg-[#dc2626] hover:text-[#ffffff] transition-all duration-300"
              >
                Leave Room
              </button>
              
              {isCreator && (
                <button
                  onClick={handleDeleteRoom}
                  className="px-6 py-3 bg-[#dc2626] text-[#ffffff] border-0
                    font-['Barlow_Condensed'] font-black uppercase text-base tracking-wide cursor-pointer
                    hover:bg-[#b91c1c] transition-all duration-300"
                >
                  Delete Room
                </button>
              )}
            </div>
          </div>

          {/* Room Info Card */}
          <div className="bg-[#1a1a1a] card-shadow rounded-lg p-8 mb-8">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="font-['Noto_Serif'] text-4xl font-bold text-[#f6be39] gold-glow mb-2">
                  {room.name}
                </h1>
                <div className="flex items-center gap-4 text-[#d3c5ae]">
                  <span className="flex items-center gap-2">
                    {room.isPrivate ? (
                      <>
                        <span className="material-symbols-outlined icon-filled">lock</span>
                        Private
                      </>
                    ) : (
                      <>
                        <span className="material-symbols-outlined">public</span>
                        Public
                      </>
                    )}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    room.status === 'waiting' ? 'bg-[#166534] text-[#22c55e]' :
                    room.status === 'playing' ? 'bg-[#166534] text-[#22c55e]' :
                    'bg-[#7f1d1d] text-[#dc2626]'
                  }`}>
                    {room.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Room Settings */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <h3 className="font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-[0.2em] text-[#d3c5ae] mb-2">
                  Players
                </h3>
                <p className="font-['Noto_Serif'] text-2xl font-bold text-[#f6be39]">
                  {room.currentPlayers} / {room.maxPlayers}
                </p>
              </div>
              
              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <h3 className="font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-[0.2em] text-[#d3c5ae] mb-2">
                  Turn Time
                </h3>
                <p className="font-['Noto_Serif'] text-2xl font-bold text-[#f6be39]">
                  {room.settings.turnTimeLimit}s
                </p>
              </div>
              
              <div className="bg-[#2a2a2a] rounded-lg p-4">
                <h3 className="font-['Barlow_Condensed'] text-sm font-bold uppercase tracking-[0.2em] text-[#d3c5ae] mb-2">
                  Starting Money
                </h3>
                <p className="font-['Noto_Serif'] text-2xl font-bold text-[#f6be39]">
                  ${room.settings.startingMoney}
                </p>
              </div>
            </div>

            {/* Additional Settings */}
            <div className="flex items-center gap-6 text-[#d3c5ae]">
              <span className="flex items-center gap-2">
                <span className="material-symbols-outlined">
                  {room.settings.autoRoll ? 'auto_fix_high' : 'casino'}
                </span>
                {room.settings.autoRoll ? 'Auto Roll' : 'Manual Roll'}
              </span>
            </div>
          </div>

          {/* Players List */}
          <div className="bg-[#1a1a1a] card-shadow rounded-lg p-8">
            <h2 className="font-['Noto_Serif'] text-2xl font-bold text-[#f6be39] mb-6">
              Players in Room
            </h2>
            
            {room.playerInfo && room.playerInfo.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {room.playerInfo.map((player, index) => (
                  <div key={player._id} className="bg-[#2a2a2a] rounded-lg p-4 flex items-center gap-4">
                    <div className="text-3xl">{player.emoji}</div>
                    <div>
                      <p className="font-['Barlow_Condensed'] font-bold text-[#e5e2e1]">
                        {player.displayName}
                      </p>
                      <p className="text-sm text-[#d3c5ae]">@{player.username}</p>
                    </div>
                    {index === 0 && (
                      <span className="ml-auto px-2 py-1 bg-[#d4a017] text-[#261a00] text-xs font-bold uppercase rounded">
                        Creator
                      </span>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-[#d3c5ae] text-center py-8">
                No players in room yet
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
