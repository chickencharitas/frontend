import React, { useEffect, useState } from 'react';
import defaults from '../shortcuts/defaults';

// Helper: normalize key string for matching (e.g., Ctrl+S -> ctrl+s)
const normalize = (e) => {
  const parts = [];
  if (e.ctrlKey) parts.push('ctrl');
  if (e.metaKey) parts.push('meta');
  if (e.shiftKey) parts.push('shift');
  const key = e.key.length === 1 ? e.key.toLowerCase() : e.key;
  parts.push(key);
  return parts.join('+');
};

// Create a quick lookup map from key signature -> action name(s)
const buildMap = (map = {}) => {
  const out = new Map();
  Object.keys(map).forEach((action) => {
    const keys = map[action] || [];
    keys.forEach((k) => {
      const normalized = k.toLowerCase();
      // Convert human form like 'Ctrl+S' into 'ctrl+s' for comparison
      out.set(normalized, (out.get(normalized) || []).concat(action));
    });
  });
  return out;
};

export default function ShortcutsProvider({ mappings = defaults }) {
  const [current, setCurrent] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('shortcuts') || '{}');
      // Merge: stored overrides defaults
      return Object.keys(defaults).reduce((acc, k) => ({ ...acc, [k]: stored[k] || defaults[k] }), {});
    } catch (err) {
      return defaults;
    }
  });

  useEffect(() => {
    const handleUpdate = (e) => {
      const newMap = e?.detail || JSON.parse(localStorage.getItem('shortcuts') || '{}');
      setCurrent((prev) => Object.keys(defaults).reduce((acc, k) => ({ ...acc, [k]: newMap[k] || prev[k] || defaults[k] }), {}));
    };

    window.addEventListener('app:shortcuts-updated', handleUpdate);
    return () => window.removeEventListener('app:shortcuts-updated', handleUpdate);
  }, []);

  useEffect(() => {
    const map = buildMap(current);

    const onKeyDown = (e) => {
      // Ignore if focus is in an input, textarea or contentEditable
      const active = document.activeElement;
      if (active && (active.tagName === 'INPUT' || active.tagName === 'TEXTAREA' || active.isContentEditable)) {
        return;
      }

      // Build possible key signatures to check e.g. 'ctrl+s', 's', 'f11'
      const signatures = [];
      const baseKey = e.key.length === 1 ? e.key.toLowerCase() : e.key;

      // full normalized
      const full = normalize(e);
      signatures.push(full);

      // simple base (without modifiers)
      signatures.push(baseKey);

      // ctrl/meta combos
      if (e.ctrlKey || e.metaKey) {
        const ctrl = `${e.ctrlKey ? 'ctrl' : 'meta'}+${baseKey}`;
        signatures.push(ctrl);
        if (e.shiftKey) signatures.push(`shift+${ctrl}`);
      }

      for (const sig of signatures) {
        const actions = map.get(sig);
        if (actions && actions.length) {
          e.preventDefault();
          actions.forEach((a) => {
            switch (a) {
              case 'nextCue':
                window.dispatchEvent(new CustomEvent('presentation:next'));
                break;
              case 'previousCue':
                window.dispatchEvent(new CustomEvent('presentation:previous'));
                break;
              case 'playPause':
                window.dispatchEvent(new CustomEvent('presentation:toggle-play'));
                break;
              case 'toggleFullscreen':
                window.dispatchEvent(new CustomEvent('app:toggle-fullscreen'));
                break;
              case 'toggleStageDisplay':
                window.dispatchEvent(new CustomEvent('presentation:toggle-stage'));
                break;
              case 'showShortcuts':
                window.dispatchEvent(new CustomEvent('app:show-shortcuts'));
                break;
              case 'newPresentation':
                window.dispatchEvent(new CustomEvent('app:new'));
                break;
              case 'save':
                window.dispatchEvent(new CustomEvent('app:save'));
                break;
              case 'undo':
                window.dispatchEvent(new CustomEvent('app:undo'));
                break;
              case 'redo':
                window.dispatchEvent(new CustomEvent('app:redo'));
                break;
              case 'addCue':
                window.dispatchEvent(new CustomEvent('presentation:add-cue'));
                break;
              case 'duplicateCue':
                window.dispatchEvent(new CustomEvent('presentation:duplicate-cue'));
                break;
              case 'deleteCue':
                window.dispatchEvent(new CustomEvent('presentation:delete-cue'));
                break;
              case 'editCue':
                window.dispatchEvent(new CustomEvent('presentation:edit-cue'));
                break;
              case 'stopPresentation':
                window.dispatchEvent(new CustomEvent('presentation:stop'));
                break;
              case 'goLive':
                window.dispatchEvent(new CustomEvent('app:go-live'));
                break;
              // Phase 1: Slide Management
              case 'addSlide':
                window.dispatchEvent(new CustomEvent('slide:add'));
                break;
              case 'deleteSlide':
                window.dispatchEvent(new CustomEvent('slide:delete'));
                break;
              case 'duplicateSlide':
                window.dispatchEvent(new CustomEvent('slide:duplicate'));
                break;
              case 'moveSlideUp':
                window.dispatchEvent(new CustomEvent('slide:move-up'));
                break;
              case 'moveSlideDown':
                window.dispatchEvent(new CustomEvent('slide:move-down'));
                break;
              // Phase 1: Element Formatting
              case 'formatBold':
                window.dispatchEvent(new CustomEvent('element:format-bold'));
                break;
              case 'formatItalic':
                window.dispatchEvent(new CustomEvent('element:format-italic'));
                break;
              case 'formatUnderline':
                window.dispatchEvent(new CustomEvent('element:format-underline'));
                break;
              case 'addTextElement':
                window.dispatchEvent(new CustomEvent('element:add-text'));
                break;
              case 'addImageElement':
                window.dispatchEvent(new CustomEvent('element:add-image'));
                break;
              case 'addVideoElement':
                window.dispatchEvent(new CustomEvent('element:add-video'));
                break;
              case 'deleteElement':
                window.dispatchEvent(new CustomEvent('element:delete'));
                break;
              // Phase 1: Presenter Controls
              case 'startPresentation':
                window.dispatchEvent(new CustomEvent('presenter:start'));
                break;
              case 'pausePresentation':
                window.dispatchEvent(new CustomEvent('presenter:pause'));
                break;
              case 'resetTimer':
                window.dispatchEvent(new CustomEvent('presenter:reset-timer'));
                break;
              // Phase 1: Content Navigation
              case 'openSongs':
                window.dispatchEvent(new CustomEvent('panel:songs'));
                break;
              case 'openScripture':
                window.dispatchEvent(new CustomEvent('panel:scripture'));
                break;
              case 'openEditor':
                window.dispatchEvent(new CustomEvent('panel:editor'));
                break;
              case 'openPresenter':
                window.dispatchEvent(new CustomEvent('panel:presenter'));
                break;
              case 'searchContent':
                window.dispatchEvent(new CustomEvent('app:search'));
                break;
              default:
                window.dispatchEvent(new CustomEvent(`shortcut:${a}`));
                break;
            }
          });
          // If we matched on one signature, don't try other signatures
          break;
        }
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [current]);

  return null; // invisible provider
}
