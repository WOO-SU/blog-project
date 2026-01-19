import { useState, useEffect, useCallback } from 'react';
import {
  Routes,
  Route,
  Navigate,
  Outlet,
  useNavigate,
  useParams,
} from 'react-router-dom';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { MainPage } from './components/MainPage';
import { PostDetailPage } from './components/PostDetailPage';
import { NewPostPage } from './components/NewPostPage';
import { SettingsPage } from './components/SettingsPage';
import {
  getPostsApi,
  logoutApi,
  getPostDetailApi,
  Post as PostType,
} from './api/auth';

function normalizePost(post: any): PostType {
  return {
    ...post,
    preview:
      post.preview ||
      (post.content && post.content.length > 100
        ? post.content.substring(0, 100) + '...'
        : post.content),
    likes: post.likes ?? post.like_count ?? 0,
    likedByUser: post.likedByUser ?? post.liked_by_me ?? false,
    isUserPost: post.isUserPost ?? post.is_mine ?? false,
  } as PostType;
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAuthChecked, setIsAuthChecked] = useState(false);
  const [posts, setPosts] = useState<PostType[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('/api/user/me/', { method: 'GET', credentials: 'include' })
      .then(async (res) => {
        const data = await res.json();
        if (res.ok && data.authenticated) {
          setIsLoggedIn(true);
        } else {
          setIsLoggedIn(false);
        }
        setIsAuthChecked(true);
      })
      .catch(() => {
        setIsLoggedIn(false);
        setIsAuthChecked(true);
      });
  }, []);

  const fetchPosts = useCallback(async () => {
    if (!isLoggedIn) return;
    try {
      const data = await getPostsApi();
      const processedPosts = data.map((post: any) => normalizePost(post));
      setPosts(processedPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    }
  }, [isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn) fetchPosts();
  }, [isLoggedIn, fetchPosts]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    navigate('/');
  };

  const handleLogout = async () => {
    try {
      await logoutApi();
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoggedIn(false);
      setPosts([]);
      navigate('/login');
    }
  };

  const RequireAuth = () => {
    if (!isAuthChecked) {
      return <div className="text-center py-20 text-gray-500">Loading...</div>;
    }
    return isLoggedIn ? <Outlet /> : <Navigate to="/login" replace />;
  };

  const AuthedLayout = () => (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} />
      <main>
        <Outlet />
      </main>
    </div>
  );

  const PostDetailRoute = () => {
    const { postId } = useParams();
    const [post, setPost] = useState<PostType | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (!postId) return;
      setError(null);
      getPostDetailApi(postId)
        .then((data) => setPost(normalizePost(data)))
        .catch((err) => {
          console.error(err);
          setError('Post not found');
        });
    }, [postId]);

    if (!postId) {
      return <div className="text-center py-20 text-gray-500">Invalid post</div>;
    }
    if (error) {
      return <div className="text-center py-20 text-gray-500">{error}</div>;
    }
    if (!post) {
      return <div className="text-center py-20 text-gray-500">Loading...</div>;
    }

    return <PostDetailPage post={post} onRefresh={fetchPosts} />;
  };

  const NewPostRoute = () => (
    <NewPostPage
      onSuccess={(newId) => {
        fetchPosts();
        navigate(newId ? `/posts/${newId}` : '/');
      }}
      onCancel={() => navigate('/')}
    />
  );

  const EditPostRoute = () => {
    const { postId } = useParams();
    const [post, setPost] = useState<PostType | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
      if (!postId) return;
      setError(null);
      getPostDetailApi(postId)
        .then((data) => setPost(normalizePost(data)))
        .catch((err) => {
          console.error(err);
          setError('Post not found');
        });
    }, [postId]);

    if (!postId) {
      return <div className="text-center py-20 text-gray-500">Invalid post</div>;
    }
    if (error) {
      return <div className="text-center py-20 text-gray-500">{error}</div>;
    }
    if (!post) {
      return <div className="text-center py-20 text-gray-500">Loading...</div>;
    }

    return (
      <NewPostPage
        editPost={post}
        onSuccess={(newId) => {
          fetchPosts();
          navigate(newId ? `/posts/${newId}` : `/posts/${post.id}`);
        }}
        onCancel={() => navigate(`/posts/${post.id}`)}
      />
    );
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          isLoggedIn ? (
            <Navigate to="/" replace />
          ) : (
            <LoginPage onLogin={handleLogin} />
          )
        }
      />
      <Route element={<RequireAuth />}>
        <Route element={<AuthedLayout />}>
          <Route path="/" element={<MainPage posts={posts} />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/posts/new" element={<NewPostRoute />} />
          <Route path="/posts/:postId" element={<PostDetailRoute />} />
          <Route path="/posts/:postId/edit" element={<EditPostRoute />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
