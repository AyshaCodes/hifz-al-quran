interface DailyProgress {
  date: string;
  pagesMemorized: number;
  pagesReviewed: number;
  completed: boolean;
  quality: 'good' | 'partial' | 'hard';
}

export function getRevisionPages(progress: DailyProgress[], today: string = new Date().toISOString().split('T')[0]): number[] {
  // Get pages from the last 3 days that need revision
  const threeDaysAgo = new Date(today);
  threeDaysAgo.setDate(threeDaysAgo.getDate() - 3);
  
  const recentProgress = progress.filter(p => 
    new Date(p.date) >= threeDaysAgo && 
    p.date !== today && 
    p.pagesMemorized > 0
  );

  // For simplicity, we'll return the count of pages that need revision
  // In a real implementation, you'd track specific page numbers
  const pagesToRevise: number[] = [];
  
  recentProgress.forEach((p, index) => {
    // Add page numbers for revision (simplified logic)
    for (let i = 0; i < p.pagesMemorized; i++) {
      pagesToRevise.push(index + 1); // Placeholder page numbers
    }
  });

  return pagesToRevise;
}

export function getTodayStr(): string {
  return new Date().toISOString().split('T')[0];
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export function calculateStreak(progress: DailyProgress[]): number {
  if (progress.length === 0) return 0;
  
  const sortedProgress = [...progress].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  
  let streak = 0;
  const today = getTodayStr();
  
  for (let i = 0; i < sortedProgress.length; i++) {
    const currentDate = new Date(today);
    currentDate.setDate(currentDate.getDate() - i);
    const currentDateStr = currentDate.toISOString().split('T')[0];
    
    const dayProgress = sortedProgress.find(p => p.date === currentDateStr);
    
    if (dayProgress && dayProgress.completed) {
      streak++;
    } else {
      break;
    }
  }
  
  return streak;
}

export function getTotalPagesMemorized(progress: DailyProgress[]): number {
  return progress.reduce((total, p) => total + p.pagesMemorized, 0);
}

export function getCompletionRate(progress: DailyProgress[]): number {
  if (progress.length === 0) return 0;
  
  const completedDays = progress.filter(p => p.completed).length;
  return Math.round((completedDays / progress.length) * 100);
}
