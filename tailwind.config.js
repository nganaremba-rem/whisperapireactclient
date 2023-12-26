/** @type {import('tailwindcss').Config} */
export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	theme: {
		extend: {
			keyframes: {
				wiggle: {
					'0%, 100%': { transform: 'rotate(-5deg)' },
					'50%': { transform: 'rotate(5deg)' },
				},
				my_pulse: {
					'0%': { transform: 'scale(1)', opacity: 0.5 },
					'50%': { transform: 'scale(0.8)', opacity: 1 },
					'100%': { transform: 'scale(1)', opacity: 0.5 },
				},
				zoomIn: {
					from: {
						transform: 'scale(1)',
					},
					to: {
						transform: 'scale(1.2)',
					},
				},
			},
			animation: {
				wiggle: 'wiggle 1s ease-in-out infinite',
				my_pulse: 'my_pulse 2s ease-in-out infinite',
				zoomIn: 'zoomIn 2s ease-out',
			},
		},
	},
	plugins: [],
}
