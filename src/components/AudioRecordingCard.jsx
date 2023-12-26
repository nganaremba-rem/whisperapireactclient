import ErrorText from './ErrorText'
import LanguageSelection from './LanguageSelection'
import ModelSelection from './ModelSelection'
import SearchInputWithVoice from './SearchInputWithVoice'
import TitleAndDescription from './TitleAndDescription'

// import { colourStyles } from '../utils/colorStyles'

function AudioRecordingCard({
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
}) {
	return (
		<div className='sm:max-w-[40rem] my-5 sm:shadow-2xl   bg-slate-50 p-6 sm:p-10 rounded-xl mt-5'>
			<h1 className='text-4xl font-bold text-center pb-16'>
				Voice to Text Transcription
			</h1>
			<div className='flex w-full space-y-10 sm:w-max flex-col  sm:justify-center  gap-3'>
				<TitleAndDescription title={title} desc={desc} />

				<div className='grid space-y-5 sm:space-y-0 sm:grid-cols-[1fr_368px] sm:gap-5 sm:items-center'>
					<LanguageSelection language={language} setLanguage={setLanguage} />
				</div>
				{modelOptions && <ModelSelection model={model} setModel={setModel} />}
			</div>

			<ErrorText error={error} isRecording={isRecording} />

			<SearchInputWithVoice
				isPending={isPending}
				isRecording={isRecording}
				recordNow={recordNow}
				searchText={searchText}
				setSearchText={setSearchText}
			/>
		</div>
	)
}

export default AudioRecordingCard
