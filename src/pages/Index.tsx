import { useApp } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';
import LanguageSelect from '@/components/LanguageSelect';
import WelcomeScreen from '@/components/WelcomeScreen';
import CourseSelection from '@/components/CourseSelection';
import LevelQuiz from '@/components/LevelQuiz';
import MainApp from '@/components/MainApp';

const Index = () => {
  const { stage } = useApp();

  switch (stage) {
    case 'welcome': return <LanguageSelect />;
    case 'course': return <CourseSelection />;
    case 'quiz': return <LevelQuiz />;
    case 'app': return <MainApp />;
    default: return <LanguageSelect />;
  }
};

export default Index;
