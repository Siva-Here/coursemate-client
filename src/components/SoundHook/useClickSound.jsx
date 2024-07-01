import { useEffect } from 'react';

const useClickSound = (soundFile, excludedSelectors = []) => {
  useEffect(() => {
    const clickSound = new Audio(soundFile);
    clickSound.preload = 'auto'; // Ensure audio file is preloaded
    clickSound.volume=0.3;

    const handleClick = (event) => {
      if (excludedSelectors.some(selector => event.target.closest(selector))) {
        return;
      }
      clickSound.currentTime = 0; // Rewind sound to start
      clickSound.play();
    };

    document.addEventListener('click', handleClick);
    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, [soundFile, excludedSelectors]);
};

export default useClickSound;
