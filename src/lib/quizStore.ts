import {INITIAL_STATE, type Answer, type QuizState} from '@/data/quiz';

const KEY = 'diwan.quiz.v1';

export function loadQuizState(): QuizState {
  if (typeof window === 'undefined') return INITIAL_STATE;
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return INITIAL_STATE;
    const parsed = JSON.parse(raw) as QuizState;
    if (typeof parsed?.currentIndex !== 'number') return INITIAL_STATE;
    return parsed;
  } catch {
    return INITIAL_STATE;
  }
}

export function saveQuizState(state: QuizState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // quota or disabled — silently ignore for the demo
  }
}

export function clearQuizState() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(KEY);
}

export function setAnswer(state: QuizState, answer: Answer): QuizState {
  return {
    ...state,
    answers: {...state.answers, [answer.id]: answer},
    startedAt: state.startedAt || Date.now(),
  };
}
