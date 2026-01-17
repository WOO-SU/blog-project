import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { MainPage } from './components/MainPage';
import { PostDetailPage } from './components/PostDetailPage';
import { NewPostPage } from './components/NewPostPage';
// MyPostViewPage import 제거
import { SettingsPage } from './components/SettingsPage';

// API 함수 및 타입 임포트
import { getPostsApi, logoutApi, Post as PostType } from "./api/auth";

// 페이지 타입 정의 ('my-post-view' 제거 -> 'post-detail'로 통합)
type Page = 
  | { type: 'login' }
  | { type: 'main' }
  | { type: 'post-detail'; postId: string | number } // ID 타입을 유연하게 (string | number)
  | { type: 'new-post'; editPostId?: string | number }
  | { type: 'settings' };

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>({ type: 'login' });
  const [posts, setPosts] = useState<PostType[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // 0. 앱 시작 시: CSRF 토큰 발급 + 로그인 상태 확인
  useEffect(() => {
    fetch('/api/user/me/', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => {
        if (res.ok) {
          // 선택 사항: 로그인 상태면 true로
          setIsLoggedIn(true);
          setCurrentPage({ type: 'main' });
        }
      })
      .catch(() => {
        // 로그인 안 된 상태 → 그냥 무시
      });
  }, []);

  // 1. 게시글 목록 불러오기 (API 연동)
  const fetchPosts = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    try {
      const data = await getPostsApi();
      console.log("posts from api:", data);  

      // 서버 데이터를 프론트엔드 형식에 맞게 가공
      const processedPosts = data.map((post: PostType) => ({
        ...post,
        // 1. preview가 없으면 content에서 100자만 추출
        preview: post.preview || (post.content.length > 100 
          ? post.content.substring(0, 100) + '...' 
          : post.content),
        // 2. 만약 서버에서 isUserPost를 안준다면 여기서 로직 추가 가능
        // isUserPost: post.author === currentUser.username 
      }));
  
      setPosts(processedPosts); 
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  // 로그인 상태가 되면 데이터 로드
  useEffect(() => {
    if (isLoggedIn) {
      fetchPosts();
    }
  }, [isLoggedIn, fetchPosts]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage({ type: 'main' });
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggedIn(false);
      setPosts([]);
      setCurrentPage({ type: "login" });
    }
  };

  // 2. 네비게이션 핸들러 (통합 및 호환성 처리)
  const handleNavigate = (page: any) => {
    // 기존 'my-post-view' 요청이 오면 'post-detail'로 자동 변환
    if (page.type === 'my-post-view') {
      setCurrentPage({ type: 'post-detail', postId: page.postId });
      return;
    }
    
    // 'new-post' 처리
    if (page.type === 'new-post') {
      setCurrentPage({ type: 'new-post', editPostId: page.postId || page.editPostId });
      return;
    }

    // 그 외 (main, settings, post-detail 등)
    setCurrentPage(page);
  };

  // 3. 헬퍼 함수: 현재 보여줄 포스트 찾기
  const getCurrentPost = () => {
    if (currentPage.type === 'post-detail' && currentPage.postId) {
      // String()으로 양쪽을 감싸서 "1" === "1" 형태가 되도록 보장
      return posts.find(p => String(p.id) === String(currentPage.postId));
    }
    if (currentPage.type === 'new-post' && currentPage.editPostId) {
      return posts.find(p => String(p.id) === String(currentPage.editPostId));
    }
    return undefined;
  };

  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onNavigate={handleNavigate} onLogout={handleLogout} />
      
      <main>
        {currentPage.type === 'main' && (
          <MainPage 
            posts={posts} 
            onNavigate={handleNavigate} 
          />
        )}
        
        {/* ✅ 'my-post-view' 대신 'post-detail'이 모든 상세 보기를 담당 */}
        {currentPage.type === 'post-detail' && (() => {
          const post = getCurrentPost();
          return post ? (
            <PostDetailPage 
              post={post}
              onRefresh={fetchPosts} // 데이터 변경(댓글, 좋아요, 삭제 등) 시 목록 갱신
              onNavigate={handleNavigate} // 삭제/수정 후 페이지 이동용
            />
          ) : (
            <div className="text-center py-20 text-gray-500">Post not found</div>
          );
        })()}
        
        {currentPage.type === 'new-post' && (
          <NewPostPage 
            editPost={getCurrentPost()}
            onSuccess={(newId) => {
              fetchPosts(); // 목록 갱신
              // 글 작성/수정 완료 후 해당 글 상세 페이지로 이동
              if (newId) {
                setCurrentPage({ type: 'post-detail', postId: newId });
              } else {
                setCurrentPage({ type: 'main' });
              }
            }}
            onCancel={() => setCurrentPage({ type: 'main' })}
          />
        )}
        
        {currentPage.type === 'settings' && (
          <SettingsPage 
            onNavigate={handleNavigate} 
          />
        )}
      </main>
    </div>
  );
}
