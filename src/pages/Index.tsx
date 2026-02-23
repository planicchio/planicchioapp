import { useApp } from '@/contexts/AppContext';
import WelcomeScreen from '@/components/WelcomeScreen';
import CourseSelection from '@/components/CourseSelection';
import LevelQuiz from '@/components/LevelQuiz';
import MainApp from '@/components/MainApp';

const Index = () => {
  const { stage } = useApp();

  switch (stage) {
    case 'welcome': return <WelcomeScreen />;
    case 'course': return <CourseSelection />;
    case 'quiz': return <LevelQuiz />;
    case 'app': return <MainApp />;
    default: return <WelcomeScreen />;
  }
};

export default Index;
