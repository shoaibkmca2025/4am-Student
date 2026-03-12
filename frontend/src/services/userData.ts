
export interface Assessment {
  id?: string;
  title?: string;
  score?: string | number;
  status?: string;
  date?: string;
  [key: string]: any;
}

export const getUserAssessmentsMap = (): Record<string, Assessment> => {
  try {
    const stored = localStorage.getItem('user_assessments');
    if (!stored) return {};
    
    const parsed = JSON.parse(stored);
    if (!parsed || typeof parsed !== 'object') return {};
    
    if (Array.isArray(parsed)) {
      // Convert array to map keyed by id
      return parsed.reduce((acc, curr) => {
        if (curr && curr.id) {
          acc[curr.id] = curr;
        }
        return acc;
      }, {} as Record<string, Assessment>);
    }

    return parsed;
  } catch (error) {
    console.error("Failed to parse user assessments:", error);
    return {};
  }
};

export const getSafeUserAssessments = (): Assessment[] => {
  const map = getUserAssessmentsMap();
  // Convert map to array, injecting ID from key if missing
  return Object.entries(map).map(([key, value]) => ({
    ...value,
    id: value.id || key
  }));
};

export const getCompletedAssessments = (): Assessment[] => {
  const assessments = getSafeUserAssessments();
  return assessments.filter(a => a && a.status === 'Completed');
};

export const calculateUserLevel = () => {
  const completed = getCompletedAssessments();
  // Simple XP Formula: 100 XP per test
  const totalXp = completed.length * 100;
  
  const level = Math.floor(totalXp / 1000) + 1;
  const xp = totalXp % 1000;
  const maxXp = 1000;
  
  return { level, xp, maxXp, totalXp };
};

export const saveUserAssessment = (id: string | number, data: Assessment) => {
  try {
    const map = getUserAssessmentsMap();
    map[id] = { ...map[id], ...data };
    localStorage.setItem('user_assessments', JSON.stringify(map));
    return true;
  } catch (error) {
    console.error("Failed to save user assessment:", error);
    return false;
  }
};
