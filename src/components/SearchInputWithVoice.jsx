import React from 'react'
import { FaSearch, FaStopCircle } from 'react-icons/fa'
import { MdClear, MdKeyboardVoice } from 'react-icons/md'
import useSound from 'use-sound'
import startSound from '/src/assets/audio/start.mp3'
import stopSound from '/src/assets/audio/stop.mp3'

function SearchInputWithVoice({
	textFieldValueState,
	isRecording,
	isPending,
	setSearchText,
	searchText,
	recordNow,
}) {
	const [playStartSound, { stop: stopStartSound }] = useSound(startSound)
	const [playStopSound, { stop: stopStopSound }] = useSound(stopSound)

	return (
		<div className=' bg-[rgb(220,236,255)] mb-5   px-3 py-2 flex w-full items-center rounded-lg   '>
			<div>
				<FaSearch size={20} className='text-[#797B7E]' />
			</div>
			<div className='p-2 ml-3 w-full pointer-events-none ring-2 ring-gray-200 focus-within:ring-sky-600 bg-white rounded mr-2 flex items-center'>
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
						if (!searchText) {
							return
						}
						setSearchText('')
					}}
					className={`${
						!searchText || isPending || isRecording ? 'invisible' : 'visible'
					}  pointer-events-auto  active:text-white active:bg-[#3194ff] text-[#60AEFF] hover:text-white  hover:bg-[#007bff]`}
				>
					<MdClear size={20} />
				</button>
			</div>

			<div className='bg-white pointer-events-none ring-2 ring-gray-200 focus-within:ring-sky-600  rounded flex justify-center items-center'>
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
	)
}

export default SearchInputWithVoice
