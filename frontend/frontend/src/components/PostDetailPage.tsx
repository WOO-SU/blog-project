import { Post } from '../App';

interface PostDetailPageProps {
  post: Post;
}

export function PostDetailPage({ post }: PostDetailPageProps) {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
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
