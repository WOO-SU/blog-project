import { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LoginPage } from './components/LoginPage';
import { MainPage } from './components/MainPage';
import { PostDetailPage } from './components/PostDetailPage';
import { NewPostPage } from './components/NewPostPage';
import { MyPostViewPage } from './components/MyPostViewPage';
import { SettingsPage } from './components/SettingsPage';

export interface Post {
  id: string;
  title: string;
  content: string;
  preview: string;
  isUserPost: boolean;
}

type Page = 
  | { type: 'login' }
  | { type: 'main' }
  | { type: 'post-detail'; postId: string }
  | { type: 'new-post'; editPostId?: string }
  | { type: 'my-post-view'; postId: string }
  | { type: 'settings' };

const DEFAULT_POSTS: Post[] = [
  {
    id: '1',
    title: 'Welcome to Tlog',
    content: 'This is the first post on our team blog. Tlog is a simple and clean blogging platform where teams can share their thoughts and ideas. We believe in keeping things minimal and focused on what matters most - your content.',
    preview: 'This is the first post on our team blog. Tlog is a simple and clean blogging platform...',
    isUserPost: false,
  },
  {
    id: '2',
    title: 'Getting Started with Team Blogging',
    content: 'Team blogging is a great way to collaborate and share knowledge. With Tlog, you can easily create new posts, view all team posts, and manage your content. The interface is designed to be intuitive and distraction-free.',
    preview: 'Team blogging is a great way to collaborate and share knowledge. With Tlog, you can easily...',
    isUserPost: false,
  },
  {
    id: '3',
    title: 'Tips for Writing Great Content',
    content: 'When writing blog posts, keep your audience in mind. Start with a clear title, structure your content with headings and paragraphs, and always proofread before publishing. Great content is clear, concise, and valuable to your readers.',
    preview: 'When writing blog posts, keep your audience in mind. Start with a clear title, structure...',
    isUserPost: false,
  },
];

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentPage, setCurrentPage] = useState<Page>({ type: 'login' });
  
  // Initialize posts from localStorage or use default posts
  const [posts, setPosts] = useState<Post[]>(() => {
    const savedPosts = localStorage.getItem('tlog-posts');
    return savedPosts ? JSON.parse(savedPosts) : DEFAULT_POSTS;
  });

  // Save posts to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('tlog-posts', JSON.stringify(posts));
  }, [posts]);

  const handleLogin = () => {
    setIsLoggedIn(true);
    setCurrentPage({ type: 'main' });
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentPage({ type: 'login' });
  };

  const handleNavigate = (page: Page) => {
    setCurrentPage(page);
  };

  const handleSavePost = (title: string, content: string, editPostId?: string) => {
    const preview = content.substring(0, 100) + (content.length > 100 ? '...' : '');
    
    if (editPostId) {
      // Edit existing post
      setPosts(posts.map(post => 
        post.id === editPostId 
          ? { ...post, title, content, preview }
          : post
      ));
      setCurrentPage({ type: 'my-post-view', postId: editPostId });
    } else {
      // Create new post - add to the beginning so it appears in the feed
      const newPost: Post = {
        id: Date.now().toString(),
        title,
        content,
        preview,
        isUserPost: true,
      };
      setPosts([newPost, ...posts]);
      setCurrentPage({ type: 'my-post-view', postId: newPost.id });
    }
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
        
        {currentPage.type === 'post-detail' && (
          <PostDetailPage 
            post={posts.find(p => p.id === currentPage.postId)!} 
          />
        )}
        
        {currentPage.type === 'new-post' && (
          <NewPostPage 
            onSave={handleSavePost}
            editPost={currentPage.editPostId ? posts.find(p => p.id === currentPage.editPostId) : undefined}
          />
        )}
        
        {currentPage.type === 'my-post-view' && (
          <MyPostViewPage 
            post={posts.find(p => p.id === currentPage.postId)!}
            onEdit={(postId) => handleNavigate({ type: 'new-post', editPostId: postId })}
          />
        )}
        
        {currentPage.type === 'settings' && (
          <SettingsPage posts={posts} onNavigate={handleNavigate} />
        )}
      </main>
    </div>
  );
}