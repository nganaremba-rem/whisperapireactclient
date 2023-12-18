import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useRef, useState } from 'react'
import { FaSearch, FaStopCircle } from 'react-icons/fa'
import { MdClear, MdKeyboardVoice } from 'react-icons/md'
import useSound from 'use-sound'
import Select from 'react-select'
import useAudioRecorder from './hooks/useAudioRecorder'
import startSound from '/src/assets/audio/start.mp3'
import stopSound from '/src/assets/audio/stop.mp3'

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
  const [endpointSearchText, setEndpointSearchText] = useState('')
  const { audioBlob, isRecording, recordNow } = useAudioRecorder()
  const {
    audioBlob: endpointAudioBlob,
    isRecording: endpointIsRecording,
    recordNow: endpointRecordNow,
  } = useAudioRecorder()
  const [language, setLanguage] = useState('ja')
  const [endpointLanguage, setEndpointLanguage] = useState('ja')
  const [model, setModel] = useState('base')
  const [error, setError] = useState('')
  const [endpointError, setEndpointError] = useState('')
  const [playStartSound, { stop: stopStartSound }] = useSound(startSound)
  const [playStopSound, { stop: stopStopSound }] = useSound(stopSound)

  const cancelTokenSourceRef = useRef(axios.CancelToken.source())
  const endPointCancelTokenSourceRef = useRef(axios.CancelToken.source())

  const { mutate, isPending } = useMutation({
    mutationKey: ['postAudio'],
    mutationFn: async (myFormData) => {
      try {
        let endpoint = '/api/transcribe'
        //  endpoint = '/api/transcribe/whisperapi'

        const { data } = await axios.post(endpoint, myFormData, {
          cancelToken: cancelTokenSourceRef.current.token,
        })
        setError('')
        return data?.text
      } catch (err) {
        // Check if the error is due to cancellation
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message)
        } else {
          throw new Error(err)
        }
      }
    },
    onSuccess: (data) => {
      setSearchText(data)
    },
    onError: (err) => {
      setError(err.message)
    },
  })

  const { mutate: endPointMutate, isPending: endpointIsPending } = useMutation({
    mutationKey: ['endpointPostAudio'],
    mutationFn: async (myFormData) => {
      try {
        let endpoint = '/api/transcribe/whisperapi'

        const { data } = await axios.post(endpoint, myFormData, {
          cancelToken: cancelTokenSourceRef.current.token,
          headers: {
            Authorization: 'Bearer ' + import.meta.env.VITE_WHISPER_API_KEY,
          },
        })
        setEndpointError('')
        return data?.text
      } catch (err) {
        // Check if the error is due to cancellation
        if (axios.isCancel(err)) {
          console.log('Request canceled:', err.message)
        } else {
          throw new Error(err)
        }
      }
    },
    onSuccess: (data) => {
      setEndpointSearchText(data)
    },
    onError: (err) => {
      setEndpointError(err.message)
    },
  })

  useEffect(() => {
    if (audioBlob) {
      const myFormData = new FormData()
      myFormData.append('model', model || 'base')
      myFormData.append('file', audioBlob)
      myFormData.append('language', language || 'ja')

      if (isPending) {
        cancelPreviousMutation()
      }
      mutate(myFormData)
    }
  }, [audioBlob])

  useEffect(() => {
    if (endpointAudioBlob) {
      const myFormData = new FormData()
      myFormData.append('file', endpointAudioBlob)
      myFormData.append('language', endpointLanguage || 'ja')

      if (endpointIsPending) {
        endPointCancelPreviousMutation()
      }
      endPointMutate(myFormData)
    }
  }, [endpointAudioBlob])

  useEffect(() => {
    setError('')
  }, [isRecording])

  useEffect(() => {
    setEndpointError('')
  }, [endpointIsRecording])

  const cancelPreviousMutation = () => {
    if (cancelTokenSourceRef.current) {
      cancelTokenSourceRef.current.cancel('Previous mutation canceled')
      // Create a new CancelToken source for the next request
      cancelTokenSourceRef.current = axios.CancelToken.source()
    }
  }
  const endPointCancelPreviousMutation = () => {
    if (endPointCancelTokenSourceRef.current) {
      endPointCancelTokenSourceRef.current.cancel('Previous mutation canceled')
      // Create a new CancelToken source for the next request
      endPointCancelTokenSourceRef.current = axios.CancelToken.source()
    }
  }

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
            <div
              title='Description: This server is configured with a local installation of Whisper API on a cloud server. It handles transcription processes, serving the resulting text.
