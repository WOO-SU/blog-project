import { useState, useEffect, useCallback } from 'react';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { MainPage } from './components/MainPage';
import { PostDetailPage } from './components/PostDetailPage';
import { NewPostPage } from './components/NewPostPage';
import { SettingsPage } from './components/SettingsPage';
import { getPostsApi, logoutApi, Post as PostType } from "./api/auth";

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

  useEffect(() => {
    fetch('/api/user/me/', { method: 'GET', credentials: 'include' })
      .then(async res => {
        const data = await res.json();
        if (res.ok&& data.authenticated) {
          setIsLoggedIn(true);
          setCurrentPage({ type: 'main' });
        } else {
          setIsLoggedIn(false);
          setCurrentPage({ type: 'login' });
        }
      })
      .catch(() => {
        setIsLoggedIn(false);
        setCurrentPage({ type: 'login' });
      });
  }, []);

  const fetchPosts = useCallback(async () => {
    if (!isLoggedIn) return;
    setIsLoading(true);
    try {
      const data = await getPostsApi();
      const processedPosts = data.map((post: any) => ({
        ...post,
        preview: post.preview || (post.content.length > 100 
          ? post.content.substring(0, 100) + '...' 
          : post.content),
        like_count: post.like_count || 0,
        liked_by_me: post.liked_by_me || false, // Note: This might be false from List API
      }));
      setPosts(processedPosts); 
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setIsLoading(false);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) fetchPosts();
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
          <MainPage posts={posts} onNavigate={handleNavigate} />
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
          <SettingsPage posts={posts} onNavigate={handleNavigate} />
        )}
      </main>
    </div>
  );
}