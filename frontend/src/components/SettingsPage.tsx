import { Post } from "../api/auth";

interface SettingsPageProps {
  posts: Post[];
  onNavigate: (page: { type: string; postId: string | number }) => void;
}

export function SettingsPage({ posts, onNavigate }: SettingsPageProps) {
  // Filter to show only user's posts
  const userPosts = posts.filter(post => post.isUserPost);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">My Posts</h2>
      
      {userPosts.length > 0 ? (
        <div className="space-y-6">
          {userPosts.map((post) => (
            <button
              key={post.id}
              onClick={() => onNavigate({ type: 'my-post-view', postId: post.id })}
              className="w-full bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow text-left"
            >
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {post.title}
              </h3>
              <p className="text-gray-600 line-clamp-2">
                {post.preview}
              </p>
            </button>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <p className="text-gray-600 text-center">You haven't created any posts yet.</p>
        </div>
      )}
    </div>
  );
}