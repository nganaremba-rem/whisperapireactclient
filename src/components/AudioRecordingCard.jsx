import { Link } from 'react-router-dom'
import { ErrorText } from './ErrorText'
import { LanguageSelection } from './LanguageSelection'
import { SearchInputWithVoice } from './SearchInputWithVoice'

export function AudioRecordingCard({
	setLanguage,
	language,
	error,
	isRecording,
	isPending,
	setSearchText,
	searchText,
	recordNow,
}) {
	return (
		<div className='sm:max-w-[40rem] pt-10 bg-white relative grid justify-center gap-16 sm:shadow-2xl sm:bg-slate-50 p-6 sm:p-10 rounded-xl sm:m-0'>
			<Link
				className='absolute text-gray-700 underline right-0 top-0 p-3'
				to={'/old'}
			>
				Old
			</Link>
			<header className='text-center'>
				<div>
					<h1 className='text-2xl font-bold'>
						L3-ASR (Automatic Speech Recognition)
					</h1>
					<p className='font-bold text-gray-700 tracking-wide'>
						Voice-to-Text Transcription
					</p>
				</div>
			</header>
			<div className='flex w-full space-y-7 sm:w-max flex-col  sm:justify-center'>
				<div className='grid sm:space-y-0 sm:grid-cols-[1fr_368px] sm:gap-5 sm:items-center'>
					<LanguageSelection language={language} setLanguage={setLanguage} />
				</div>
			</div>

			<div>
				<ErrorText error={error} isRecording={isRecording} />

				<SearchInputWithVoice
					isPending={isPending}
					isRecording={isRecording}
					recordNow={recordNow}
					searchText={searchText}
					setSearchText={setSearchText}
				/>
			</div>
		</div>
	)
}
