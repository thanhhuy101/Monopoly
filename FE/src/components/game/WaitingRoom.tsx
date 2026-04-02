import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { roomApi } from "../../services/roomApi";
import { websocketService } from "../../services/websocketService";
import { useAuthStore } from "../../store/authStore";
import toast from "react-hot-toast";

interface Room {
  id: number;
  name: string;
  isPrivate: boolean;
  password?: string;
  attendance: string;
  status: string;
}

interface Player {
  id: number;
  role?: string;
  name?: string;
  badge?: string | null;
  statusIcon?: string;
  statusLabel?: string;
  statusColor?: string;
  avatar?: string;
  isHost?: boolean;
  isEmpty: boolean;
  waiting?: boolean;
  grayscale?: boolean;
}

const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Noto+Serif:wght@400;700&family=Barlow+Condensed:wght@400;600;700&family=Work+Sans:wght@300;400;500&display=swap');
  @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');

  .material-symbols-outlined {
    font-family: 'Material Symbols Outlined';
    font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
    vertical-align: middle;
    line-height: 1;
    display: inline-block;
  }
  .icon-filled { font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 24; }
  .gold-glow   { text-shadow: 0 0 8px rgba(246,190,57,0.4); }
  .art-deco-bg {
    background-color: #0e0e0e;
    background-image: radial-gradient(circle at 2px 2px, #1c1b1b 1px, transparent 0);
    background-size: 40px 40px;
  }
  @keyframes pulse-glow {
    0%, 100% { box-shadow: 0 0 12px rgba(246,190,57,0.4); }
    50%       { box-shadow: 0 0 28px rgba(246,190,57,0.8); }
  }
  .btn-start-active { animation: pulse-glow 2s ease-in-out infinite; }
`;

/* ── Player slot data ── */
// Using real API data instead of mock data

/* ── Filled slot ── */
function FilledSlot({ player }: { player: Player }) {
  return (
    <div className="relative group">
      {/* Gold border glow on hover (host only) */}
      {player.isHost && (
        <div className="absolute -inset-0.5 bg-[#d4a017] opacity-30 group-hover:opacity-100 transition duration-500" />
      )}
      <div
        className={`relative flex items-center p-6 bg-[#0e0e0e] h-full
          ${player.isHost
            ? "border-l-4 border-[#f6be39]"
            : "border-l-4 border-[#494741] bg-[#201f1f]"
          }`}
      >
        {/* Avatar */}
        <div
          className={`relative w-24 h-24 p-1 shrink-0
            ${player.isHost
              ? "border-2 border-[#f6be39] bg-[#2a2a2a]"
              : "border-2 border-[#4f4634] bg-[#2a2a2a]"
            }`}
        >
          <img
            className="w-full h-full object-cover transition duration-500"
            src={player.avatar}
            alt={player.name}
          />
          {player.badge && (
            <div className="absolute -top-3 -right-3 bg-[#f6be39] text-[#261a00] px-2 py-0.5 font-['Barlow_Condensed'] font-bold text-xs uppercase tracking-tight">
              {player.badge}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="ml-6 flex flex-col">
          <span
            className={`font-['Barlow_Condensed'] text-sm tracking-[0.2em] mb-1 uppercase
              ${player.isHost ? "text-[#f6be39]" : "text-[#bdcabe]"}`}
          >
            {player.role}
          </span>
          <h2 className="font-['Noto_Serif'] text-2xl font-bold text-[#e5e2e1] tracking-tight uppercase">
            {player.name}
          </h2>
          <div className={`mt-2 flex items-center gap-2 ${player.statusColor}`}>
            <span className="material-symbols-outlined icon-filled text-sm">
              {player.statusIcon}
            </span>
            <span className="font-['Barlow_Condensed'] text-xs tracking-widest uppercase">
              SẴN SÀNG
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Empty slot ── */
function EmptySlot() {
  return (
    <div className="group cursor-pointer">
      <div className="flex items-center p-6 bg-[#0e0e0e] border-2 border-dashed border-[#4f4634] hover:border-[#d4a017] transition-colors h-full min-h-[120px]">
        <div className="w-24 h-24 border-2 border-dashed border-[#4f4634] flex items-center justify-center bg-[#131313] shrink-0">
          <span className="material-symbols-outlined text-[#9b8f7a] text-3xl group-hover:text-[#f6be39] transition-colors">
            person_add
          </span>
        </div>
        <div className="ml-6 flex flex-col">
          <span className="font-['Barlow_Condensed'] text-[#9b8f7a] text-sm tracking-[0.2em] mb-1 uppercase group-hover:text-[#d4a017] transition-colors">
            VACANT SLOT
          </span>
          <h2 className="font-['Noto_Serif'] text-2xl font-bold text-[#4f4634] tracking-tight uppercase group-hover:text-[#9b8f7a] transition-colors">
            ĐANG CHỜ...
          </h2>
          <button className="mt-2 font-['Barlow_Condensed'] text-xs tracking-[0.3em] uppercase text-[#f6be39] border-b border-[#f6be39] w-fit pb-1 hover:text-white hover:border-white transition-all">
            MỜI BẠN
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main ── */
export default function WaitingRoom() {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const [players, setPlayers] = useState<Player[]>([]);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();
  const [processedEvents, setProcessedEvents] = useState<Set<string>>(new Set());

  // WebSocket room event handler
  const handleRoomUpdate = (event: string, data: any) => {
    
    // Create a unique event ID to prevent duplicates
    const eventId = `${event}-${data.playerId}-${Date.now()}`;
    
    // Check if we've already processed this event
    if (processedEvents.has(eventId)) {
        return;
    }
    
    // Add this event to processed set
    setProcessedEvents(prev => new Set([...prev, eventId]));
    
    // Clean up old events (keep only last 10)
    setProcessedEvents(prev => {
      const eventsArray = Array.from(prev);
      if (eventsArray.length > 10) {
        return new Set(eventsArray.slice(-10));
      }
      return prev;
    });
    
    if (event === 'room:player-joined') {
      if (data.room && data.playerId && data.playerId !== user?.id) {
        // Find the player who joined
        const joinedPlayer = data.room.playerInfo?.find((player: any) => player._id === data.playerId);
        if (joinedPlayer) {
          const playerName = joinedPlayer.displayName || joinedPlayer.username;
          toast.success(`${playerName} đã tham gia phòng của bạn!`);
        }
      }
      
      // If current user just joined, refresh from API to ensure we have latest state
      if (data.playerId === user?.id) {
        setTimeout(() => fetchRoomFromAPI(roomId!), 500);
      }
      
      // Update room data
      if (data.room) {
        setRoom({
          id: parseInt(data.room._id),
          name: data.room.name,
          isPrivate: data.room.isPrivate,
          password: undefined,
          attendance: `${data.room.currentPlayers} / ${data.room.maxPlayers}`,
          status: data.room.status,
        });

        // Update players list
        if (data.room.playerInfo && data.room.playerInfo.length > 0) {
          const mappedPlayers: Player[] = data.room.playerInfo.map((player: any, index: number) => ({
            id: index + 1,
            role: player._id === data.room.creatorId ? "CHỦ PHÒNG" : `PLAYER ${String(index + 1).padStart(2, '0')}`,
            name: player.displayName || player.username,
            badge: player._id === data.room.creatorId ? "HOST" : null,
            statusIcon: "check_circle",
            statusLabel: "SẴN SÀNG",
            statusColor: "text-[#bdcabe]",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(player.displayName || player.username)}&background=f6be39&color=261a00`,
            isHost: player._id === data.room.creatorId,
            isEmpty: false,
          }));
          setPlayers(mappedPlayers);
        } else {
          setPlayers([]);
        }
      }
    } else if (event === 'room:player-left') {
      
      if (data.playerId && data.playerId !== user?.id) {
        // Only show toast for other players, not for the one who left
        // Use the leavingPlayer data if available, otherwise try to find in playerInfo
        let playerName = 'Unknown Player';
        
        if (data.leavingPlayer) {
          playerName = data.leavingPlayer.displayName || data.leavingPlayer.username || 'Unknown Player';
        } else {
          // Fallback: try to find in current playerInfo (might not work since player left)
          const leftPlayer = data.room?.playerInfo?.find((player: any) => player._id === data.playerId);
          if (leftPlayer) {
            playerName = leftPlayer.displayName || leftPlayer.username;
          }
        }
        
        toast.success(`${playerName} đã rời phòng`);
      } else {
      }
      
      // Check if host transferred
      if (data.newHostId && data.room) {
        const newHost = data.room.playerInfo?.find((player: any) => player._id === data.newHostId);
        if (newHost) {
          const newHostName = newHost.displayName || newHost.username;
          if (data.newHostId === user?.id) {
            toast.success('Bạn đã trở thành chủ phòng mới!');
          } else {
            toast.success(`${newHostName} đã trở thành chủ phòng mới!`);
          }
        }
      }
      
      // Update room data
      if (data.room) {
        setRoom({
          id: parseInt(data.room._id),
          name: data.room.name,
          isPrivate: data.room.isPrivate,
          password: undefined,
          attendance: `${data.room.currentPlayers} / ${data.room.maxPlayers}`,
          status: data.room.status,
        });

        // Update players list
        if (data.room.playerInfo && data.room.playerInfo.length > 0) {
          const mappedPlayers: Player[] = data.room.playerInfo.map((player: any, index: number) => ({
            id: index + 1,
            role: player._id === data.room.creatorId ? "CHỦ PHÒNG" : `PLAYER ${String(index + 1).padStart(2, '0')}`,
            name: player.displayName || player.username,
            badge: player._id === data.room.creatorId ? "HOST" : null,
            statusIcon: "check_circle",
            statusLabel: "SẴN SÀNG",
            statusColor: "text-[#bdcabe]",
            avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(player.displayName || player.username)}&background=f6be39&color=261a00`,
            isHost: player._id === data.room.creatorId,
            isEmpty: false,
          }));
          setPlayers(mappedPlayers);
        } else {
          setPlayers([]);
        }
      }
    } else if (event === 'room:deleted') {
      navigate('/online');
    }
  };

  // Join WebSocket room when component mounts and roomId is available
  useEffect(() => {
    if (roomId && user) {
      // Join the WebSocket room
      websocketService.joinRoom(roomId, user.id);
      
      // Listen for room updates
      websocketService.onRoomUpdate(handleRoomUpdate);

      // Cleanup on unmount
      return () => {
        websocketService.offRoomUpdate(handleRoomUpdate);
        websocketService.leaveRoom(roomId);
      };
    }
  }, [roomId, user, navigate]);

  // Load room data from localStorage first, then fetch from API if not found
  useEffect(() => {
    if (roomId) {
      // Always fetch fresh data from API to ensure we have the latest state
      fetchRoomFromAPI(roomId);
    }
  }, [roomId, navigate]);

  const fetchRoomFromAPI = async (roomId: string) => {
    try {
      setLoading(true);
      const roomDetails = await roomApi.getRoomDetails(roomId);
      const mappedRoom: Room = {
        id: parseInt(roomId),
        name: roomDetails.name,
        isPrivate: roomDetails.isPrivate,
        password: undefined, // Password is not returned in API response for security
        attendance: `${roomDetails.currentPlayers} / ${roomDetails.maxPlayers}`,
        status: roomDetails.status,
      };
      setRoom(mappedRoom);

      // Map player data from API response
      if (roomDetails.playerInfo && roomDetails.playerInfo.length > 0) {
        const mappedPlayers: Player[] = roomDetails.playerInfo.map((player, index) => ({
          id: index + 1,
          role: player._id === roomDetails.creatorId ? "CHỦ PHÒNG" : `PLAYER ${String(index + 1).padStart(2, '0')}`,
          name: player.displayName || player.username,
          badge: player._id === roomDetails.creatorId ? "HOST" : null,
          statusIcon: "check_circle",
          statusLabel: "SẴN SÀNG",
          statusColor: "text-[#bdcabe]",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(player.displayName || player.username)}&background=f6be39&color=261a00`,
          isHost: player._id === roomDetails.creatorId,
          isEmpty: false,
        }));
        setPlayers(mappedPlayers);
      } else {
        // No players in room yet
        setPlayers([]);
      }
    } catch (error) {
      // Room not found or error, navigate back to room list
      navigate('/online');
    } finally {
      setLoading(false);
    }
  };

  const handleLeaveRoom = async () => {
    if (roomId) {
      try {
        await roomApi.leaveRoom(roomId);
        toast.success('Rời phòng thành công!');
      } catch (error) {
          toast.error('Không thể rời phòng');
      } finally {
        // Always navigate back to room list
        navigate('/online');
      }
    }
  };

  const filledCount = players.length;
  const totalSlots = room ? parseInt(room.attendance.split(' / ')[1]) : 4; // Get maxPlayers from room attendance
  const canStart = filledCount >= 2 && filledCount === totalSlots; // Need at least 2 players to start
  const waitingFor = totalSlots - filledCount;

  // Create display players array (filled players + empty slots)
  const displayPlayers = [...players];
  for (let i = filledCount; i < totalSlots; i++) {
    displayPlayers.push({
      id: i + 1,
      isHost: false,
      isEmpty: true,
    } as Player);
  }

  if (loading) {
    return (
      <>
        <style>{GLOBAL_STYLE}</style>
        <div className="art-deco-bg text-[#e5e2e1] font-['Work_Sans'] min-h-screen flex items-center justify-center">
          <div className="text-center space-y-6">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#d4a017] border-t-transparent mx-auto"></div>
            <p className="font-['Barlow_Condensed'] text-lg text-[#d3c5ae] opacity-60 italic tracking-wider">
              Loading room...
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      <div className="art-deco-bg text-[#e5e2e1] font-['Work_Sans'] min-h-screen flex flex-col items-center justify-center p-6">
        <main className="w-full max-w-4xl flex flex-col gap-12">

          {/* ── Header ── */}
          <header className="text-center space-y-4">
            {/* Back Button */}
            <div className="flex justify-start">
              <button 
                onClick={handleLeaveRoom}
                className="flex items-center gap-2 text-[#d3c5ae] hover:text-[#f6be39] transition-colors duration-200"
              >
                <span className="material-symbols-outlined">arrow_back</span>
                <span className="font-['Barlow_Condensed'] font-bold uppercase tracking-[0.2em]">Quay Lại</span>
              </button>
            </div>
            
            <h1 className="gold-glow font-['Noto_Serif'] text-5xl md:text-6xl font-bold text-[#f6be39] tracking-widest uppercase">
              PHÒNG CHỜ
            </h1>
            
            {/* Room Name */}
            <div className="space-y-2">
              <h2 className="font-['Noto_Serif'] text-2xl text-[#e5e2e1] uppercase tracking-wide">
                {room?.name || 'Loading...'}
              </h2>
              <div className="flex items-center justify-center gap-4">
                <div className="h-px w-12 bg-[#d4a017]" />
                <p className="font-['Barlow_Condensed'] text-xl text-[#cac6be] tracking-widest uppercase opacity-80">
                  Waiting for players to join the atelier...
                </p>
                <div className="h-px w-12 bg-[#d4a017]" />
              </div>
            </div>
          </header>

          {/* ── Player Slots ── */}
          <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {displayPlayers.map((player) =>
              player.isEmpty ? (
                <EmptySlot key={player.id} />
              ) : (
                <FilledSlot key={player.id} player={player} />
              )
            )}
          </section>

          {/* ── Footer Actions ── */}
          <footer className="flex flex-col items-center gap-6 mt-4">
            {/* Start Button */}
            <button
              disabled={!canStart}
              onClick={() => canStart && navigate('/game')}
              className={`w-full md:min-w-[400px] md:w-auto h-20 border-2 flex items-center justify-center gap-4 transition-all duration-300
                ${canStart
                  ? "bg-linear-to-r from-[#f6be39] to-[#d4a017] border-[#f6be39] text-[#261a00] cursor-pointer btn-start-active active:scale-95"
                  : "bg-[#353534] border-[#4f4634] text-[#9b8f7a] opacity-50 cursor-not-allowed"
                }`}
            >
              <span className={`material-symbols-outlined ${canStart ? "" : "icon-filled"}`}>
                {canStart ? "play_arrow" : "lock"}
              </span>
              <span className="font-['Barlow_Condensed'] text-2xl font-bold tracking-[0.3em] uppercase">
                BẮT ĐẦU TRẬN ĐẤU
              </span>
            </button>

            {/* Status dots */}
            <div className="flex items-center gap-3 py-2 px-4 bg-[#1c1b1b] border border-[#4f4634]">
              <div className="flex gap-1">
                {displayPlayers.map((p) => (
                  <div
                    key={p.id}
                    className={`w-2 h-2 ${!p.isEmpty ? "bg-[#f6be39]" : "bg-[#4f4634]"}`}
                  />
                ))}
              </div>
              <span className="font-['Barlow_Condensed'] text-sm tracking-widest text-[#cac6be] uppercase">
                {canStart
                  ? "All players ready — let the game begin!"
                  : `Waiting for ${waitingFor} more elite player${waitingFor > 1 ? "s" : ""}...`}
              </span>
            </div>
          </footer>
        </main>

        {/* ── Corner Decorations ── */}
        <div className="fixed top-8 left-8 w-24 h-24 border-t-2 border-l-2 border-[#d4a017] opacity-30 pointer-events-none" />
        <div className="fixed top-8 right-8 w-24 h-24 border-t-2 border-r-2 border-[#d4a017] opacity-30 pointer-events-none" />
        <div className="fixed bottom-8 left-8 w-24 h-24 border-b-2 border-l-2 border-[#d4a017] opacity-30 pointer-events-none" />
        <div className="fixed bottom-8 right-8 w-24 h-24 border-b-2 border-r-2 border-[#d4a017] opacity-30 pointer-events-none" />
      </div>
    </>
  );
}
