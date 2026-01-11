import { useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { Post } from '../App';

interface NewPostPageProps {
  onSave: (title: string, content: string, editPostId?: string) => void;
  editPost?: Post;
}

export function NewPostPage({ onSave, editPost }: NewPostPageProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title);
      setContent(editPost.content);
    }
  }, [editPost]);

  const handleUpload = () => {
    if (title.trim() && content.trim()) {
      onSave(title, content, editPost?.id);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h2 className="text-3xl font-semibold text-gray-900 mb-8">
        {editPost ? 'Edit Post' : 'Create New Post'}
      </h2>
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
        <div className="space-y-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
              Title
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter post title"
            />
          </div>
          
          <div>
            <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
              Content
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="Write your post content here..."
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end mt-6">
        <button
          onClick={handleUpload}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload
        </button>
      </div>
    </div>
  );
}
