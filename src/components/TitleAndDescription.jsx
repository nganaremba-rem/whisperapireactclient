import React from 'react'

function TitleAndDescription({ title, desc }) {
	return (
		<div
			title={desc}
			className='text-center text-lg font-extrabold tracking-wide'
		>
			Whisper Server ({title})
		</div>
	)
}

export default TitleAndDescription