Implementation: Utilizes the Whisper API installed on the cloud server.'
              className='text-center text-lg font-extrabold tracking-wide'
            >
              Whisper Server (Local Whisper Server)
            </div>

            <div className='grid space-y-5 sm:space-y-0 sm:grid-cols-[1fr_368px] sm:gap-5 sm:items-center'>
              <label htmlFor='language'>Language</label>
              <div className='flex items-center'>
                <button
                  onClick={() => setLanguage('ja')}
                  className={`flex-1 ${
                    language === 'ja' ? 'bg-sky-600' : 'bg-gray-700'
                  } font-bold tracking-wide rounded p-2`}
                >
                  日本語
                </button>
                <button
                  onClick={() => setLanguage('en')}
                  className={`flex-1 ${
                    language === 'en' ? 'bg-sky-600' : 'bg-gray-700'
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
              disabled={isRecording || isPending}
              onClick={() => {
                if (!searchText) return
                setSearchText('')
              }}
              className={`${
                !searchText || isPending || isRecording
                  ? 'invisible'
                  : 'visible'
              } border-r pointer-events-auto border-r-slate-600 p-1 hover:bg-gray-900`}
            >
              <MdClear size={20} />
            </button>

            <button
              onClick={() => {
                if (isRecording) {
                  stopStartSound()
                  playStopSound()
                } else {
                  stopStopSound()
                  playStartSound()
                }
                recordNow()
              }}
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
        <div className='sm:max-w-[40rem] my-5 sm:shadow-md sm:bg-gray-900 p-6 sm:p-10 rounded-xl mt-5'>
          <div className='flex w-full space-y-10 sm:w-max flex-col  sm:justify-center  gap-3'>
            <div
              title={`Description: This server is acquired from whisperapi.com, providing an endpoint. A backend is required to process data, which is sent to the server's endpoint using an API key.
Implementation: Involves setting up a backend to call the endpoint at whisperapi.com with the necessary data and API key.`}
              className='text-center text-lg font-extrabold tracking-wide'
            >
              Whisper Server (Whisper Endpoint Server)
            </div>

            <div className='grid space-y-5 sm:space-y-0 sm:grid-cols-[1fr_368px] sm:gap-5 sm:items-center'>
              <label htmlFor='language'>Language</label>
              <div className='flex items-center'>
                <button
                  onClick={() => setEndpointLanguage('ja')}
                  className={`flex-1 ${
                    endpointLanguage === 'ja' ? 'bg-sky-600' : 'bg-gray-700'
                  } font-bold tracking-wide rounded p-2`}
                >
                  日本語
                </button>
                <button
                  onClick={() => setEndpointLanguage('en')}
                  className={`flex-1 ${
                    endpointLanguage === 'en' ? 'bg-sky-600' : 'bg-gray-700'
                  } tracking-wide rounded p-2`}
                >
                  English
                </button>
              </div>
            </div>
          </div>

          <div
            className={`${
              endpointError !== '' && !endpointIsRecording
                ? 'visible'
                : 'invisible'
            } py-6 text-red-400 font-bold tracking-wide`}
          >
            {endpointError || 'Error'}
          </div>

          <div className=' bg-gray-800 mb-5 ring-gray-200 focus-within:ring-sky-600 pointer-events-none px-3 py-2 flex w-full items-center rounded-lg  ring-2 '>
            <div>
              <FaSearch size={20} className='text-slate-400' />
            </div>
            <input
              value={
                endpointIsPending
                  ? 'Please wait...'
                  : endpointIsRecording
                  ? 'Recording...'
                  : endpointSearchText
              }
              className={`bg-gray-800 ${
                (endpointIsRecording || endpointIsRecording) && 'italic'
              } w-full min-w-0 px-3 pointer-events-auto  outline-none focus:ring-cyan-400 text-xl`}
              type='text'
              name='search'
              id='search'
              readOnly={endpointIsPending || endpointIsRecording}
              onChange={(e) => {
                setEndpointSearchText(e.target.value)
              }}
            />
            <button
              disabled={endpointIsRecording || endpointIsPending}
              onClick={() => {
                if (!endpointSearchText) return
                setEndpointSearchText('')
              }}
              className={`${
                !endpointSearchText || endpointIsPending || endpointIsRecording
                  ? 'invisible'
                  : 'visible'
              } border-r pointer-events-auto border-r-slate-600 p-1 hover:bg-gray-900`}
            >
              <MdClear size={20} />
            </button>

            <button
              onClick={() => {
                if (endpointIsRecording) {
                  stopStartSound()
                  playStopSound()
                } else {
                  stopStopSound()
                  playStartSound()
                }
                endpointRecordNow()
              }}
              className={` ${
                endpointIsRecording
                  ? 'bg-red-600 text-white  animate-my_pulse  '
                  : 'bg-transparent text-slate-300 bg-gray-700'
              } cursor-pointer active:bg-gray-900  pointer-events-auto ml-2  active:text-slate-200 p-2  rounded-full`}
            >
              {endpointIsRecording ? (
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
