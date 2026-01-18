// frontend/src/components/SettingsPage.tsx
import { useEffect, useState } from 'react';
import { User, FileText, Loader2 } from 'lucide-react';
import { Post, getMyPostsApi } from '../api/auth';

interface SettingsPageProps {
  // We accept posts to match App.tsx's usage, but we will fetch our own data
  posts?: Post[]; 
  onNavigate: (page: { type: string; postId?: string | number }) => void;
}

export function SettingsPage({ onNavigate }: SettingsPageProps) {
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch user's posts directly from backend
    getMyPostsApi()
      .then((data) => {
        // Ensure data is an array before setting
        if (Array.isArray(data)) {
          setMyPosts(data);
        } else {
          setMyPosts([]);
        }
      })
      .catch((err) => {
        console.error("Failed to fetch my posts:", err);
        setMyPosts([]);
      })
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <User className="w-6 h-6" />
          Account Settings
        </h2>
        <div className="space-y-4">
          <div className="p-4 bg-gray-50 rounded-md">
            <p className="text-sm text-gray-500">Account Type</p>
            <p className="font-medium text-gray-900">Standard User</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
          <FileText className="w-6 h-6" />
          My Posts ({myPosts.length})
        </h2>
        
        {isLoading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
          </div>
        ) : myPosts.length > 0 ? (
          <div className="space-y-4">
            {myPosts.map(post => (
              <div 
                key={post.id}
                onClick={() => onNavigate({ type: 'post-detail', postId: post.id })}
                className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
              >
                <div>
                  <h3 className="font-medium text-gray-900">{post.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">
                    {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Just now'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg border border-dashed border-gray-200">
            <p>You haven't written any posts yet.</p>
            <button 
              onClick={() => onNavigate({ type: 'new-post' })}
              className="mt-2 text-blue-600 hover:underline text-sm"
            >
              Create your first post
            </button>
          </div>
        )}
      </div>
    </div>
  );
}