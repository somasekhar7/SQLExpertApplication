// import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// interface ProblemProgress {
//   problemId: string;
//   solved: boolean;
//   attempts: number;
//   lastAttempt?: string;
//   savedCode?: string;
//   submittedCode?: string;
//   pointsEarned?: number;
// }

// interface Achievement {
//   id: string;
//   name: string;
//   description: string;
//   locked: boolean;
//   unlockedAt?: string;
// }

// interface ProgressState {
//   solvedProblems: { [key: string]: ProblemProgress };
//   totalSolved: number;
//   easyCount: number;
//   mediumCount: number;
//   hardCount: number;
//   currentStreak: number;
//   longestStreak: number;
//   lastActivityDate: string | null;
//   totalPoints: number;
//   achievements: Achievement[];
// }

// const POINTS_BY_DIFFICULTY = {
//   Easy: 10,
//   Medium: 20,
//   Hard: 30,
// };

// const initialState: ProgressState = {
//   solvedProblems: {
//     // Dummy data for demonstration
//     'crud-select-1': { problemId: 'crud-select-1', solved: true, attempts: 2, pointsEarned: 10 },
//     'basic-where-1': { problemId: 'basic-where-1', solved: true, attempts: 1, pointsEarned: 10 },
//     'joins-inner-1': { problemId: 'joins-inner-1', solved: true, attempts: 3, pointsEarned: 20 },
//   },
//   totalSolved: 3,
//   easyCount: 2,
//   mediumCount: 1,
//   hardCount: 0,
//   currentStreak: 5,
//   longestStreak: 7,
//   lastActivityDate: new Date().toISOString(),
//   totalPoints: 240,
//   achievements: [
//     { id: 'first-query', name: 'First Query', description: 'Solved your first SQL problem', locked: false, unlockedAt: new Date().toISOString() },
//     { id: 'speed-demon', name: 'Speed Demon', description: 'Solved a problem in under 5 minutes', locked: false, unlockedAt: new Date().toISOString() },
//     { id: '10-day-streak', name: '10 Day Streak', description: 'Maintain a 10 day streak', locked: true },
//     { id: 'sql-master', name: 'SQLExpert', description: 'Solve 50 problems', locked: true },
//   ],
// };

// const progressSlice = createSlice({
//   name: 'progress',
//   initialState,
//   reducers: {
//     markProblemSolved: (state, action: PayloadAction<{ problemId: string; difficulty: 'Easy' | 'Medium' | 'Hard'; submittedCode: string }>) => {
//       const { problemId, difficulty, submittedCode } = action.payload;
//       const points = POINTS_BY_DIFFICULTY[difficulty];
//       const today = new Date().toISOString().split('T')[0];

//       if (!state.solvedProblems[problemId]?.solved) {
//         // New solved problem
//         state.solvedProblems[problemId] = {
//           problemId,
//           solved: true,
//           attempts: state.solvedProblems[problemId]?.attempts || 1,
//           lastAttempt: new Date().toISOString(),
//           submittedCode,
//           pointsEarned: points
//         };

//         state.totalSolved++;
//         state.totalPoints += points;

//         if (difficulty === 'Easy') state.easyCount++;
//         else if (difficulty === 'Medium') state.mediumCount++;
//         else if (difficulty === 'Hard') state.hardCount++;

//         // Update streak
//         const lastActivityDay = state.lastActivityDate ? state.lastActivityDate.split('T')[0] : null;
//         if (lastActivityDay === today) {
//           // Same day, no streak change
//         } else if (lastActivityDay) {
//           const lastDate = new Date(lastActivityDay);
//           const currentDate = new Date(today);
//           const diffDays = Math.floor((currentDate.getTime() - lastDate.getTime()) / (1000 * 60 * 60 * 24));

