import axios from 'axios'
import { useCallback, useMemo, useRef, useState } from 'react'
import AudioRecordingCard from './components/AudioRecordingCard'
import RecordBothButton from './components/RecordBothButton'
import { modelOptions } from './constants/modelOptions'
import useAudioRecorder from './hooks/useAudioRecorder'
import useMutateApiRequest from './hooks/useMutateApiRequest'
import { cancelPreviousMutation } from './utils/mutationCancel'

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
			const myFormData = new FormData()
			myFormData.append('model', model || 'base')
			myFormData.append('file', audioBlob)
			myFormData.append('language', language || 'ja')

			if (isPending) {
				cancelPreviousMutation({ cancelTokenSourceRef, axios })
			}
			mutate(myFormData)
		},
		[mutate, language, isPending, model],
	)

	const endpointOnAudioBlobAvailable = useCallback(
		(audioBlob) => {
			const myFormData = new FormData()
			myFormData.append('file', audioBlob)
			myFormData.append('language', endpointLanguage || 'ja')

			if (endpointIsPending) {
				cancelPreviousMutation({
					axios,
					cancelTokenSourceRef: endPointCancelTokenSourceRef,
				})
			}
			endPointMutate(myFormData)
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
		recordNow()
		endpointRecordNow()
	}

	const endpointTextFieldValueState = useMemo(() => {
		if (endpointIsPending) {
			return 'Please wait...'
		}
		if (endpointIsRecording) {
			return 'Recording...'
		}
		return endpointSearchText
	}, [endpointIsPending, endpointIsRecording, endpointSearchText])

	const textFieldValueState = useMemo(() => {
		if (isPending) {
			return 'Please wait...'
		}
		if (isRecording) {
			return 'Recording...'
		}
		return searchText
	}, [isPending, isRecording, searchText])

	return (
		<>
			<div className='min-h-[100svh] items-center   bg-slate-100 text-gray-800 flex flex-col md:flex-row md:justify-center gap-3  '>
				<AudioRecordingCard
					error={error}
					isPending={isPending}
					isRecording={isRecording}
					language={language}
					recordNow={recordNow}
					searchText={searchText}
					setLanguage={setLanguage}
					setSearchText={setSearchText}
					textFieldValueState={textFieldValueState}
					title={'Local Whisper Server'}
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
					title={'Whisper Endpoint Server'}
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
					textFieldValueState={endpointTextFieldValueState}
				/>
			</div>
		</>
	)
}
