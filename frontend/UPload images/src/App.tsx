import { useState } from 'react';
import LoginScreen from './imports/로그인화면';
import FeedScreen from './imports/피드화면메인Clone';
import WriteScreen from './imports/글쓰기화면';
import DetailScreen from './imports/상세조회화면';
import MyPostsScreen from './imports/자기글조회화면';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<'login' | 'feed' | 'write' | 'detail' | 'myposts'>('login');

  return (
    <div className="w-[1440px] h-[1024px] mx-auto">
      {currentScreen === 'login' && <LoginScreen />}
      {currentScreen === 'feed' && <FeedScreen />}
      {currentScreen === 'write' && <WriteScreen />}
      {currentScreen === 'detail' && <DetailScreen />}
      {currentScreen === 'myposts' && <MyPostsScreen />}
    </div>
  );
}
