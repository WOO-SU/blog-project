import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Edit2, Trash2, Loader2 } from 'lucide-react';
// auth.ts에서 정의한 Post 타입과 API 함수들을 임포트
import { 
  Post as PostType, 
  toggleLikeApi, 
  createCommentApi,
  getCommentsApi,
  getPostDetailApi,
  updateCommentApi, 
  deleteCommentApi,
  deletePostApi 
} from '../api/auth';

interface PostDetailPageProps {
  // PostType에 없는 프론트엔드 전용 필드(isUserPost)를 합집합(&)으로 추가
  post: PostType & { isUserPost?: boolean };
  onRefresh: () => void;
  onNavigate: (page: { type: string; postId?: number | string }) => void;
}

export function PostDetailPage({ post, onRefresh, onNavigate }: PostDetailPageProps) {
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  const [isUserPost, setIsUserPost] = useState<boolean>(false);
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 게시글 삭제 핸들러
  const handleDeletePost = async () => {
    setIsDeletingPost(true);
    try {
      await deletePostApi(post.id);
      await onRefresh();
      onNavigate({ type: 'main' });
    } catch (error: any) {
      alert(error.message || "게시글 삭제 실패");
      setIsDeletingPost(false);
    }
  };

  // 좋아요 토글
  const handleToggleLike = async () => {
    try {
      await toggleLikeApi(post.id);
      onRefresh();
    } catch (error: any) {
      console.error(error);
    }
  };

  const loadComments = async () => {
    try {
      const data = await getCommentsApi(post.id);
      setComments(data || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
      setComments([]);
    }
  };

  useEffect(() => {
    loadComments();
  }, [post.id]);

  useEffect(() => {
    getPostDetailApi(post.id)
      .then((data) => {
        setIsUserPost(Boolean((data as any).is_mine));
      })
      .catch((error) => {
        console.error("Failed to fetch post detail:", error);
        setIsUserPost(false);
      });
  }, [post.id]);

  // 댓글 작성
  const handleAddComment = async () => {
    if (!commentText.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    try {
      await createCommentApi({ 
        // ✅ post.id를 Number()로 감싸서 확실하게 숫자로 전달합니다.
        post: Number(post.id), 
        content: commentText 
      });
      setCommentText('');
      onRefresh();
      await loadComments();
    } catch (error: any) {
      alert(error.message || "댓글 작성 실패");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 수정
  const handleEditComment = async (commentId: number | string) => {
    if (!editedCommentText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await updateCommentApi(commentId, editedCommentText);
      setEditingCommentId(null);
      onRefresh();
      await loadComments();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // 댓글 삭제
  const handleDeleteComment = async (commentId: number | string) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteCommentApi(commentId);
      onRefresh();
      await loadComments();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 relative">
      
      {/* 제목 및 수정/삭제 버튼 */}
      <div className="flex items-start justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          {post.title}
        </h1>

        {/* ✅ 내 글일 때만 수정/삭제 버튼 노출 */}
        {(post.isUserPost || isUserPost) && (
          <div className="flex gap-2 shrink-0 ml-4">
            <button
              onClick={() => onNavigate({ type: 'new-post', postId: post.id })}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors text-sm font-medium"
            >
              <Edit2 className="w-4 h-4" /> Edit
            </button>
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="flex items-center gap-2 px-3 py-2 bg-red-50 text-red-600 rounded-md hover:bg-red-100 transition-colors text-sm font-medium"
            >
              <Trash2 className="w-4 h-4" /> Delete
            </button>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-8">
          <div className="flex items-center text-sm text-gray-500 mb-6 pb-6 border-b border-gray-100">
            <span className="font-medium text-gray-900 mr-2">By {post.author}</span>
            <span>•</span>
            <span className="ml-2">
               {post.created_at ? new Date(post.created_at).toLocaleDateString() : 'Unknown Date'}
            </span>
          </div>

          <div className="prose prose-lg max-w-none text-gray-700 whitespace-pre-wrap">
            {post.content}
          </div>
        </div>

        {/* 좋아요 및 댓글 수 */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex items-center gap-4">
           <button
            onClick={handleToggleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              post.likedByUser 
                ? 'bg-red-100 text-red-600 ring-1 ring-red-200' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${post.likedByUser ? 'fill-current' : ''}`} />
            <span className="font-medium">{post.likes || 0}</span>
          </button>
          <div className="flex items-center gap-2 text-gray-600 px-4 py-2">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">{comments.length} Comments</span>
          </div>
        </div>
      </div>

      {/* 댓글 섹션 */}
      <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Comments</h3>
        
        {/* 댓글 입력창 */}
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm mb-8">
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="What are your thoughts?"
            className="w-full p-4 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none min-h-[100px]"
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleAddComment}
              disabled={isSubmitting || !commentText.trim()}
              className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Post Comment'}
            </button>
          </div>
        </div>

        {/* 댓글 목록 */}
        <div className="space-y-4">
          {comments.map((comment: any) => (
            <div key={comment.id} className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
              {editingCommentId === comment.id ? (
                <div>
                  <textarea
                    value={editedCommentText}
                    onChange={(e) => setEditedCommentText(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-md mb-3"
                    rows={3}
                  />
                  <div className="flex gap-2 justify-end">
                    <button onClick={() => setEditingCommentId(null)} className="px-3 py-1.5 text-gray-600">Cancel</button>
                    <button onClick={() => handleEditComment(comment.id)} className="px-3 py-1.5 bg-blue-600 text-white rounded-md">Save</button>
                  </div>
                </div>
              ) : (
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="font-semibold">{comment.author}</span>
                      <span className="text-xs text-gray-400">{new Date(comment.created_at).toLocaleDateString()}</span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                  {/* 댓글 작성자 본인 확인 로직은 실제 유저 정보가 들어오면 추가 가능 */}
                  <div className="flex gap-1">
                    <button onClick={() => { setEditingCommentId(comment.id); setEditedCommentText(comment.content); }} className="p-1 text-gray-400 hover:text-blue-600"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDeleteComment(comment.id)} className="p-1 text-gray-400 hover:text-red-600"><Trash2 className="w-3.5 h-3.5" /></button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 삭제 확인 모달 */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
          <div className="bg-white rounded-xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-xl font-bold mb-2">Delete Post?</h3>
            <p className="text-gray-600 mb-6">정말로 이 게시글을 삭제하시겠습니까?</p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setShowDeleteConfirm(false)} className="px-4 py-2 bg-gray-100 rounded-lg">Cancel</button>
              <button onClick={handleDeletePost} className="px-4 py-2 bg-red-600 text-white rounded-lg flex items-center gap-2">
                {isDeletingPost && <Loader2 className="w-4 h-4 animate-spin" />} Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
