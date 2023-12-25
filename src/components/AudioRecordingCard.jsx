import { FaSearch, FaStopCircle } from 'react-icons/fa'
import { MdClear, MdKeyboardVoice } from 'react-icons/md'
import Select from 'react-select'
import useSound from 'use-sound'
import startSound from '/src/assets/audio/start.mp3'
import stopSound from '/src/assets/audio/stop.mp3'
import { colourStyles } from '../utils/colorStyles'

function AudioRecordingCard({
	title,
	setLanguage,
	language,
	setModel = null,
	modelOptions = null,
	model = null,
	error,
	isRecording,
	textFieldValueState,
	isPending,
	setSearchText,
	searchText,
	recordNow,
}) {
	const [playStartSound, { stop: stopStartSound }] = useSound(startSound)
	const [playStopSound, { stop: stopStopSound }] = useSound(stopSound)

	return (
		<div className='sm:max-w-[40rem] my-5 sm:shadow-md sm:bg-gray-900 p-6 sm:p-10 rounded-xl mt-5'>
			<h1 className='text-4xl font-bold text-center pb-16'>
				Voice to Text Transcription
			</h1>
			<div className='flex w-full space-y-10 sm:w-max flex-col  sm:justify-center  gap-3'>
				<div
					title='Description: This server is configured with a local installation of Whisper API on a cloud server. It handles transcription processes, serving the resulting text.
Implementation: Utilizes the Whisper API installed on the cloud server.'
					className='text-center text-lg font-extrabold tracking-wide'
				>
					Whisper Server ({title})
				</div>

				<div className='grid space-y-5 sm:space-y-0 sm:grid-cols-[1fr_368px] sm:gap-5 sm:items-center'>
					<label htmlFor='language'>Language</label>
					<div className='flex items-center'>
						<button
							type='button'
							onClick={() => setLanguage('ja')}
							className={`flex-1 ${
								language === 'ja' ? 'bg-sky-600' : 'bg-gray-700'
							} font-bold tracking-wide rounded p-2`}
						>
							日本語
						</button>
						<button
							type='button'
							onClick={() => setLanguage('en')}
							className={`flex-1 ${
								language === 'en' ? 'bg-sky-600' : 'bg-gray-700'
							} tracking-wide rounded p-2`}
						>
							English
						</button>
					</div>
				</div>
				{modelOptions && (
					<div className='grid sm:grid-cols-[1fr_368px] sm:gap-5 sm:items-center sm:justify-center'>
						<label htmlFor='model'>Model</label>
						<Select
							styles={colourStyles}
							onChange={(option) => {
								setModel(option?.value)
							}}
							options={modelOptions}
							defaultValue={() => {
								return modelOptions.find((option) => option.value === model)
							}}
						/>
					</div>
				)}
			</div>

			<div
				className={`${
					error !== '' && !isRecording ? 'visible' : 'invisible'
				} py-6 text-red-400 font-bold tracking-wide`}
			>
				{error || 'Error'}
			</div>

			<div className=' bg-[rgb(220,236,255)] mb-5 ring-gray-200 focus-within:ring-sky-600 pointer-events-none px-3 py-2 flex w-full items-center rounded-lg  ring-2 '>
				<div>
					<FaSearch size={20} className='text-[#797B7E]' />
				</div>
				<div className='p-2 ml-3 w-full bg-white rounded mr-2 flex items-center'>
					<input
						value={textFieldValueState}
						className={`bg-white ${
							(isRecording || isPending) && 'italic'
						} text-[#333] rounded w-full min-w-0  pointer-events-auto  outline-none focus:ring-cyan-400 text-xl`}
						type='text'
						name='search'
						id='search'
						readOnly={isPending || isRecording}
						onChange={(e) => {
							setSearchText(e.target.value)
						}}
					/>
					<button
						type='button'
						disabled={isRecording || isPending}
						onClick={() => {
							if (!searchText) return
							setSearchText('')
						}}
						className={`${
							!searchText || isPending || isRecording ? 'invisible' : 'visible'
						}  pointer-events-auto  active:text-white active:bg-[#3194ff] text-[#60AEFF] hover:text-white  hover:bg-[#007bff]`}
					>
						<MdClear size={20} />
					</button>
				</div>

				<div className='bg-white rounded flex justify-center items-center'>
					<button
						type='button'
						onClick={() => {
							if (isRecording) {
								stopStartSound()
								playStopSound()
							} else {
								stopStopSound()
								playStartSound()
							}
							recordNow()
						}}
						className={`text-[#60AEFF] ${
							isRecording
								? 'bg-red-600 text-white  animate-my_pulse  '
								: 'bg-transparent  bg-gray-700'
						} cursor-pointer active:bg-white  pointer-events-auto  active:text-[#60AEFF] p-2  rounded-full`}
					>
						{isRecording ? (
							<FaStopCircle className='text-white' size={30} />
						) : (
							<MdKeyboardVoice size={30} />
						)}
					</button>
				</div>
			</div>
		</div>
	)
}

export default AudioRecordingCard
