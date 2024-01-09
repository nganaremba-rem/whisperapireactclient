import axios from 'axios'
import { useCallback, useRef, useState } from 'react'
import AudioRecordingCard from './components/AudioRecordingCard'
import RecordBothButton from './components/RecordBothButton'
import { modelOptions } from './constants/modelOptions'
import useAudioRecorder from './hooks/useAudioRecorder'
import useMutateApiRequest from './hooks/useMutateApiRequest'
import { makeFormDataAndMutate } from './utils/makeFormDataAndMutate'

export default function App() {
	const [searchText, setSearchText] = useState('')
	const [endpointSearchText, setEndpointSearchText] = useState('')
	const [language, setLanguage] = useState('ja')
	const [endpointLanguage, setEndpointLanguage] = useState('ja')
	const [model, setModel] = useState('base')
	const [error, setError] = useState('')
	const [endpointError, setEndpointError] = useState('')

	const cancelTokenSourceRef = useRef(axios.CancelToken.source())
	const endPointCancelTokenSourceRef = useRef(axios.CancelToken.source())

	const { mutate, isPending } = useMutateApiRequest({
		mutationKey: 'postAudio',
		url: '/api/transcribe',
		cancelTokenSourceRef,
		setData: setSearchText,
		setError,
	})

	const { mutate: endPointMutate, isPending: endpointIsPending } =
		useMutateApiRequest({
			mutationKey: 'endpointPostAudio',
			url: '/api/transcribe/whisperapi',
			cancelTokenSourceRef: endPointCancelTokenSourceRef,
			setData: setEndpointSearchText,
			setError: setEndpointError,
		})

	const onAudioBlobAvailable = useCallback(
		(audioBlob) => {
			makeFormDataAndMutate({
				audioBlob,
				cancelTokenSourceRef,
				isPending,
				mutate,
				language,
				model,
			})
		},
		[mutate, language, isPending, model],
	)

	const endpointOnAudioBlobAvailable = useCallback(
		(audioBlob) => {
			makeFormDataAndMutate({
				audioBlob,
				cancelTokenSourceRef: endPointCancelTokenSourceRef,
				isPending: endpointIsPending,
				mutate: endPointMutate,
				language: endpointLanguage,
			})
		},
		[endPointMutate, endpointLanguage, endpointIsPending],
	)

	const { isRecording, recordNow } = useAudioRecorder({
		setError,
		onAudioBlobAvailable,
	})

	const { isRecording: endpointIsRecording, recordNow: endpointRecordNow } =
		useAudioRecorder({
			setError: setEndpointError,
			onAudioBlobAvailable: endpointOnAudioBlobAvailable,
		})

	const recordBoth = () => {
		recordNow({ isAllRecordingStateSame: isRecording === endpointIsRecording })
		endpointRecordNow({
			isAllRecordingStateSame: isRecording === endpointIsRecording,
		})
	}

	return (
		<>
			<div className='min-h-[100svh] p-2 items-center   bg-slate-100 text-gray-800 flex flex-col xl:flex-row xl:justify-center gap-3 '>
				<AudioRecordingCard
					error={error}
					isPending={isPending}
					isRecording={isRecording}
					language={language}
					recordNow={recordNow}
					searchText={searchText}
					setLanguage={setLanguage}
					setSearchText={setSearchText}
					title={'Local Whisper Server (Slow)'}
					model={model}
					modelOptions={modelOptions}
					setModel={setModel}
					desc='Description: This server is configured with a local installation of Whisper API on a cloud server. It handles transcription processes, serving the resulting text.
					Implementation: Utilizes the Whisper API installed on the cloud server.'
				/>
				<div>
					<RecordBothButton
						endpointIsRecording={endpointIsRecording}
						isRecording={isRecording}
						recordBoth={recordBoth}
					/>
				</div>
				<AudioRecordingCard
					title={'Whisper Endpoint Server (Fast)'}
					desc='Description: This server is configured making an api request with paid API_KEY from the provided endpoint of Whisper API. It handles transcription processes, serving the resulting text.
					Implementation: Utilizes the Whisper API endpoint from the whisperapi.com.'
					error={endpointError}
					isPending={endpointIsPending}
					isRecording={endpointIsRecording}
					language={endpointLanguage}
					recordNow={endpointRecordNow}
					searchText={endpointSearchText}
					setLanguage={setEndpointLanguage}
					setSearchText={setEndpointSearchText}
				/>
			</div>
		</>
	)
}
