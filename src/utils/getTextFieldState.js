export const getTextFieldState = ({ isPending, isRecording, searchText }) => {
	if (isPending) {
		return 'Please wait...'
	}
	if (isRecording) {
		return 'Recording...'
	}
	return searchText
}
