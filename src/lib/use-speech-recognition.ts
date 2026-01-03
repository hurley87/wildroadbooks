'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

interface UseSpeechRecognitionOptions {
  onResult?: (transcript: string) => void;
  onEnd?: () => void;
  onStopComplete?: (transcript: string) => void;
  continuous?: boolean;
  interimResults?: boolean;
  lang?: string;
}

interface SpeechRecognitionState {
  isListening: boolean;
  isSupported: boolean;
  transcript: string;
  error: string | null;
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const {
    onResult,
    onEnd,
    onStopComplete,
    continuous = true,
    interimResults = true,
    lang = 'en-US',
  } = options;

  const [state, setState] = useState<SpeechRecognitionState>({
    isListening: false,
    isSupported: false,
    transcript: '',
    error: null,
  });

  const recognitionRef = useRef<SpeechRecognition | null>(null);
  const onResultRef = useRef(onResult);
  const onEndRef = useRef(onEnd);
  const onStopCompleteRef = useRef(onStopComplete);
  const accumulatedTranscriptRef = useRef<string>('');
  const pendingSubmitRef = useRef<boolean>(false);

  // Keep refs in sync with latest callbacks without triggering effect re-runs
  useEffect(() => {
    onResultRef.current = onResult;
    onEndRef.current = onEnd;
    onStopCompleteRef.current = onStopComplete;
  }, [onResult, onEnd, onStopComplete]);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition =
      (typeof window !== 'undefined' && window.SpeechRecognition) ||
      (typeof window !== 'undefined' && (window as any).webkitSpeechRecognition);
    
    if (!SpeechRecognition) {
      setState((prev) => ({ ...prev, isSupported: false }));
      return;
    }

    setState((prev) => ({ ...prev, isSupported: true }));

    const recognition = new SpeechRecognition();
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;
    recognition.lang = lang;

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      // Accumulate final transcripts
      if (finalTranscript) {
        accumulatedTranscriptRef.current += finalTranscript;
      }

      // Show accumulated final transcript + current interim transcript
      const displayTranscript = accumulatedTranscriptRef.current.trim() + (interimTranscript ? ' ' + interimTranscript : '');
      setState((prev) => ({ ...prev, transcript: displayTranscript }));
      
      // Call onResult with accumulated final transcript when we have final results
      if (finalTranscript && onResultRef.current) {
        onResultRef.current(accumulatedTranscriptRef.current.trim());
      }
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setState((prev) => ({
        ...prev,
        error: event.error,
        isListening: false,
      }));
    };

    recognition.onend = () => {
      setState((prev) => ({ ...prev, isListening: false }));
      
      // If a submit was pending, call onStopComplete with the final transcript
      if (pendingSubmitRef.current) {
        pendingSubmitRef.current = false;
        const finalTranscript = accumulatedTranscriptRef.current.trim();
        onStopCompleteRef.current?.(finalTranscript);
      }
      
      onEndRef.current?.();
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.abort();
    };
  }, [continuous, interimResults, lang]);

  const startListening = useCallback(() => {
    if (!recognitionRef.current) return;
    
    // Reset accumulated transcript when starting new recording
    accumulatedTranscriptRef.current = '';
    setState((prev) => ({ ...prev, error: null, transcript: '' }));
    recognitionRef.current.start();
    setState((prev) => ({ ...prev, isListening: true }));
  }, []);

  const stopListening = useCallback((submitOnComplete: boolean = false) => {
    if (!recognitionRef.current) return;
    
    // Set flag to trigger onStopComplete callback when recognition ends
    pendingSubmitRef.current = submitOnComplete;
    
    recognitionRef.current.stop();
    // Update transcript to final accumulated value (remove any interim text)
    setState((prev) => ({ ...prev, isListening: false, transcript: accumulatedTranscriptRef.current.trim() }));
  }, []);

  const resetTranscript = useCallback(() => {
    accumulatedTranscriptRef.current = '';
    setState((prev) => ({ ...prev, transcript: '' }));
  }, []);

  const toggleListening = useCallback(() => {
    if (state.isListening) {
      stopListening();
    } else {
      startListening();
    }
  }, [state.isListening, startListening, stopListening]);

  const getFinalTranscript = useCallback(() => {
    return accumulatedTranscriptRef.current.trim();
  }, []);

  return {
    ...state,
    startListening,
    stopListening,
    toggleListening,
    resetTranscript,
    getFinalTranscript,
  };
}

