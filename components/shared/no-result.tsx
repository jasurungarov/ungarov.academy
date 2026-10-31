import Image from 'next/image'
import React from 'react'

interface Props {
  title: string
  description: string
}
function NoResult({ title, description }: Props) {
  return (
    <div className='mt-10 flex w-full flex-col items-center justify-center'>
      <Image
      src={'/assets/not-found.png'}
      alt='No result illustration'
      width={470}
      height={400}
      className='block object-contain'
      />
      <h2 className='font-space-grotesk text-2xl font-bold'>{title}</h2>
      <p className='my-3.5 max-w-md text-center'>{description}</p>
    </div>
  )
}

export default NoResult