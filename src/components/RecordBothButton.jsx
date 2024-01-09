function RecordBothButton({ recordBoth, endpointIsRecording, isRecording }) {
	return (
		<button
			type='button'
			onClick={recordBoth}
			className='cursor-pointer min-w-[14rem] bg-red-600 text-white text-lg active:bg-gray-900  pointer-events-auto active:text-slate-200 px-4 py-3  rounded-lg font-bold'
		>
			<div
				className={`${
					endpointIsRecording && isRecording && 'animate-my_pulse'
				} `}
			>
				{endpointIsRecording && isRecording
					? 'Stop Recording (Both)'
					: 'Start Recording (Both)'}
			</div>
		</button>
	)
}

export default RecordBothButton
