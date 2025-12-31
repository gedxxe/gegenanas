import React, { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  shouldPlay: boolean;
}

// Simple Arpeggio Melody (C Maj7 -> A Min7 -> F Maj7 -> G Dom7)
// Frequencies in Hz
const MELODY_SEQUENCE = [
  // C Major 7
  261.63, 329.63, 392.00, 493.88, 329.63, 392.00, 493.88, 523.25,
  // A Minor 7
  220.00, 261.63, 329.63, 392.00, 261.63, 329.63, 392.00, 440.00,
  // F Major 7
  174.61, 220.00, 261.63, 329.63, 220.00, 261.63, 329.63, 349.23,
  // G Dominant 7
  196.00, 246.94, 293.66, 349.23, 246.94, 293.66, 349.23, 392.00
];

const NOTE_DURATION = 0.25; // Seconds per note (16th notes approx at 120bpm)
const LOOKAHEAD = 25.0; // Milliseconds
const SCHEDULE_AHEAD_TIME = 0.1; // Seconds

const AudioPlayer: React.FC<AudioPlayerProps> = ({ shouldPlay }) => {
  const [isMuted, setIsMuted] = useState(false);
  const [showErrorToast, setShowErrorToast] = useState(false);
  
  // Audio Refs
  const audioCtxRef = useRef<AudioContext | null>(null);
  const masterGainRef = useRef<GainNode | null>(null);
  const nextNoteTimeRef = useRef<number>(0);
  const currentNoteIndexRef = useRef<number>(0);
  const timerIDRef = useRef<number | null>(null);
  const isPlayingRef = useRef<boolean>(false);

  // Initialize Audio Context
  useEffect(() => {
    if (shouldPlay && !audioCtxRef.current) {
      try {
        const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
        const ctx = new AudioContextClass();
        audioCtxRef.current = ctx;

        // Create Master Gain (Volume Control)
        const masterGain = ctx.createGain();
        masterGain.gain.value = 0.05; // Low volume for background ambiance
        masterGain.connect(ctx.destination);
        masterGainRef.current = masterGain;

        // Reset scheduler
        nextNoteTimeRef.current = ctx.currentTime + 0.1;
        currentNoteIndexRef.current = 0;
        isPlayingRef.current = true;
        
        // Start Scheduler Loop
        scheduler();

        // Check if context is suspended (browser policy)
        if (ctx.state === 'suspended') {
          console.warn('AudioContext is suspended. User gesture needed.');
          setShowErrorToast(true);
        }
      } catch (e) {
        console.error("Failed to initialize Web Audio API:", e);
        setShowErrorToast(true);
      }
    }

    return () => {
      // Cleanup: Stop timer and close context
      if (timerIDRef.current) window.clearTimeout(timerIDRef.current);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(console.error);
        audioCtxRef.current = null;
      }
      isPlayingRef.current = false;
    };
  }, [shouldPlay]);

  // Handle Mute Toggle
  useEffect(() => {
    if (masterGainRef.current && audioCtxRef.current) {
      const now = audioCtxRef.current.currentTime;
      masterGainRef.current.gain.cancelScheduledValues(now);
      
      if (isMuted) {
        masterGainRef.current.gain.setTargetAtTime(0, now, 0.1);
      } else {
        masterGainRef.current.gain.setTargetAtTime(0.05, now, 0.1);
      }
    }
  }, [isMuted]);

  // Scheduler: schedules notes that fall within the lookahead window
  const scheduler = () => {
    if (!audioCtxRef.current || !isPlayingRef.current) return;

    // While there are notes that will need to play before the next interval
    while (nextNoteTimeRef.current < audioCtxRef.current.currentTime + SCHEDULE_AHEAD_TIME) {
      scheduleNote(nextNoteTimeRef.current);
      nextNote();
    }

    timerIDRef.current = window.setTimeout(scheduler, LOOKAHEAD);
  };

  // Advance to next note
  const nextNote = () => {
    const secondsPerBeat = NOTE_DURATION;
    nextNoteTimeRef.current += secondsPerBeat;
    
    currentNoteIndexRef.current++;
    if (currentNoteIndexRef.current >= MELODY_SEQUENCE.length) {
      currentNoteIndexRef.current = 0;
    }
  };

  // Play a single note
  const scheduleNote = (time: number) => {
    if (!audioCtxRef.current || !masterGainRef.current) return;
    
    const freq = MELODY_SEQUENCE[currentNoteIndexRef.current];

    // Create Oscillator
    const osc = audioCtxRef.current.createOscillator();
    osc.type = 'triangle'; // Retro 8-bit flute sound
    osc.frequency.value = freq;

    // Create Envelope Gain
    const envelope = audioCtxRef.current.createGain();
    
    // Connect: Osc -> Envelope -> MasterGain
    osc.connect(envelope);
    envelope.connect(masterGainRef.current);

    // Envelope Shape (ADSR-ish)
    envelope.gain.setValueAtTime(0, time);
    envelope.gain.linearRampToValueAtTime(1, time + 0.05); // Attack
    envelope.gain.exponentialRampToValueAtTime(0.7, time + 0.1); // Decay
    envelope.gain.setValueAtTime(0.7, time + NOTE_DURATION - 0.05); // Sustain
    envelope.gain.exponentialRampToValueAtTime(0.01, time + NOTE_DURATION); // Release

    // Start/Stop
    osc.start(time);
    osc.stop(time + NOTE_DURATION + 0.1); // Stop after release
  };

  const toggleMute = () => setIsMuted(!isMuted);

  const handleRetry = () => {
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume().then(() => {
        setShowErrorToast(false);
      }).catch(console.error);
    } else {
        // If failed completely, try re-init by forcing a re-mount concept or just hiding toast
        setShowErrorToast(false);
    }
  };

  if (!shouldPlay) return null;

  return (
    <>
      {/* Control Button */}
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={toggleMute}
          className="bg-pink-500 hover:bg-pink-600 border-4 border-pink-800 text-white p-3 shadow-[4px_4px_0px_0px_rgba(0,0,0,0.5)] active:translate-y-1 active:shadow-none transition-all cursor-pointer"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
             <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
               <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73 4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
             </svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          )}
        </button>
      </div>

      {/* Error Toast / Retry Prompt */}
      {showErrorToast && (
        <button 
          onClick={handleRetry}
          className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 bg-red-500 text-white px-4 py-2 border-2 border-white shadow-[4px_4px_0_rgba(0,0,0,0.5)] hover:scale-105 transition-transform font-bold text-[10px] md:text-xs animate-bounce"
        >
          ♫ TAP TO ENABLE SOUND
        </button>
      )}
    </>
  );
};

export default AudioPlayer;