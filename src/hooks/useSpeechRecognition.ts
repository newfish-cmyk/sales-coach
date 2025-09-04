/*
  浏览器端语音识别 Hook（基于 Web Speech API）
  - 默认中文 zh-CN
  - 提供开始/停止、状态、实时文本和最终文本
  - 通过 onFinal 回调把最终识别文本交给上层处理
*/

import { useCallback, useEffect, useRef, useState } from 'react'

type UseSpeechRecognitionOptions = {
  lang?: string
  continuous?: boolean
  interimResults?: boolean
  onFinal?: (text: string) => void
}

export function useSpeechRecognition(options: UseSpeechRecognitionOptions = {}) {
  const { lang = 'zh-CN', continuous = false, interimResults = true, onFinal } = options

  const recognitionRef = useRef<any>(null)
  const [isSupported, setIsSupported] = useState(false)
  const [isListening, setIsListening] = useState(false)
  const [interimTranscript, setInterimTranscript] = useState('')
  const [finalTranscript, setFinalTranscript] = useState('')

  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SpeechRecognition) {
      setIsSupported(false)
      return
    }
    setIsSupported(true)

    const recognition = new SpeechRecognition()
    recognition.lang = lang
    recognition.continuous = continuous
    recognition.interimResults = interimResults

    recognition.onstart = () => {
      setIsListening(true)
      setInterimTranscript('')
      setFinalTranscript('')
    }

    recognition.onerror = () => {
      setIsListening(false)
    }

    recognition.onend = () => {
      setIsListening(false)
    }

    recognition.onresult = (event: any) => {
      let interim = ''
      let finalText = ''
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript
        if (event.results[i].isFinal) {
          finalText += transcript
        } else {
          interim += transcript
        }
      }
      if (interim) setInterimTranscript(interim)
      if (finalText) {
        setFinalTranscript((prev) => prev + finalText)
        onFinal?.(finalText)
      }
    }

    recognitionRef.current = recognition

    return () => {
      try {
        recognition.stop()
      } catch {}
    }
  }, [lang, continuous, interimResults, onFinal])

  const start = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.start()
    } catch {}
  }, [])

  const stop = useCallback(() => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.stop()
    } catch {}
  }, [])

  return {
    isSupported,
    isListening,
    interimTranscript,
    finalTranscript,
    start,
    stop
  }
}


