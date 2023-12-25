import React from 'react'

function ErrorText({ error, isRecording }) {
	return (
		<div
			className={`${
				error !== '' && !isRecording ? 'visible' : 'invisible'
			} py-6 text-red-400 font-bold tracking-wide`}
		>
			{error || 'Error'}
		</div>
	)
}

export default ErrorText
