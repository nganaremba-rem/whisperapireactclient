import { cancelPreviousMutation } from './mutationCancel'

export const makeFormDataAndMutate = ({
	model = null,
	audioBlob,
	language = 'ja',
	isPending,
	cancelTokenSourceRef,
	mutate,
}) => {
	const myFormData = new FormData()
	if (model) {
		myFormData.append('model', model || 'base')
	}
	myFormData.append('file', audioBlob)
	myFormData.append('language', language)

	if (isPending) {
		cancelPreviousMutation({ cancelTokenSourceRef })
	}
	mutate(myFormData)
}
