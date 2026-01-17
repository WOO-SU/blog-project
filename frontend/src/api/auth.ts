// src/api/auth.ts
export type ApiResponse = { detail?: string };

async function safeJson(res: Response) {
  try {
    return await res.json();
  } catch {
    return {};
  }
}

/** ✅ csrftoken 쿠키 읽기 (Django CSRF용) */
function getCookie(name: string) {
    const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
    return match ? decodeURIComponent(match[2]) : null;
  }
  

/**
 * 로그인: POST /api/user/login
 * body: { username, password }
 * ✅ 세션/쿠키 방식이면 credentials: "include" 필수
 */
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

  if (!res.ok) {
    throw new Error(data.detail || "로그인 실패");
  }

  return data;
}

/**
 * 로그아웃: POST /api/user/logout
 */
export async function logoutApi() {
  const res = await fetch(`/api/user/logout/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data: ApiResponse = await safeJson(res);

  if (!res.ok) {
    throw new Error(data.detail || "로그아웃 실패");
  }

  return data;
}


/** --------------------------
 * Posts
 * -------------------------- */

export type Post = {
    id: string | number;
    title: string;
    content: string;
    preview?: string;      // 추가: 목록에서 보여줄 요약문
    author: string;        // 작성자 이름
    created_at: string;    // 생성일
    likes: number;         // 좋아요 수
    likedByUser: boolean;  // 현재 유저가 좋아요를 눌렀는지 여부
    isUserPost?: boolean;  // 추가: 내가 쓴 글인지 여부
    comments: any[];       // 댓글 목록
  };
  
export type PostsListResponse = Post[]; // 목록 GET이 배열로 온다고 가정

export type CreatePostBody = {
    title?: string;
    content: string;
};

export type UpdatePostBody = {
    title?: string;
    content?: string;
};

/**
 * 글 조회(목록): GET /api/posts/
 * 세분화 필요!!
 */
export async function getPostsApi() {
    const res = await fetch(`/api/posts/`, {
        method: "GET",
        credentials: "include",
        headers: {
            "X-CSRFToken": getCookie("csrftoken") || "",
          },
    });

    const data = (await safeJson(res)) as PostsListResponse & ApiResponse;

    if (!res.ok) {
        throw new Error((data as ApiResponse).detail || "글 조회 실패");
    }

    return data.results;
}

/**
 * 내 글 목록: GET /api/posts/me/
 */
export async function getMyPostsApi() {
    const res = await fetch(`/api/posts/me/`, {
        method: "GET",
        credentials: "include",
        headers: {
            "X-CSRFToken": getCookie("csrftoken") || "",
        },
    });

    const data = (await safeJson(res)) as PostsListResponse & ApiResponse;

    if (!res.ok) {
        throw new Error((data as ApiResponse).detail || "내 글 조회 실패");
    }

    return data;
}

/**
 * 글 업로드(작성): POST /api/posts/
 * body: { ... }
 */
export async function createPostApi(body: CreatePostBody) {
    const res = await fetch(`/api/posts/`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken") || ""
         },
        credentials: "include",
        body: JSON.stringify(body),
    });

    const data = (await safeJson(res)) as Post & ApiResponse;

    if (!res.ok) {
        throw new Error((data as ApiResponse).detail || "글 업로드 실패");
    }

    return data as Post;
}

/**
 * 글 수정: PATCH /api/posts/{id}
 * body: 부분 업데이트(예: { title?, content? })
 */
export async function updatePostApi(id: number | string, body: UpdatePostBody) {
    const res = await fetch(`/api/posts/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken") || ""
         },
        credentials: "include",
        body: JSON.stringify(body),
    });

    const data = (await safeJson(res)) as Post & ApiResponse;

    if (!res.ok) {
        throw new Error((data as ApiResponse).detail || "글 수정 실패");
    }

    return data as Post;
}

/**
 * 글 삭제: DELETE /api/posts/{id}
 * (성공 시 204 No Content일 수 있어서 safeJson이 {} 반환해도 정상)
 */
