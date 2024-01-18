export function LanguageSelection({ setLanguage, language }) {
	return (
		<>
			<label htmlFor='language'>Language</label>
			<div className='flex items-center'>
				<button
					type='button'
					onClick={() => setLanguage('ja')}
					className={`flex-1 ${
						language === 'ja' ? 'bg-sky-600 text-white' : 'bg-slate-300 '
					} font-bold tracking-wide rounded p-2 `}
				>
					日本語
				</button>
				<button
					type='button'
					onClick={() => setLanguage('en')}
					className={`flex-1 ${
						language === 'en' ? 'bg-sky-600 text-white' : 'bg-slate-300'
					} tracking-wide rounded p-2`}
				>
					English
				</button>
			</div>
		</>
	)
}
