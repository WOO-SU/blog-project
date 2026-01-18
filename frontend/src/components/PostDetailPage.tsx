import { useEffect, useState } from 'react';
import { Heart, MessageCircle, Edit2, Trash2, Loader2 } from 'lucide-react';
import { 
  Post as PostType, 
  likePostApi, 
  unlikePostApi, 
  createCommentApi,
  getCommentsApi,
  getPostDetailApi,
  updateCommentApi, 
  deleteCommentApi,
  deletePostApi 
} from '../api/auth';

interface PostDetailPageProps {
  post: PostType & { isUserPost?: boolean };
  onRefresh: () => void;
  onNavigate: (page: { type: string; postId?: number | string }) => void;
}

export function PostDetailPage({ post, onRefresh, onNavigate }: PostDetailPageProps) {
  const [commentText, setCommentText] = useState('');
  const [editingCommentId, setEditingCommentId] = useState<number | string | null>(null);
  const [editedCommentText, setEditedCommentText] = useState('');
  const [comments, setComments] = useState<any[]>([]);
  
  // Initialize with props, but we will fetch the 'true' status immediately
  const [isLiked, setIsLiked] = useState<boolean>(post.liked_by_me || false);
  const [likeCount, setLikeCount] = useState<number>(post.like_count || 0);
  const [isUserPost, setIsUserPost] = useState<boolean>(post.is_mine || post.isUserPost || false);

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeletingPost, setIsDeletingPost] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // 1. Fetch REAL Detail Data (Because List API might miss liked_by_me)
  useEffect(() => {
    let isMounted = true;
    
    getPostDetailApi(post.id)
      .then((data: any) => {
         if (isMounted) {
            // Update local state with the AUTHORITATIVE data from detail API
            setIsLiked(data.liked_by_me);
            setLikeCount(data.like_count);
            setIsUserPost(data.is_mine);
         }
      })
      .catch((error) => {
        console.error("Failed to fetch post detail:", error);
      });
      
    return () => { isMounted = false; };
  }, [post.id]);

  // 2. Load Comments
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

  // 3. Like Toggle Logic
  const handleToggleLike = async () => {
    // Optimistic Update
    const prevLiked = isLiked;
    const prevCount = likeCount;

    setIsLiked(!prevLiked);
    setLikeCount(prevLiked ? prevCount - 1 : prevCount + 1);

    try {
      let response;
      if (prevLiked) {
         // Was liked -> Delete like
         response = await unlikePostApi(post.id);
      } else {
         // Was not liked -> Create like
         response = await likePostApi(post.id);
      }
      
      // Update with confirmed data from server
      if (response) {
          setIsLiked(response.liked_by_me);
          setLikeCount(response.like_count);
      }
      
      // Notify parent to update list (but we ignore parent's props for likes now)
      onRefresh(); 
    } catch (error: any) {
      console.error(error);
      // Revert on error
      setIsLiked(prevLiked);
      setLikeCount(prevCount);
    }
  };

  const handleAddComment = async () => {
    if (!commentText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await createCommentApi({ post: Number(post.id), content: commentText });
      setCommentText('');
      await loadComments();
    } catch (error: any) {
      alert(error.message || "댓글 작성 실패");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditComment = async (commentId: number | string) => {
    if (!editedCommentText.trim() || isSubmitting) return;
    setIsSubmitting(true);
    try {
      await updateCommentApi(commentId, editedCommentText);
      setEditingCommentId(null);
      await loadComments();
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId: number | string) => {
    if (!window.confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      await deleteCommentApi(commentId);
      await loadComments();
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12 relative">
      <div className="flex items-start justify-between mb-8">
        <h1 className="text-4xl font-bold text-gray-900 leading-tight">
          {post.title}
        </h1>

        {(isUserPost) && (
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

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-200 flex items-center gap-4">
           <button
            onClick={handleToggleLike}
            className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all ${
              isLiked 
                ? 'bg-red-100 text-red-600 ring-1 ring-red-200' 
                : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Heart className={`w-5 h-5 ${isLiked ? 'fill-current' : ''}`} />
            <span className="font-medium">{likeCount}</span>
          </button>
          <div className="flex items-center gap-2 text-gray-600 px-4 py-2">
            <MessageCircle className="w-5 h-5" />
            <span className="font-medium">{comments.length} Comments</span>
          </div>
        </div>
      </div>

      <div className="mt-10">
        <h3 className="text-xl font-bold text-gray-900 mb-6">Comments</h3>
        
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