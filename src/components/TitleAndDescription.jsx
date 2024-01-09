import React from 'react'

function TitleAndDescription({ title, desc }) {
	return (
		<div
			title={desc}
			className='text-center text-rose-600 text-lg font-extrabold tracking-wide'
		>
			{title}
		</div>
	)
}

export default TitleAndDescription
