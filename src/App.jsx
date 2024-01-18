import { Homepage, Old } from '@pages'
import React from 'react'
import {
	Route,
	RouterProvider,
	createBrowserRouter,
	createRoutesFromElements,
} from 'react-router-dom'

function App() {
	const router = createBrowserRouter(
		createRoutesFromElements(
			<Route path='/'>
				<Route index={true} element={<Homepage />} />
				<Route path='old' element={<Old />} />
			</Route>,
		),
	)

	return (
		<>
			<RouterProvider router={router} />
		</>
	)
}

export default App
