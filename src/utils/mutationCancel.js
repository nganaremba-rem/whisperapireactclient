import axios from 'axios'

export const cancelPreviousMutation = ({ cancelTokenSourceRef }) => {
	if (cancelTokenSourceRef.current) {
		cancelTokenSourceRef.current.cancel('Previous mutation canceled')
		// Create a new CancelToken source for the next request
		cancelTokenSourceRef.current = axios.CancelToken.source()
	}
}
