import React from 'react'

function ErrorText({ error, isRecording }) {
	return (
		<div
			className={`${
				error !== '' && !isRecording ? 'block' : 'hidden'
			} py-2 text-red-400 font-bold tracking-wide`}
		>
			{error || 'Error'}
		</div>
	)
}

export default ErrorText
