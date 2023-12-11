import { useMutation } from '@tanstack/react-query'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { FaSearch } from 'react-icons/fa'
import { MdClear, MdKeyboardVoice } from 'react-icons/md'
import Select from 'react-select'
import useAudioRecorder from './hooks/useAudioRecorder'

export default function App() {
  const [searchText, setSearchText] = useState('')
  const { audioBlob, isRecording, recordNow } = useAudioRecorder()
  const [language, setLanguage] = useState('Japanese')
  const [model, setModel] = useState('base')

  const { mutate, isPending } = useMutation({
    mutationKey: ['postAudio'],
    mutationFn: (myFormData) => {
      return axios({
        method: 'POST',
        url: 'http://139.59.254.243:3000/api/transcribe',
        data: myFormData,
      })
        .then((res) => {
          return res?.data?.text
        })
        .catch((err) => err)
    },
    onSuccess: (data) => {
      setSearchText(data)
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
      <div className='min-h-[100svh] bg-gray-900 text-slate-200 flex flex-col justify-center items-center '>
        <h1 className='text-4xl font-bold py-5 my-10'>
          Voice to Text Transcription
        </h1>
        <div className='flex items-center gap-2'>
          <div className='flex items-center space-x-2'>
            <label htmlFor='language'>Language</label>
            <Select
              styles={colourStyles}
              onChange={(option) => {
                console.log(option)
                setLanguage(option?.value)
              }}
              options={[
                {
                  label: 'Japanese',
                  value: 'Japanese',
                },
                {
                  label: 'English',
                  value: 'English',
                },
              ]}
            />
          </div>
          <div className='flex items-center space-x-2'>
            <label htmlFor='model'>Model</label>
            <Select
              styles={colourStyles}
              onChange={(option) => {
                setModel(option?.value)
              }}
              className='min-w-[24rem]'
              options={[
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
              ]}
            />
          </div>
        </div>

        <div className=' bg-gray-800 my-14 ring-gray-200 focus-within:ring-sky-600 pointer-events-none px-3 py-2 flex items-center rounded-lg  ring-2 '>
          <FaSearch size={19} className='text-slate-400' />
          <input
            value={isPending ? 'Please wait...' : searchText}
            className='bg-gray-800 px-3 pointer-events-auto  outline-none focus:ring-cyan-400 text-xl'
            type='text'
            name='search'
            id='search'
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
                : 'bg-transparent text-red-600'
            } cursor-pointer active:bg-gray-900  pointer-events-auto ml-2  active:text-slate-200 p-2  rounded-full`}
          >
            <MdKeyboardVoice size={30} />
          </button>
        </div>
      </div>
    </>
  )
}
