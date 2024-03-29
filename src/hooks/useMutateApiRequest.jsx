import { useMutation } from '@tanstack/react-query'
import axios from 'axios'

export function useMutateApiRequest({
	mutationKey,
	url,
	cancelTokenSourceRef,
	setError,
	setData,
}) {
	return useMutation({
		mutationKey: [mutationKey],
		mutationFn: async (myFormData) => {
			try {
				const { data } = await axios.post(url, myFormData, {
					cancelToken: cancelTokenSourceRef.current.token,
				})
				setError('')
				return data?.text
			} catch (err) {
				// Check if the error is due to cancellation
				if (!axios.isCancel(err)) {
					throw new Error(err)
				}
			}
		},
		onSuccess: (data) => {
			setData(data)
		},
		onError: (err) => {
			setError(err.message)
		},
	})
}
