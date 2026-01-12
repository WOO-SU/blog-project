import { LogOut, Home, PenSquare, Settings } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: { type: string; postId?: string }) => void;
  onLogout: () => void;
}

export function Header({ onNavigate, onLogout }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-2xl font-semibold text-gray-900">Tlog</h1>
          
          <nav className="flex items-center gap-2">
            <button
              onClick={() => onNavigate({ type: 'main' })}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Home className="w-4 h-4" />
              Main
            </button>
            
            <button
              onClick={() => onNavigate({ type: 'new-post' })}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <PenSquare className="w-4 h-4" />
              New Post
            </button>
            
            <button
              onClick={() => onNavigate({ type: 'settings' })}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </nav>
        </div>
        
        <button
          onClick={onLogout}
          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </header>
  );
}
