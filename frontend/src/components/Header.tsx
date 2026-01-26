import { LogOut, Home, PenSquare, Settings } from 'lucide-react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  onLogout: () => void;
}

/**
 * Blog header + navigation buttons.
 * - Uses a lightweight navigation payload: { type: string; postId?: string }
 * - App.tsx side can normalize this into its Page union type.
 */
export function Header({ onLogout }: HeaderProps) {
  return (
    <header className="w-full bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link
            to="/"
            className="text-2xl font-semibold text-gray-900 hover:opacity-90"
            aria-label="Go to home"
          >
            Tlog
          </Link>

          <nav className="flex items-center gap-2">
            <Link
              to="/"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Home className="w-4 h-4" />
              Main
            </Link>

            <Link
              to="/posts/new"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <PenSquare className="w-4 h-4" />
              New Post
            </Link>

            <Link
              to="/settings"
              className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            >
              <Settings className="w-4 h-4" />
              Settings
            </Link>
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