export async function deletePostApi(id: number | string) {
    const res = await fetch(`/api/posts/${id}`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "X-CSRFToken": getCookie("csrftoken") || ""
         },
    });

    const data: ApiResponse = await safeJson(res);

    if (!res.ok) {
        throw new Error(data.detail || "글 삭제 실패");
    }

    return data; // 보통 {} 또는 {detail} (백엔드 구현에 따라)
}

// 260114 14:57

/** --------------------------
 * Comments & Likes
 * -------------------------- */

export type Comment = {
    id: number;
    post: number;
    content: string;
    author: string | number;
    created_at?: string;
};

export type CreateCommentBody = {
    post: number;
    content: string;
};

/**
 * 댓글 조회: GET /api/posts/{postId}/comments/
 */
export async function getCommentsApi(postId: number | string) {
    const res = await fetch(`/api/posts/${postId}/comments/`, {
        method: "GET",
        credentials: "include",
        headers: {
            "X-CSRFToken": getCookie("csrftoken") || "",
          },
    });

    const data = (await safeJson(res)) as { results?: Comment[] } & Comment[] & ApiResponse;

    if (!res.ok) {
        throw new Error((data as ApiResponse).detail || "댓글 조회 실패");
    }

    return (data as { results?: Comment[] }).results || (data as Comment[]);
}

/**
 * 댓글 추가: POST /api/posts/{postId}/comments/
 * body: { content }
 */
export async function createCommentApi(body: CreateCommentBody) {
    const res = await fetch(`/api/posts/${body.post}/comments/`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken") || ""
         },
        credentials: "include",
        body: JSON.stringify({ content: body.content }),
    });

    const data = (await safeJson(res)) as Comment & ApiResponse;

    if (!res.ok) {
        throw new Error((data as ApiResponse).detail || "댓글 추가 실패");
    }

    return data as Comment;
}

/**
 * 댓글 수정: PATCH /api/comments/{id}/
 */
export async function updateCommentApi(id: number | string, content: string) {
    const res = await fetch(`/api/interactions/comments/${id}/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken") || ""
         },
        credentials: "include",
        body: JSON.stringify({ content }),
    });

    const data = (await safeJson(res)) as Comment & ApiResponse;

    if (!res.ok) {
        throw new Error((data as ApiResponse).detail || "댓글 수정 실패");
    }

    return data as Comment;
}

/**
 * 댓글 삭제: DELETE /api/comments/{id}/
 */
export async function deleteCommentApi(id: number | string) {
    const res = await fetch(`/api/comments/${id}/`, {
        method: "DELETE",
        credentials: "include",
        headers: {
            "X-CSRFToken": getCookie("csrftoken") || ""
         },
    });

    const data: ApiResponse = await safeJson(res);

    if (!res.ok) {
        throw new Error(data.detail || "댓글 삭제 실패");
    }

    return data;
}

/**
 * 좋아요 토글: POST /api/likes/toggle/
 * 한 번 누르면 좋아요(생성), 다시 누르면 좋아요 취소(삭제) 처리
 * @param postId 좋아요를 누를 게시글의 ID
 */
export async function toggleLikeApi(postId: number | string) {
    const res = await fetch(`/api/interactions/likes/toggle/`, {
        method: "POST",
        headers: { "Content-Type": "application/json",
            "X-CSRFToken": getCookie("csrftoken") || ""
         },
        credentials: "include",
        // 백엔드에서 어떤 게시글에 좋아요를 하는지 알기 위해 postId를 보냅니다.
        body: JSON.stringify({ post_id : postId }), 
    });

    const data: ApiResponse = await safeJson(res);

    if (!res.ok) {
        // 응답이 성공(200~299)이 아닐 경우 에러를 던집니다.
        throw new Error(data.detail || "좋아요 처리 실패");
    }

    // 성공 시 백엔드에서 보낸 응답(예: { detail: "좋아요 완료" } 등)을 반환합니다.
    return data; 
}
