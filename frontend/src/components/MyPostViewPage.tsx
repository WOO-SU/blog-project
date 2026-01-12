import { Edit } from 'lucide-react';
import { Post } from '../App';

interface MyPostViewPageProps {
  post: Post;
  onEdit: (postId: string) => void;
}

export function MyPostViewPage({ post, onEdit }: MyPostViewPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-3xl font-semibold text-gray-900">My Post</h2>
        
        <button
          onClick={() => onEdit(post.id)}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Edit className="w-4 h-4" />
          Edit
        </button>
      </div>
      
      <article className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <h1 className="text-3xl font-semibold text-gray-900 mb-6">
          {post.title}
        </h1>
        
        <div className="prose prose-gray max-w-none">
          <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {post.content}
          </p>
        </div>
      </article>
    </div>
  );
}
