import React, { useMemo } from 'react'
import { FaSearch, FaStopCircle } from 'react-icons/fa'
import { IoMicOutline } from 'react-icons/io5'
import { MdClear } from 'react-icons/md'
import { default as TextareaAutosize } from 'react-textarea-autosize'
import useSound from 'use-sound'
import startSound from '/src/assets/audio/start.mp3'
import stopSound from '/src/assets/audio/stop.mp3'
import { getTextFieldState } from '../utils/getTextFieldState'

function SearchInputWithVoice({
	isRecording,
	isPending,
	setSearchText,
	searchText,
	recordNow,
}) {
	const [playStartSound, { stop: stopStartSound }] = useSound(startSound)
	const [playStopSound, { stop: stopStopSound }] = useSound(stopSound)

	const textFieldValueState = useMemo(
		() => getTextFieldState({ isPending, isRecording, searchText }),
		[isPending, isRecording, searchText],
	)

	return (
		<div className=' bg-[#DCECFF] px-3 py-2 flex w-full items-center rounded-lg   '>
			<div>
				<FaSearch size={20} className='text-[#797B7E]' />
			</div>
			<div className='p-2 ml-3 w-full pointer-events-none ring-2 ring-gray-200 focus-within:ring-sky-600 bg-white rounded mr-2 flex items-center'>
				<TextareaAutosize
					className={`bg-white  text-[#333]  resize-none ${
						(isRecording || isPending) && 'italic text-gray-400'
					} focus:outline-none transition duration-300 ease-in-out  rounded w-full min-w-0  pointer-events-auto  outline-none focus:ring-cyan-400 text-xl`}
					type='text'
					name='search'
					id='search'
					readOnly={isPending || isRecording}
					onChange={(e) => {
						setSearchText(e.target.value)
					}}
					value={textFieldValueState}
					maxRows={8}
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
					className={`text-[#1085FF] ${
						isRecording
							? 'bg-red-600 text-white  animate-my_pulse  '
							: 'bg-transparent  bg-gray-700'
					} cursor-pointer pointer-events-auto  p-2  rounded-full`}
				>
					{isRecording ? (
						<FaStopCircle className='text-white' size={30} />
					) : (
						<IoMicOutline size={30} />
						// <MdKeyboardVoice size={30} />
					)}
				</button>
			</div>
		</div>
	)
}

export default SearchInputWithVoice
