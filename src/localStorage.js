/**
 * load app state from localStorage
 */
export function loadState(defaultState) {
  const serializedState = localStorage.getItem('appState');
  if (serializedState) {
    try {
      return JSON.parse(serializedState) || defaultState;
    } catch (ex) {}
  }
  return defaultState;
}

/**
 * save app state to localStorage
 */
export function saveState(state) {
  state = {
    ...state
  };

  // normalize state before saving
  // remove startCountTimer
  delete state.startCountTimer;

  localStorage.setItem('appState', JSON.stringify(state));
}
