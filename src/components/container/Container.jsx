import React from 'react'

function Container({children}) {
  return <div className='w-full max-w-7xl mx-auto px-4'>
    {/* Render any component/content passed inside Container */}
    {children} </div>;
}

export default Container
