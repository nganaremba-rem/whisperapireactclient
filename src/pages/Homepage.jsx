import { AudioRecordingCard } from '@components'
import { useAudioRecorder, useMutateApiRequest } from '@hooks'
import { makeFormDataAndMutate } from '@utils'
import axios from 'axios'
import { useCallback, useRef, useState } from 'react'

export function Homepage() {
	const [endpointSearchText, setEndpointSearchText] = useState('')
	const [endpointLanguage, setEndpointLanguage] = useState('ja')
	const [endpointError, setEndpointError] = useState('')

	const endPointCancelTokenSourceRef = useRef(axios.CancelToken.source())

	const { mutate: endPointMutate, isPending: endpointIsPending } =
		useMutateApiRequest({
			mutationKey: 'endpointPostAudio',
			url: '/api/transcribe/whisperapi',
			cancelTokenSourceRef: endPointCancelTokenSourceRef,
			setData: setEndpointSearchText,
			setError: setEndpointError,
		})

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

	const { isRecording: endpointIsRecording, recordNow: endpointRecordNow } =
		useAudioRecorder({
			setError: setEndpointError,
			onAudioBlobAvailable: endpointOnAudioBlobAvailable,
		})

	return (
		<>
			<div className='min-h-[100svh] px-1 py-5 items-center   sm:bg-slate-100 text-gray-800 flex flex-col xl:flex-row xl:justify-center gap-3 '>
				<AudioRecordingCard
					titleColor='text-green-600'
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
