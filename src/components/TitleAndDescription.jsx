import React from 'react'

export function TitleAndDescription({ title, desc, color }) {
	return (
		<div
			title={desc}
			className={`text-center ${color} text-lg font-extrabold tracking-wide`}
		>
			{title}
		</div>
	)
}
