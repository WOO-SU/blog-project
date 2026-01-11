import { Post } from '../App';

interface MainPageProps {
  posts: Post[];
  onNavigate: (page: { type: string; postId: string }) => void;
}

export function MainPage({ posts, onNavigate }: MainPageProps) {
  // Display only the first 3 posts
  const displayPosts = posts.slice(0, 3);

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">Recent Posts</h2>
      
      <div className="space-y-6">
        {displayPosts.map((post) => (
          <button
            key={post.id}
            onClick={() => onNavigate({ type: post.isUserPost ? 'my-post-view' : 'post-detail', postId: post.id })}
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
      
      {posts.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No posts yet. Create your first post!</p>
        </div>
      )}
    </div>
  );
}
