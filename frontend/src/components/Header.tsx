import { LogOut, Home, PenSquare, Settings } from 'lucide-react';

interface HeaderProps {
  onNavigate: (page: { type: string; postId?: string | number }) => void;
  onLogout: () => void;
}

/**
 * Blog header + navigation buttons.
 * - Uses a lightweight navigation payload: { type: string; postId?: string }
 * - App.tsx side can normalize this into its Page union type.
 */
export function Header({ onNavigate, onLogout }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button
            type="button"
            onClick={() => onNavigate({ type: 'main' })}
            className="text-2xl font-semibold text-gray-900 hover:opacity-90"
            aria-label="Go to home"
          >
            Tlog
          </button>

          <nav className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onNavigate({ type: 'main' })}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Home className="w-4 h-4" />
              Home
            </button>

            <button
              type="button"
              onClick={() => onNavigate({ type: 'new-post' })}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <PenSquare className="w-4 h-4" />
              New post
            </button>

            <button
              type="button"
              // App의 Page union이 "my-post-view"에 postId를 요구하면,
              // 안정적인 sentinel 값("me")을 넘겨서 타입/런타임 모두 안전하게 처리 가능.
              onClick={() => onNavigate({ type: 'my-post-view', postId: 'me' })}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <PenSquare className="w-4 h-4" />
              My posts
            </button>

            <button
              type="button"
              onClick={() => onNavigate({ type: 'settings' })}
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </button>
          </nav>
        </div>

        <button
          type="button"
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