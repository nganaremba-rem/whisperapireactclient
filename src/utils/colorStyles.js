export const colourStyles = {
	control: (styles) => ({ ...styles, backgroundColor: 'rgb(26, 32, 44)' }),
	option: (styles, { isDisabled, isFocused, isSelected }) => {
		let backgroundColor
		let color
		let cursor
		let activeBackgroundColor

		if (isDisabled) {
			backgroundColor = undefined
			color = 'rgb(204, 204, 204)'
			cursor = 'not-allowed'
			activeBackgroundColor = undefined
		} else {
			if (isSelected) {
				backgroundColor = 'rgb(3, 102, 214)'
			} else if (isFocused) {
				backgroundColor = 'rgb(31, 41, 55)'
			} else {
				backgroundColor = undefined
			}

			color = isSelected ? 'white' : 'rgb(255, 255, 255)'
			cursor = 'default'
			activeBackgroundColor = isSelected
				? 'rgb(3, 102, 214)'
				: 'rgb(31, 41, 55)'
		}

		return {
			...styles,
			backgroundColor,
			color,
			cursor,

			':active': {
				...styles[':active'],
				backgroundColor: activeBackgroundColor,
			},
		}
	},
	menu: (styles) => ({ ...styles, backgroundColor: 'rgb(26, 32, 44)' }),
	input: (styles) => ({ ...styles }),
	placeholder: (styles) => ({ ...styles, color: 'rgb(204, 204, 204)' }),
	singleValue: (styles) => ({ ...styles, color: 'rgb(255, 255, 255)' }), // Change text color for selected when closed
}
