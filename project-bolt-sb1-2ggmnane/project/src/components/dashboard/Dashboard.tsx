import { useState } from 'react';
import { HifzProfile, HifzProgress } from '../../types/hifz';
import {
  saveProgress,
  markTodayDone,
  markTodayRevised,
  addSessionDuration,
  clearProfile,
} from '../../utils/storage';
import GreetingCard from './GreetingCard';
import StatCards from './StatCards';
import DailyTask from './DailyTask';
import SessionTimer from './SessionTimer';
import WeeklyView from './WeeklyView';
import ReminderCard from './ReminderCard';
import FridayCard from './FridayCard';
import MonthlyChart from './MonthlyChart';

interface Props {
  profile: HifzProfile;
  progress: HifzProgress;
  onProgressChange: (p: HifzProgress) => void;
  onReset: () => void;
}

export default function Dashboard({ profile, progress, onProgressChange, onReset }: Props) {
  const [pageActuelle, setPageActuelle] = useState(profile.pageActuelle);

  const handleMarkDone = () => {
    const updated = markTodayDone(progress, pageActuelle);
    const newProfile: HifzProfile = { ...profile, pageActuelle: pageActuelle + 1 };
    localStorage.setItem('hifz_profile', JSON.stringify(newProfile));
    setPageActuelle(pageActuelle + 1);
    saveProgress(updated);
    onProgressChange(updated);
  };

  const handleMarkRevised = () => {
    const updated = markTodayRevised(progress, pageActuelle);
    saveProgress(updated);
    onProgressChange(updated);
  };

  const handleSessionEnd = (seconds: number) => {
    const updated = addSessionDuration(progress, seconds);
    saveProgress(updated);
    onProgressChange(updated);
  };

  return (
    <div className="min-h-screen bg-[#f8f6e9]">
      <div className="max-w-lg mx-auto px-4 py-6 pb-16">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div
              className="text-xl font-bold text-[#2c6e3c]"
              style={{ fontFamily: "'Amiri', serif" }}
            >
              هِفْظ
            </div>
            <span className="text-xs text-[#9a9688] tracking-widest uppercase font-medium">
              Mon Hifz
            </span>
          </div>
          <button
            onClick={() => {
              if (window.confirm('Réinitialiser votre profil ? Toutes les données seront perdues.')) {
                clearProfile();
                onReset();
              }
            }}
            className="text-xs text-[#b0a898] hover:text-rose-400 transition-colors px-3 py-1.5 rounded-lg hover:bg-rose-50"
          >
            Réinitialiser
          </button>
        </div>

        <div className="space-y-4">
          <GreetingCard profile={profile} pageActuelle={pageActuelle} />

          <StatCards progress={progress} pagesParJour={profile.programme.pagesParJour} />

          <FridayCard />

          <DailyTask
            pageActuelle={pageActuelle}
            progress={progress}
            onMarkDone={handleMarkDone}
            onMarkRevised={handleMarkRevised}
          />

          <SessionTimer onSessionEnd={handleSessionEnd} />

          <WeeklyView progress={progress} />

          <ReminderCard
            progress={progress}
            pageActuelle={pageActuelle}
            onRevise={handleMarkRevised}
          />

          <MonthlyChart progress={progress} />

          <div className="bg-[#2c6e3c]/5 rounded-3xl p-6 text-center border border-[#2c6e3c]/10">
            <p
              className="text-xl text-[#2c6e3c] mb-2"
              style={{ fontFamily: "'Amiri', 'Scheherazade New', serif", direction: 'rtl' }}
            >
              وَلَقَدۡ يَسَّرۡنَا ٱلۡقُرۡءَانَ لِلذِّكۡرِ
            </p>
            <p className="text-xs text-[#7a8c7b] italic">
              "Nous avons facilité le Coran pour la méditation" — Al-Qamar 54:17
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
