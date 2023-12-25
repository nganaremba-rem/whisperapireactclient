export const cancelPreviousMutation = ({ cancelTokenSourceRef, axios }) => {
	if (cancelTokenSourceRef.current) {
		cancelTokenSourceRef.current.cancel('Previous mutation canceled')
		// Create a new CancelToken source for the next request
		cancelTokenSourceRef.current = axios.CancelToken.source()
	}
}
