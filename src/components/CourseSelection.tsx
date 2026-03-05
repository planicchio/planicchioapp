import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useApp, COURSES } from '@/contexts/AppContext';
import { useTranslation } from '@/i18n/translations';

const CourseSelection = () => {
  const { setCourse, setStage, nativeLang } = useApp();
  const tr = useTranslation(nativeLang);

  const handleSelect = (id: string) => {
    setCourse(id);
    setStage('quiz');
  };

  // Filter out the user's native language from course options
  const availableCourses = COURSES.filter(c => c.id !== nativeLang);

  return (
    <div className="min-h-screen bg-background p-6 flex flex-col">
      <button
        onClick={() => setStage('welcome')}
        className="self-start flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
      >
        <ArrowLeft size={20} />
        <span className="font-bold text-sm">{tr('back')}</span>
      </button>

      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
        <span className="text-5xl mb-3 block">🌍</span>
        <h1 className="text-3xl font-black text-foreground">{tr('choose_course')}</h1>
        <p className="text-muted-foreground mt-1">{tr('choose_course_desc')}</p>
      </motion.div>

      <div className="grid grid-cols-2 gap-4 max-w-md mx-auto w-full flex-1">
        {availableCourses.map((course, i) => (
          <motion.button
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => handleSelect(course.id)}
            className="bg-card rounded-2xl p-5 shadow-md hover:shadow-lg transition-all flex flex-col items-center gap-2 border border-border"
          >
            <span className="text-4xl">{course.flag}</span>
            <span className="text-2xl">{course.emoji}</span>
            <span className="font-bold text-foreground text-lg">{course.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default CourseSelection;
