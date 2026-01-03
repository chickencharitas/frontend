import { useState, useCallback } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useCues = (initialCues = []) => {
  const [cues, setCues] = useState(initialCues);
  const [activeCueIndex, setActiveCueIndex] = useState(-1);

  const addCue = useCallback((cue) => {
    const newCue = {
      id: uuidv4(),
      title: 'New Cue',
      type: 'text',
      content: '',
      style: {
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontSize: '24px',
        textAlign: 'center',
      },
      timing: {
        duration: 30,
        autoContinue: false,
      },
      ...cue,
    };
    
    setCues(prevCues => [...prevCues, newCue]);
    return newCue.id;
  }, []);

  const updateCue = useCallback((id, updates) => {
    setCues(prevCues =>
      prevCues.map(cue =>
        cue.id === id ? { ...cue, ...updates } : cue
      )
    );
  }, []);

  const deleteCue = useCallback((id) => {
    setCues(prevCues => {
      const newCues = prevCues.filter(cue => cue.id !== id);
      // Adjust active cue index if needed
      if (activeCueIndex >= newCues.length) {
        setActiveCueIndex(Math.max(0, newCues.length - 1));
      } else if (activeCueIndex > prevCues.findIndex(cue => cue.id === id)) {
        setActiveCueIndex(prev => Math.max(0, prev - 1));
      }
      return newCues;
    });
  }, [activeCueIndex]);

  const moveCue = useCallback((fromIndex, toIndex) => {
    setCues(prevCues => {
      const newCues = [...prevCues];
      const [movedCue] = newCues.splice(fromIndex, 1);
      newCues.splice(toIndex, 0, movedCue);
      return newCues;
    });
  }, []);

  const duplicateCue = useCallback((id) => {
    setCues(prevCues => {
      const cueToDuplicate = prevCues.find(cue => cue.id === id);
      if (!cueToDuplicate) return prevCues;
      
      const duplicate = {
        ...JSON.parse(JSON.stringify(cueToDuplicate)),
        id: uuidv4(),
        title: `${cueToDuplicate.title} (Copy)`
      };
      
      const index = prevCues.findIndex(cue => cue.id === id);
      const newCues = [...prevCues];
      newCues.splice(index + 1, 0, duplicate);
      return newCues;
    });
  }, []);

  const setActiveCue = useCallback((id) => {
    const index = cues.findIndex(cue => cue.id === id);
    if (index !== -1) {
      setActiveCueIndex(index);
    }
  }, [cues]);

  const getActiveCue = useCallback(() => {
    return activeCueIndex >= 0 && activeCueIndex < cues.length 
      ? cues[activeCueIndex] 
      : null;
  }, [cues, activeCueIndex]);

  const goToNextCue = useCallback(() => {
    setActiveCueIndex(prev => 
      prev < cues.length - 1 ? prev + 1 : prev
    );
  }, [cues.length]);

  const goToPreviousCue = useCallback(() => {
    setActiveCueIndex(prev => Math.max(0, prev - 1));
  }, []);

  return {
    cues,
    activeCueIndex,
    activeCue: getActiveCue(),
    addCue,
    updateCue,
    deleteCue,
    moveCue,
    duplicateCue,
    setActiveCue,
    goToNextCue,
    goToPreviousCue,
    setCues,
  };
};

export default useCues;