//           if (diffDays === 1) {
//             // Consecutive day
//             state.currentStreak++;
//             if (state.currentStreak > state.longestStreak) {
//               state.longestStreak = state.currentStreak;
//             }
//           } else if (diffDays > 1) {
//             // Streak broken
//             state.currentStreak = 1;
//           }
//         } else {
//           // First activity
//           state.currentStreak = 1;
//           state.longestStreak = 1;
//         }
//         state.lastActivityDate = new Date().toISOString();

//         // Check and unlock achievements
//         if (state.totalSolved === 1) {
//           const achievement = state.achievements.find(a => a.id === 'first-query');
//           if (achievement && achievement.locked) {
//             achievement.locked = false;
//             achievement.unlockedAt = new Date().toISOString();
//           }
//         }
//         if (state.currentStreak >= 10) {
//           const achievement = state.achievements.find(a => a.id === '10-day-streak');
//           if (achievement && achievement.locked) {
//             achievement.locked = false;
//             achievement.unlockedAt = new Date().toISOString();
//           }
//         }
//         if (state.totalSolved >= 50) {
//           const achievement = state.achievements.find(a => a.id === 'sql-master');
//           if (achievement && achievement.locked) {
//             achievement.locked = false;
//             achievement.unlockedAt = new Date().toISOString();
//           }
//         }
//       } else {
//         // Update existing solved problem with new code
//         state.solvedProblems[problemId].submittedCode = submittedCode;
//         state.solvedProblems[problemId].lastAttempt = new Date().toISOString();
//       }
//     },

//     saveProblemCode: (state, action: PayloadAction<{ problemId: string; code: string }>) => {
//       const { problemId, code } = action.payload;
//       if (!state.solvedProblems[problemId]) {
//         state.solvedProblems[problemId] = {
//           problemId,
//           solved: false,
//           attempts: 0,
//           savedCode: code
//         };
//       } else {
//         state.solvedProblems[problemId].savedCode = code;
//       }
//     },

//     incrementAttempt: (state, action: PayloadAction<string>) => {
//       const problemId = action.payload;
//       if (state.solvedProblems[problemId]) {
//         state.solvedProblems[problemId].attempts++;
//       } else {
//         state.solvedProblems[problemId] = {
//           problemId,
//           solved: false,
//           attempts: 1,
//           lastAttempt: new Date().toISOString()
//         };
//       }
//     },

//     resetProgress: (state) => {
//       state.solvedProblems = {};
//       state.totalSolved = 0;
//       state.easyCount = 0;
//       state.mediumCount = 0;
//       state.hardCount = 0;
//       state.currentStreak = 0;
//       state.longestStreak = 0;
//       state.lastActivityDate = null;
//       state.totalPoints = 0;
//       state.achievements.forEach(achievement => {
//         achievement.locked = true;
//         achievement.unlockedAt = undefined;
//       });
//     }
//   }
// });

// export const { markProblemSolved, incrementAttempt, resetProgress, saveProblemCode } = progressSlice.actions;
// export default progressSlice.reducer;

import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UserAchievement {
  id: string;
  name: string;
  description: string;
  unlocked: boolean;
}

interface UserProgressState {
  solvedSlugs: string[];
  problemsSolved: number;
  points: number;

  streak: {
    current: number;
    longest: number;
    lastActiveDate: string | null;
  };

  achievements: UserAchievement[];
}

const initialState: UserProgressState = {
  solvedSlugs: [],
  problemsSolved: 0,
  points: 0,
  streak: {
    current: 0,
    longest: 0,
    lastActiveDate: null,
  },
  achievements: [],
};

const progressSlice = createSlice({
  name: "progress",
  initialState,
  reducers: {
    setProgressFromBackend: (
      state,
      action: PayloadAction<{
        solvedSlugs: string[];
        problemsSolved: number;
        points: number;
        streak: {
          current: number;
          longest: number;
          lastActiveDate: string | null;
        };
        achievements: UserAchievement[];
      }>
    ) => {
      return { ...state, ...action.payload };
    },
  },
});

export const { setProgressFromBackend } = progressSlice.actions;
export default progressSlice.reducer;
