import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { roomApi } from "../../services/roomApi";
import { GameRoom, PaginationResponse } from "../../types/room.types";
import CreateRoomModal from "./RoomModal";
import PasswordModal from "./PasswordModal";
import toast from "react-hot-toast";

/* ── Room Type Definition (UI Layer) ── */
interface Room {
  id: string;
  series: string;
  seriesCls: string;
  dotCls: string;
  name: string;
  attendance: string;
  status: string;
  statusCls: string;
  isPrivate: boolean;
  isFull: boolean;
  btn: "outline" | "gold" | "disabled";
  maxPlayers: number;
  currentPlayers: number;
  actualStatus: 'waiting' | 'playing' | 'finished';
}

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
  .gold-glow   { text-shadow: 0 0 8px rgba(246,190,57,0.45); }
  .card-shadow { box-shadow: 0 10px 30px rgba(0,0,0,0.45), inset 0 0 0 1px rgba(212,160,23,0.18); }
  .create-glow { box-shadow: 0 0 15px rgba(246,190,57,0.3); }
  .create-glow:hover { box-shadow: 0 0 26px rgba(246,190,57,0.5); }
  .join-glow   { box-shadow: 0 4px 10px rgba(246,190,57,0.2); }
  .join-glow:hover { box-shadow: 0 8px 22px rgba(246,190,57,0.4); }
