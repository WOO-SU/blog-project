// src/api/auth.ts
export type ApiResponse = { detail?: string };

async function safeJson(res: Response) {
  try {
    if (res.status === 204) return {}; 
    return await res.json();
  } catch {
    return {};
  }
}

function getCookie(name: string) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
}

export async function loginApi(username: string, password: string) {
  const res = await fetch(`/api/user/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json",
        "X-CSRFToken": getCookie("csrftoken") || "",
     },
    credentials: "include",
    body: JSON.stringify({ username, password }),
  });
  const data: ApiResponse = await safeJson(res);
  if (!res.ok) throw new Error(data.detail || "로그인 실패");
  return data;
}

export async function logoutApi() {
  const res = await fetch(`/api/user/logout/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data: ApiResponse = await safeJson(res);
  if (!res.ok) throw new Error(data.detail || "로그아웃 실패");
  return data;
}

export type Post = {
    id: number;
    title: string;
    content: string;
    preview?: string;      
    author: string;        
    created_at: string;    
    
    // ✅ Backend Fields (snake_case)
    like_count: number;    
    liked_by_me: boolean;  
    is_mine?: boolean;     
    comments: any[];       
};
  
export type PostsListResponse = Post[]; 

export type CreatePostBody = { title?: string; content: string; };
export type UpdatePostBody = { title?: string; content?: string; };

export async function getPostsApi() {
    const res = await fetch(`/api/posts/`, {
        method: "GET",
        credentials: "include",
        headers: { "X-CSRFToken": getCookie("csrftoken") || "" },
    });
    const data = (await safeJson(res)) as any;
    if (!res.ok) throw new Error((data as ApiResponse).detail || "글 조회 실패");
    return Array.isArray(data) ? data : data.results;
}

export async function getPostDetailApi(id: number | string) {
    const res = await fetch(`/api/posts/${id}/`, {
        method: "GET",
        credentials: "include",
        headers: { "X-CSRFToken": getCookie("csrftoken") || "" },
    });
    const data = (await safeJson(res)) as Post & ApiResponse;
    if (!res.ok) throw new Error((data as ApiResponse).detail || "글 상세 조회 실패");
    return data as Post;
}

export async function getMyPostsApi() {
    const res = await fetch(`/api/posts/me/`, {
        method: "GET",
        credentials: "include",
        headers: { "X-CSRFToken": getCookie("csrftoken") || "" },
    });
    const data = (await safeJson(res)) as PostsListResponse & ApiResponse;
    if (!res.ok) throw new Error((data as ApiResponse).detail || "내 글 조회 실패");
    return data;
}

export async function createPostApi(body: CreatePostBody) {
    const res = await fetch(`/api/posts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") || "" },
        credentials: "include",
        body: JSON.stringify(body),
    });
    const data = (await safeJson(res)) as Post & ApiResponse;
    if (!res.ok) throw new Error((data as ApiResponse).detail || "글 업로드 실패");
    return data as Post;
}

export async function updatePostApi(id: number | string, body: UpdatePostBody) {
    const res = await fetch(`/api/posts/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") || "" },
        credentials: "include",
        body: JSON.stringify(body),
    });
    const data = (await safeJson(res)) as Post & ApiResponse;
    if (!res.ok) throw new Error((data as ApiResponse).detail || "글 수정 실패");
    return data as Post;
}

export async function deletePostApi(id: number | string) {
    const res = await fetch(`/api/posts/${id}/`, {
        method: "DELETE",
        credentials: "include",
        headers: { "X-CSRFToken": getCookie("csrftoken") || "" },
    });
    const data: ApiResponse = await safeJson(res);
    if (!res.ok) throw new Error(data.detail || "글 삭제 실패");
    return data; 
}

export type Comment = {
    id: number;
    post: number;
    content: string;
    author: string | number;
    created_at?: string;
};

export type CreateCommentBody = { post: number; content: string; };

export async function getCommentsApi(postId: number | string) {
    const res = await fetch(`/api/posts/${postId}/comments/`, {
        method: "GET",
        credentials: "include",
        headers: { "X-CSRFToken": getCookie("csrftoken") || "" },
    });
    const data = (await safeJson(res)) as any;
    if (!res.ok) throw new Error((data as ApiResponse).detail || "댓글 조회 실패");
    return (data.results || data) as Comment[];
}

export async function createCommentApi(body: CreateCommentBody) {
    const res = await fetch(`/api/posts/${body.post}/comments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") || "" },
        credentials: "include",
        body: JSON.stringify({ content: body.content }),
    });
    const data = (await safeJson(res)) as Comment & ApiResponse;
    if (!res.ok) throw new Error((data as ApiResponse).detail || "댓글 추가 실패");
    return data as Comment;
}

export async function updateCommentApi(id: number | string, content: string) {
    const res = await fetch(`/api/interactions/comments/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") || "" },
        credentials: "include",
        body: JSON.stringify({ content }),
    });
    const data = (await safeJson(res)) as Comment & ApiResponse;
    if (!res.ok) throw new Error((data as ApiResponse).detail || "댓글 수정 실패");
    return data as Comment;
}

export async function deleteCommentApi(id: number | string) {
    const res = await fetch(`/api/interactions/comments/${id}/`, {
        method: "DELETE",
        credentials: "include",
        headers: { "X-CSRFToken": getCookie("csrftoken") || "" },
    });
    const data: ApiResponse = await safeJson(res);
    if (!res.ok) throw new Error(data.detail || "댓글 삭제 실패");
    return data;
}

/** ✅ 좋아요 생성: POST /api/posts/{id}/likes/ */
export async function likePostApi(postId: number | string) {
    const res = await fetch(`/api/posts/${postId}/likes/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") || "" },
        credentials: "include",
    });
    const data: ApiResponse = await safeJson(res);
    if (!res.ok) throw new Error(data.detail || "좋아요 실패");
    return data; 
}

/** ✅ 좋아요 취소: DELETE /api/posts/{id}/likes/ */
export async function unlikePostApi(postId: number | string) {
    const res = await fetch(`/api/posts/${postId}/likes/`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCookie("csrftoken") || "" },
        credentials: "include",
    });
    const data: ApiResponse = await safeJson(res);
    if (!res.ok) throw new Error(data.detail || "좋아요 취소 실패");
    return data; 
}