import { useState } from 'react'

export function useAudioRecorder({
	setError = () => {},
	onAudioBlobAvailable = () => {},
}) {
	const [recorder, setRecorder] = useState(null)
	const [audioUrl, setAudioUrl] = useState('')
	const [audioBlob, setAudioBlob] = useState(null)

	const isRecording = recorder?.state === 'recording'

	// Function to clear the audioBlob and set isAudioBlobAvailable to false
	const clearAudioBlob = () => {
		setAudioBlob(null)
	}

	const stopRecording = () => {
		if (isRecording) {
			recorder.stop()
		}
		// Release the media stream to free up the microphone
		const tracks = recorder.stream.getTracks()
		for (const track of tracks) {
			track.stop()
		}
	}

	const recordNow = ({ isAllRecordingStateSame = true } = {}) => {
		if (!isAllRecordingStateSame) {
			stopRecording()
		} else if (isRecording) {
			stopRecording()
			return
		}

		// start recording

		setError('')
		clearAudioBlob()
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
					onAudioBlobAvailable(myAudioBlob)
				}

				myRecorder.start()
			})
	}

	return { isRecording, audioUrl, recordNow, audioBlob }
}
