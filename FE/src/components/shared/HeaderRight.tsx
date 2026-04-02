import type { ReactNode } from 'react';
import SettingsMenu from './SettingsMenu';
import { useOnlineStatusStore } from '../../store/onlineStatusStore';

interface HeaderRightProps {
  avatarUrl?: string;
  children?: ReactNode;
}

const DEFAULT_AVATAR = "https://lh3.googleusercontent.com/aida-public/AB6AXuDGTChjzuQC94AV2eZmkNLqQ5SsCPWw-xwsHEBxdXtLFkmRsuZrTm4qsJzyffE-ksKuXTroGDse1-fuldHoR6Iue3JzEvucmh3zGPuGjgqAmpg3BNk7jBru6kDO0yPs-ZM0XivP5RkzV0cYbZA8pWDMC_sBRzLcnGWsh_air4mDvaQ8Y1tj8vLw8LelMU43SH1KcDEBqjIHV-aZMbXtgwCxeX0FVtMSFrmWqKYvHXIU2s-ZrjDJQteL0GgZk9FTRe8bqg0LF7SUDwk";

export default function HeaderRight({ avatarUrl = DEFAULT_AVATAR, children }: HeaderRightProps) {
  const currentUserOnline = useOnlineStatusStore(state => state.getCurrentUserStatus());

  return (
    <div className="flex items-center gap-4">
      {children}
      <SettingsMenu />
      <div className="relative group">
        <span className="material-symbols-outlined text-[#f6be39] cursor-pointer hover:bg-[#353534] p-1 rounded transition-colors">notifications</span>
        <span className="absolute top-1 right-1 w-2 h-2 bg-[#ffb4ab] rounded-full border border-[#0e0e0e]" />
      </div>
      <div className="relative">
        <div className="w-10 h-10 border-2 border-[#f6be39] p-0.5 overflow-hidden bg-[#2a2a2a] cursor-pointer hover:border-[#ffdfa0] transition-all">
          <img
            src={avatarUrl}
            alt="Avatar"
            className="w-full h-full object-cover"
          />
        </div>
        {/* Online status indicator */}
        <div 
          className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#0e0e0e] transition-colors ${
            currentUserOnline 
              ? 'bg-green-500' 
              : 'bg-gray-500'
          }`}
          title={currentUserOnline ? 'Online' : 'Offline'}
        />
      </div>
    </div>
  );
}
