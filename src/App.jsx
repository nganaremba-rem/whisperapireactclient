import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { MdClear, MdKeyboardVoice } from 'react-icons/md'
import Select from 'react-select'
import useAudioRecorder from './hooks/useAudioRecorder'
import { FaStopCircle } from 'react-icons/fa'

const modelOptions = [
  {
    label: 'Tiny [39MB 1GB-VRAM Speed: 32x]',
    value: 'tiny',
  },
  {
    label: 'Base [74MB 1GB-VRAM Speed: 16x]',
    value: 'base',
  },
  {
    label: 'Small [244MB 2GB-VRAM Speed: 6x]',
    value: 'small',
  },
  {
    label: 'Medium [769MB 5GB-VRAM Speed: 2x]',
    value: 'medium',
  },
  {
    label: 'Large [1550MB 10GB-VRAM Speed: 1x]',
    value: 'large',
  },
]

export default function App() {
  const [searchText, setSearchText] = useState('')
  const { audioBlob, isRecording, recordNow } = useAudioRecorder()
  const [language, setLanguage] = useState('Japanese')
  const [model, setModel] = useState('base')
  const [error, setError] = useState('')

  const { mutate, isPending } = useMutation({
    mutationKey: ['postAudio'],
    mutationFn: (myFormData) => {
      return axios({
        method: 'POST',
        url: '/api/transcribe',
        data: myFormData,
      })
        .then((res) => {
          setError('')
          return res?.data?.text
        })
        .catch((err) => {
          throw new Error(err)
        })
    },
    onSuccess: (data) => {
      setSearchText(data)
    },
    onError: (err) => {
      console.log(err.stack)
      setError(err.message)
    },
  })

  useEffect(() => {
    if (audioBlob) {
      const myFormData = new FormData()
      myFormData.append('audioToTranscribe', audioBlob)
      myFormData.append('language', language || 'Japanese')
      myFormData.append('model', model || 'base')

      mutate(myFormData)
    }
  }, [audioBlob])

  const colourStyles = {
    control: (styles) => ({ ...styles, backgroundColor: 'rgb(26, 32, 44)' }),
    option: (styles, { isDisabled, isFocused, isSelected }) => {
      return {
        ...styles,
        backgroundColor: isDisabled
          ? undefined
          : isSelected
          ? 'rgb(3, 102, 214)' // Change selected background color to bg-sky-600 in RGB
          : isFocused
          ? 'rgb(31, 41, 55)'
          : undefined,
        color: isDisabled
          ? 'rgb(204, 204, 204)'
          : isSelected
          ? 'white' // Change text color for selected to dark background color
          : 'rgb(255, 255, 255)', // Change text color to white
        cursor: isDisabled ? 'not-allowed' : 'default',

        ':active': {
          ...styles[':active'],
          backgroundColor: !isDisabled
            ? isSelected
              ? 'rgb(3, 102, 214)' // Change active background color to bg-sky-600 in RGB
              : 'rgb(31, 41, 55)'
            : undefined,
        },
      }
    },
    menu: (styles) => ({ ...styles, backgroundColor: 'rgb(26, 32, 44)' }),
    input: (styles) => ({ ...styles }),
    placeholder: (styles) => ({ ...styles, color: 'rgb(204, 204, 204)' }),
    singleValue: (styles) => ({ ...styles, color: 'rgb(255, 255, 255)' }), // Change text color for selected when closed
  }

  return (
    <>
      <div className='min-h-[100svh] bg-gray-900 sm:bg-gray-950 text-slate-200 flex flex-col sm:items-center '>
        <div className='sm:max-w-[40rem] my-5 sm:shadow-md sm:bg-gray-900 p-6 sm:p-10 rounded-xl mt-5'>
          <h1 className='text-4xl font-bold text-center pb-16'>
            Voice to Text Transcription
          </h1>
          <div className='flex w-full space-y-10 sm:w-max flex-col  sm:justify-center  gap-3'>
            <div className='grid space-y-5 sm:space-y-0 sm:grid-cols-[1fr_368px] sm:gap-5 sm:items-center'>
              <label htmlFor='language'>Language</label>
              <div className='flex items-center'>
                <button
                  onClick={() => setLanguage('Japanese')}
                  className={`flex-1 ${
                    language === 'Japanese' ? 'bg-sky-600' : 'bg-gray-700'
                  } font-bold tracking-wide rounded p-2`}
                >
                  日本語
                </button>
                <button
                  onClick={() => setLanguage('English')}
                  className={`flex-1 ${
                    language === 'English' ? 'bg-sky-600' : 'bg-gray-700'
                  } tracking-wide rounded p-2`}
                >
                  English
                </button>
              </div>
            </div>
            <div className='grid sm:grid-cols-[1fr_368px] sm:gap-5 sm:items-center sm:justify-center'>
              <label htmlFor='model'>Model</label>
              <Select
                styles={colourStyles}
                onChange={(option) => {
                  setModel(option?.value)
                }}
                options={modelOptions}
                defaultValue={() => {
                  return modelOptions.find((option) => option.value === model)
                }}
              />
            </div>
          </div>

          <div
            className={`${
              error !== '' && !isRecording ? 'visible' : 'invisible'
            } py-6 text-red-400 font-bold tracking-wide`}
          >
            {error || 'Error'}
          </div>

          <div className=' bg-gray-800 mb-5 ring-gray-200 focus-within:ring-sky-600 pointer-events-none px-3 py-2 flex w-full items-center rounded-lg  ring-2 '>
            <div>
              <FaSearch size={20} className='text-slate-400' />
            </div>
            <input
              value={
                isPending
                  ? 'Please wait...'
                  : isRecording
                  ? 'Recording...'
                  : searchText
              }
              className={`bg-gray-800 ${
                (isRecording || isPending) && 'italic'
              } w-full min-w-0 px-3 pointer-events-auto  outline-none focus:ring-cyan-400 text-xl`}
              type='text'
              name='search'
              id='search'
              readOnly={isPending || isRecording}
              onChange={(e) => {
                setSearchText(e.target.value)
              }}
            />
            <button
              onClick={() => {
                if (!searchText) return
                setSearchText('')
              }}
              className={`${
                !searchText ? 'invisible' : 'visible'
              } border-r pointer-events-auto border-r-slate-600 p-1 hover:bg-gray-900`}
            >
              <MdClear size={20} />
            </button>

            <button
              onClick={recordNow}
              className={` ${
                isRecording
                  ? 'bg-red-600 text-white  animate-my_pulse  '
                  : 'bg-transparent text-slate-300 bg-gray-700'
              } cursor-pointer active:bg-gray-900  pointer-events-auto ml-2  active:text-slate-200 p-2  rounded-full`}
            >
              {isRecording ? (
                <FaStopCircle size={30} />
              ) : (
                <MdKeyboardVoice size={30} />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
