import { Link } from 'react-router-dom'
import { ErrorText } from './ErrorText'
import { LanguageSelection } from './LanguageSelection'
import { ModelSelection } from './ModelSelection'
import { SearchInputWithVoice } from './SearchInputWithVoice'
import { TitleAndDescription } from './TitleAndDescription'

export function AudioRecordingCardOld({
	title,
	setLanguage,
	language,
	setModel = null,
	modelOptions = null,
	model = null,
	error,
	isRecording,
	isPending,
	setSearchText,
	searchText,
	recordNow,
	desc,
	titleColor = 'text-rose-700',
}) {
	return (
		// <div className='sm:max-w-[40rem] flex gap-14 flex-col justify-center min-h-[30rem] m-1 sm:m-0 sm:shadow-2xl bg-slate-50 p-6 sm:p-10 rounded-xl'>
		<div className='sm:max-w-[40rem] relative grid justify-center min-h-[30rem] shadow-2xl bg-slate-50 p-6 sm:p-10 rounded-xl sm:m-0'>
			<Link
				className='absolute text-gray-700 underline right-0 top-0 p-3'
				to={'/'}
			>
				New
			</Link>
			<header className='text-center grid gap-7'>
				<div>
					<h1 className='text-2xl font-bold'>
						L3-ASR (Automatic Speech Recognition)
					</h1>
					<p className='font-bold text-gray-700 tracking-wide'>
						Voice-to-Text Transcription
					</p>
				</div>
				<TitleAndDescription color={titleColor} title={title} desc={desc} />
			</header>
			<div className='flex w-full space-y-7 sm:w-max flex-col  sm:justify-center'>
				<div className='grid space-y-1 sm:space-y-0 sm:grid-cols-[1fr_368px] sm:gap-5 sm:items-center'>
					<LanguageSelection language={language} setLanguage={setLanguage} />
				</div>
				<div className='min-h-[2rem]'>
					{modelOptions && <ModelSelection model={model} setModel={setModel} />}
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
