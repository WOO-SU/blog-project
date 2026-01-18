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

// 페이지 타입 정의
type Page = 
  | { type: 'login' }
  | { type: 'main' }
  | { type: 'post-detail'; postId: string | number }
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
          setIsLoggedIn(true);
          setCurrentPage({ type: 'main' });
        }
      })
      .catch(() => {});
  }, []);

  // 1. 게시글 목록 불러오기 (API 연동)
  const fetchPosts = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    try {
      const data = await getPostsApi();
      console.log("posts from api:", data);  

      // 서버 데이터를 프론트엔드 형식에 맞게 가공
      const processedPosts = data.map((post: any) => ({
        ...post,
        // 1. preview
        preview: post.preview || (post.content.length > 100 
          ? post.content.substring(0, 100) + '...' 
          : post.content),
        
        // 2. Ensure types match (Mapping snake_case from DB to frontend expected)
        // If backend sends 'like_count', we keep it. 
        // If backend sends 'liked_by_me', we keep it.
        like_count: post.like_count || 0,
        liked_by_me: post.liked_by_me || false,
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

  const handleNavigate = (page: any) => {
    if (page.type === 'my-post-view') {
      setCurrentPage({ type: 'post-detail', postId: page.postId });
      return;
    }
    if (page.type === 'new-post') {
      setCurrentPage({ type: 'new-post', editPostId: page.postId || page.editPostId });
      return;
    }
    setCurrentPage(page);
  };

  const getCurrentPost = () => {
    if (currentPage.type === 'post-detail' && currentPage.postId) {
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
        
        {currentPage.type === 'post-detail' && (() => {
          const post = getCurrentPost();
          return post ? (
            <PostDetailPage 
              post={post}
              onRefresh={fetchPosts} 
              onNavigate={handleNavigate} 
            />
          ) : (
            <div className="text-center py-20 text-gray-500">Post not found</div>
          );
        })()}
        
        {currentPage.type === 'new-post' && (
          <NewPostPage 
            editPost={getCurrentPost()}
            onSuccess={(newId) => {
              fetchPosts(); 
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
            posts={posts} 
            onNavigate={handleNavigate} 
          />
        )}
      </main>
    </div>
  );
}