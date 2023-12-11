import { useState } from 'react'

function useAudioRecorder() {
  const [recorder, setRecorder] = useState(null)
  const [audioUrl, setAudioUrl] = useState('')
  const [audioBlob, setAudioBlob] = useState(null)

  const isRecording = recorder?.state === 'recording'

  const recordNow = () => {
    // if it is currently recording. Stop the recording
    if (isRecording) {
      recorder.stop()
      return
    }
    // start recording
    window.navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        const myRecorder = new MediaRecorder(stream)
        setRecorder(myRecorder)

        const audioChunks = []

        myRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            audioChunks.push(e.data)
          }
        }

        myRecorder.onstop = () => {
          const myAudioBlob = new Blob(audioChunks, { type: 'audio/wav' })
          setAudioBlob(myAudioBlob)
          const myAudioUrl = URL.createObjectURL(myAudioBlob)
          setAudioUrl(myAudioUrl)
        }

        myRecorder.start()
      })
  }

  return { isRecording, audioUrl, recordNow, audioBlob }
}

export default useAudioRecorder