`;

/* ── Room Card ── */
function RoomCard({ room, onJoin }: { 
  room: Room; 
  onJoin: (room: Room) => void;
}) {
  return (
    <div
      className={[
        "relative flex flex-col justify-between min-h-[220px] p-6 bg-[#0e0e0e] card-shadow",
        "transition-all duration-300 hover:bg-[#1c1b1b] hover:-translate-y-1",
        room.isFull ? "opacity-70" : "",
      ].join(" ")}
    >
      {/* Lock / Public icon */}
      <div className="absolute top-4 right-4">
        {room.isPrivate ? (
          <span className="material-symbols-outlined icon-filled text-[#d4a017] text-xl">lock</span>
        ) : (
          <span className="material-symbols-outlined text-[#bdcabe] text-xl">public</span>
        )}
      </div>

      <div>
        {/* Series badge */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`w-2 h-2 inline-block shrink-0 ${room.dotCls}`} />
          <span className={`font-['Barlow_Condensed'] text-xs font-bold uppercase tracking-[0.2em] ${room.seriesCls}`}>
            {room.series}
          </span>
        </div>

        {/* Room name */}
        <h3 className="font-['Noto_Serif'] text-2xl font-bold text-[#e5e2e1] mb-4">{room.name}</h3>

        {/* Stats */}
        <div className="flex items-center gap-6 text-[#d3c5ae]">
          <div className="flex flex-col">
            <span className="font-['Barlow_Condensed'] text-[10px] uppercase opacity-50 tracking-widest">Attendance</span>
            <span className="font-['Barlow_Condensed'] font-bold text-[#f6be39] text-xl tracking-tight">{room.attendance}</span>
          </div>
          <div className="flex flex-col border-l border-[#4f4634] pl-6">
            <span className="font-['Barlow_Condensed'] text-[10px] uppercase opacity-50 tracking-widest">Status</span>
            <span className={`font-['Barlow_Condensed'] font-bold text-xl tracking-tight uppercase ${room.statusCls}`}>{room.status}</span>
          </div>
        </div>
      </div>

      {/* CTA Button */}
      <div className="mt-6 space-y-2">
        {room.btn === "outline" && (
          <button 
            onClick={() => onJoin(room)}
            className="w-full py-3 bg-transparent border-2 border-[#d4a017] text-[#f6be39]
              font-['Barlow_Condensed'] font-black uppercase text-base tracking-wide cursor-pointer
              hover:bg-[#d4a017] hover:text-[#261a00] active:scale-95 transition-all duration-300">
            Join Room
          </button>
        )}
        {room.btn === "gold" && (
          <button 
            onClick={() => onJoin(room)}
            className="w-full py-3 bg-transparent border-2 border-[#d4a017] text-[#f6be39]
              font-['Barlow_Condensed'] font-black uppercase text-base tracking-wide cursor-pointer
              hover:bg-[#d4a017] hover:text-[#261a00] active:scale-95 transition-all duration-300">
            Join Room
          </button>
        )}
        {room.btn === "disabled" && (
          <button disabled className="w-full py-3 bg-[#353534] border-0 text-[#e5e2e1] opacity-40
            font-['Barlow_Condensed'] font-black uppercase text-base tracking-wide cursor-not-allowed">
            Spectate Only
          </button>
        )}
        
      </div>
    </div>
  );
}

/* ── Page ── */
export default function RoomList() {
  const navigate = useNavigate();
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'public' | 'private'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  
  // Load rooms from API on component mount
  const [rooms, setRooms] = useState<Room[]>([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 9, // 3x3 grid
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false,
  });

  useEffect(() => {
    loadRooms();
  }, [filter, searchTerm, pagination.page, pagination.limit]);

  const loadRooms = async () => {
    try {
      setLoading(true);
      let apiResponse: PaginationResponse<GameRoom>;
      
      if (filter === 'all') {
        apiResponse = await roomApi.getRooms(undefined, searchTerm, { page: pagination.page, limit: pagination.limit });
      } else {
        apiResponse = await roomApi.getRooms(filter === 'private', searchTerm, { page: pagination.page, limit: pagination.limit });
      }
      
      const mappedRooms = apiResponse.data.map(mapApiRoomToUIRoom);
      setRooms(mappedRooms);
      setPagination({
        page: apiResponse.page,
        limit: apiResponse.limit,
        total: apiResponse.total,
        totalPages: apiResponse.totalPages,
        hasNext: apiResponse.hasNext,
        hasPrev: apiResponse.hasPrev,
      });
    } catch (error) {
      console.error('Error loading rooms:', error);
      toast.error('Failed to load rooms');
    } finally {
      setLoading(false);
    }
  };

  // Helper function to map API room to UI room
  const mapApiRoomToUIRoom = (apiRoom: GameRoom): Room => {
    const isFull = apiRoom.currentPlayers >= apiRoom.maxPlayers;
    
    return {
      id: apiRoom._id,
      series: apiRoom.isPrivate ? "Private Atelier" : "Classic Tier",
      seriesCls: apiRoom.isPrivate ? "text-[#bdcabe]" : "text-[#f6be39]",
      dotCls: apiRoom.isPrivate ? "bg-[#bdcabe]" : "bg-[#f6be39]",
      name: apiRoom.name,
      attendance: `${apiRoom.currentPlayers} / ${apiRoom.maxPlayers}`,
      status: apiRoom.isPrivate ? "PRIVATE" : "PUBLIC",
      statusCls: apiRoom.status === 'waiting' ? "text-[#e5e2e1]" : "text-[#f6be39]",
      isPrivate: apiRoom.isPrivate,
      isFull: isFull,
      btn: isFull ? "disabled" : (apiRoom.isPrivate ? "outline" : "gold"),
      maxPlayers: apiRoom.maxPlayers,
      currentPlayers: apiRoom.currentPlayers,
      actualStatus: apiRoom.status,
    };
  };


  const createRoom = async (roomData: {
    name: string;
    isPrivate: boolean;
    password?: string;
  }) => {
    try {
      const apiRoomData = {
        name: roomData.name,
        isPrivate: roomData.isPrivate,
        password: roomData.password,
        maxPlayers: 4, // Default value
        turnTimeLimit: 30, // Default value
        autoRoll: false, // Default value
        startingMoney: 1200, // Default value
      };

      const createdRoom = await roomApi.createRoom(apiRoomData);
      setShowRoomModal(false);
      toast.success('Room created successfully!');
      
      // Save room to localStorage for WaitingRoom component
      const savedRooms = localStorage.getItem('monopolyRooms');
      const rooms = savedRooms ? JSON.parse(savedRooms) : [];
      rooms.push(createdRoom);
      localStorage.setItem('monopolyRooms', JSON.stringify(rooms));
      
      // Navigate to waiting room
      navigate(`/waiting/${createdRoom._id}`);
    } catch (error) {
      console.error('Error creating room:', error);
      toast.error('Failed to create room');
    }
  };

  const handleJoinRoom = async (room: Room) => {
    try {
      if (room.isPrivate) {
        setSelectedRoom(room);
        setShowPasswordModal(true);
      } else {
        // For public rooms, join directly
        await roomApi.joinRoom(room.id);
        toast.success('Joined room successfully!');
        navigate(`/waiting/${room.id}`);
      }
    } catch (error) {
      console.error('Error joining room:', error);
      toast.error('Failed to join room');
    }
  };

  const handlePasswordSubmit = async (password: string) => {
    if (!selectedRoom) return;
    
    try {
      await roomApi.joinRoom(selectedRoom.id, { password });
      toast.success('Joined private room successfully!');
      setShowPasswordModal(false);
      setSelectedRoom(null);
      
      // Navigate to waiting room
      navigate(`/waiting/${selectedRoom.id}`);
    } catch (error) {
      console.error('Error joining private room:', error);
      toast.error('Wrong password or failed to join room');
    }
  };

  return (
    <>
      <style>{GLOBAL_STYLE}</style>

      <div className="bg-[#131313] text-[#e5e2e1] font-['Work_Sans'] min-h-screen overflow-x-hidden">
        <main className="max-w-7xl mx-auto pt-16 px-6 pb-16">

          {/* ── Back Button ── */}
          <button 
            onClick={() => navigate('/home')}
            className="mb-8 flex items-center gap-2 text-[#d3c5ae] hover:text-[#f6be39] transition-colors duration-200 cursor-pointer"
          >
            <span className="material-symbols-outlined">arrow_back</span>
            <span className="font-['Barlow_Condensed'] font-bold uppercase tracking-[0.2em]">Quay Lại</span>
          </button>

          {/* ── Header: title LEFT | players + button RIGHT ── */}
          <div className="flex items-end justify-between gap-6 mb-12">

            {/* Left — title + tagline */}
            <div className="space-y-2 max-w-xl">
              <h1 className="gold-glow font-['Noto_Serif'] text-4xl md:text-5xl font-bold uppercase tracking-tight text-[#f6be39]">
                Cờ Tỷ Phú Lobby
              </h1>
              <p className="text-[#d3c5ae] opacity-80 leading-relaxed italic border-l-2 border-[#d4a017] pl-4 text-sm">
                "Fortune favors the bold at the Imperial Tables. Choose your atelier wisely."
              </p>
            </div>

            {/* Right — CTA */}
            <div className="flex flex-col items-end gap-4 shrink-0">
              {/* Create Room button */}
              {rooms.length > 0 && (
                <button 
                  onClick={() => setShowRoomModal(true)}
                  className="px-8 py-3 bg-linear-to-br from-[#f6be39] to-[#d4a017]
                    text-[#261a00] border-0 font-['Barlow_Condensed'] font-black uppercase text-lg tracking-wide cursor-pointer
                    create-glow hover:scale-105 active:scale-95 transition-transform duration-200">
                  Create Room
                </button>
              )}
            </div>
          </div>

          {/* ── Search and Filter Bar ── */}
          <div className="flex items-center justify-between gap-6 mb-8">
            {/* Left — Search Input */}
            <div className="relative max-w-md flex-1">
              <span className="material-symbols-outlined absolute left-3 top-1/2 transform -translate-y-1/2 text-[#d3c5ae] text-lg">
                search
              </span>
              <input
                type="text"
                placeholder="Search room name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-[#1c1b1b] border border-[#666] rounded text-[#e5e2e1] placeholder-[#d3c5ae] focus:outline-none focus:border-[#d4a017] transition-colors duration-200"
              />
            </div>

            {/* Right — Filter Buttons */}
            <div className="flex gap-2 shrink-0">
              <button
                onClick={() => setFilter('all')}
                className={`px-4 py-2 text-sm font-['Barlow_Condensed'] font-bold uppercase tracking-wider rounded transition-all duration-200 cursor-pointer ${
                  filter === 'all'
                    ? 'bg-[#d4a017] text-[#261a00]'
                    : 'bg-transparent border border-[#666] text-[#d3c5ae] hover:border-[#d3c5ae]'
                }`}
              >
                All Rooms
              </button>
              <button
                onClick={() => setFilter('public')}
                className={`px-4 py-2 text-sm font-['Barlow_Condensed'] font-bold uppercase tracking-wider rounded transition-all duration-200 cursor-pointer ${
                  filter === 'public'
                    ? 'bg-[#d4a017] text-[#261a00]'
                    : 'bg-transparent border border-[#666] text-[#d3c5ae] hover:border-[#d3c5ae]'
                }`}
              >
                <span className="material-symbols-outlined text-lg mr-1">public</span>
                Public
              </button>
              <button
                onClick={() => setFilter('private')}
                className={`px-4 py-2 text-sm font-['Barlow_Condensed'] font-bold uppercase tracking-wider rounded transition-all duration-200 cursor-pointer ${
                  filter === 'private'
                    ? 'bg-[#d4a017] text-[#261a00]'
                    : 'bg-transparent border border-[#666] text-[#d3c5ae] hover:border-[#d3c5ae]'
                }`}
              >
                <span className="material-symbols-outlined text-lg mr-1">lock</span>
                Private
              </button>
              <button
                onClick={loadRooms}
                disabled={loading}
                className={`px-4 py-2 text-sm font-['Barlow_Condensed'] font-bold uppercase tracking-wider rounded transition-all duration-200 cursor-pointer ${
                  loading
                    ? 'bg-[#353534] text-[#e5e2e1] opacity-40 cursor-not-allowed'
                    : 'bg-transparent border border-[#666] text-[#d3c5ae] hover:border-[#d3c5ae] hover:text-[#f6be39]'
                }`}
              >
                <span className="material-symbols-outlined text-lg mr-1">refresh</span>
                Reload
              </button>
            </div>
          </div>

          {/* ── Room Grid ── */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-6">
                <div className="animate-spin rounded-full h-16 w-16 border-4 border-[#d4a017] border-t-transparent mx-auto"></div>
                <p className="font-['Barlow_Condensed'] text-lg text-[#d3c5ae] opacity-60 italic tracking-wider">
                  Loading available rooms...
                </p>
              </div>
            </div>
          ) : rooms.length === 0 ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="text-center space-y-6">
                <h2 className="font-['Noto_Serif'] text-6xl md:text-8xl font-bold uppercase tracking-widest text-[#d4a017] opacity-30 gold-glow">
                  EMPTY
                </h2>
                <p className="font-['Barlow_Condensed'] text-lg text-[#d3c5ae] opacity-60 italic tracking-wider max-w-md mx-auto">
                  "The halls await their patrons. Be the first to claim your table."
                </p>
                <div className="flex justify-center">
                  <button 
                    onClick={() => setShowRoomModal(true)}
                    className="px-10 py-4 bg-linear-to-br from-[#f6be39] to-[#d4a017]
                      text-[#261a00] border-0 font-['Barlow_Condensed'] font-black uppercase text-lg tracking-wide cursor-pointer
                      create-glow hover:scale-105 active:scale-95 transition-transform duration-200">
                    Create First Room
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
                {rooms.map((room) => (
                  <RoomCard key={room.id} room={room} onJoin={handleJoinRoom} />
                ))}
              </div>

              {/* ── Pagination Controls ── */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-4 mt-12">
                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                    disabled={!pagination.hasPrev}
                    className={`px-4 py-2 font-['Barlow_Condensed'] font-bold uppercase text-sm tracking-wider rounded transition-all duration-200 cursor-pointer ${
                      pagination.hasPrev
                        ? 'bg-[#d4a017] text-[#261a00] hover:bg-[#f6be39] cursor-pointer'
                        : 'bg-[#353534] text-[#e5e2e1] opacity-40 cursor-not-allowed'
                    }`}
                  >
                    <span className="material-symbols-outlined text-lg">chevron_left</span>
                    Previous
                  </button>

                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(pagination.totalPages, 5) }, (_, i) => {
                      let pageNum;
                      if (pagination.totalPages <= 5) {
                        pageNum = i + 1;
                      } else if (pagination.page <= 3) {
                        pageNum = i + 1;
                      } else if (pagination.page >= pagination.totalPages - 2) {
                        pageNum = pagination.totalPages - 4 + i;
                      } else {
                        pageNum = pagination.page - 2 + i;
                      }

                      return (
                        <button
                          key={pageNum}
                          onClick={() => setPagination(prev => ({ ...prev, page: pageNum }))}
                          className={`w-10 h-10 font-['Barlow_Condensed'] font-bold text-sm tracking-wider rounded transition-all duration-200 cursor-pointer ${
                            pageNum === pagination.page
                              ? 'bg-[#d4a017] text-[#261a00]'
                              : 'bg-transparent border border-[#666] text-[#d3c5ae] hover:border-[#d3c5ae] cursor-pointer'
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}
                  </div>

                  <button
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                    disabled={!pagination.hasNext}
                    className={`px-4 py-2 font-['Barlow_Condensed'] font-bold uppercase text-sm tracking-wider rounded transition-all duration-200 cursor-pointer ${
                      pagination.hasNext
                        ? 'bg-[#d4a017] text-[#261a00] hover:bg-[#f6be39] cursor-pointer'
                        : 'bg-[#353534] text-[#e5e2e1] opacity-40 cursor-not-allowed'
                    }`}
                  >
                    Next
                    <span className="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </div>
              )}

              {/* ── Results Info ── */}
              <div className="text-center mt-6">
                <p className="font-['Barlow_Condensed'] text-sm text-[#d3c5ae] opacity-60 tracking-wider">
                  Showing {((pagination.page - 1) * pagination.limit) + 1} to {Math.min(pagination.page * pagination.limit, pagination.total)} of {pagination.total} rooms
                </p>
              </div>
            </>
          )}

        </main>
      </div>

      {/* Room Modal */}
      {showRoomModal && <CreateRoomModal onClose={() => setShowRoomModal(false)} onCreateRoom={createRoom} />}

      {/* Password Modal */}
      {showPasswordModal && selectedRoom && (
        <PasswordModal 
          onClose={() => {
            setShowPasswordModal(false);
            setSelectedRoom(null);
          }}
          onJoin={handlePasswordSubmit}
          roomName={selectedRoom.name}
        />
      )}
    </>
  );
}
