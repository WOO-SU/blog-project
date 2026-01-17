import { useState, useEffect } from 'react';
import { Upload, Loader2, Save } from 'lucide-react'; // 아이콘 추가
// 1. 필요한 타입과 API 함수 임포트
import { Post } from "../api/auth";// 혹은 '../api/auth'의 Post 타입
import { createPostApi, updatePostApi } from "../api/auth";

interface NewPostPageProps {
  // onSave: API 호출 성공 후 '목록'이나 '상세 페이지'로 이동하기 위한 콜백으로 변경
  onSuccess: (newOrUpdatedPostId?: number | string) => void; 
  onCancel: () => void; // 취소 버튼용
  editPost?: Post; // 수정 모드일 경우 넘어오는 데이터
}

export function NewPostPage({ onSuccess, onCancel, editPost }: NewPostPageProps) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // 로딩 상태

  // 수정 모드일 경우 기존 데이터 채워넣기
  useEffect(() => {
    if (editPost) {
      setTitle(editPost.title || ''); // title이 없을 경우 대비
      setContent(editPost.content || '');
    }
  }, [editPost]);

  const handleUpload = async () => {
    // 유효성 검사
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    setIsSubmitting(true);

    try {
      if (editPost) {
        // --- [수정 모드] updatePostApi 호출 ---
        await updatePostApi(editPost.id, {
          title,
          content
        });
        alert("게시글이 수정되었습니다.");
        onSuccess(editPost.id); // 수정된 글의 ID를 전달하며 이동 요청
      } else {
        // --- [작성 모드] createPostApi 호출 ---
        const newPost = await createPostApi({
          title,
          content
        });
        alert("새 게시글이 등록되었습니다.");
        onSuccess(newPost.id);
      }
    } catch (error: any) {
      console.error(error);
      alert(error.message || "작업 도중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
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
              disabled={isSubmitting}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
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
              disabled={isSubmitting}
              rows={12}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none disabled:bg-gray-100"
              placeholder="Write your post content here..."
            />
          </div>
        </div>
      </div>
      
      <div className="flex justify-end gap-3 mt-6">
        <button
            onClick={onCancel}
            disabled={isSubmitting}
            className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
        >
            Cancel
        </button>
        <button
          onClick={handleUpload}
          disabled={isSubmitting}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:bg-blue-400"
        >
          {isSubmitting ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : editPost ? (
            <Save className="w-4 h-4" /> // 수정 모드 아이콘
          ) : (
            <Upload className="w-4 h-4" /> // 작성 모드 아이콘
          )}
          {isSubmitting ? 'Saving...' : (editPost ? 'Update' : 'Upload')}
        </button>
      </div>
    </div>
  );
}