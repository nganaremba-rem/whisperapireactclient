import Select from 'react-select'
import { modelOptions } from '../constants/modelOptions'

function ModelSelection({ setModel, model }) {
	return (
		<div className='grid sm:grid-cols-[1fr_368px] sm:gap-5 sm:items-center sm:justify-center'>
			<label htmlFor='model'>Model</label>
			<Select
				// styles={colourStyles}
				onChange={(option) => {
					setModel(option?.value)
				}}
				options={modelOptions}
				defaultValue={() => {
					return modelOptions.find((option) => option.value === model)
				}}
			/>
		</div>
	)
}

export default ModelSelection
