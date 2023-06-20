import React from 'react'

function FileSelectInput({ type, accept, name, placeholder, onChange, style }) {
  return (
    <div className="input_container" style={style ? style : {}}>
      <input type={type} accept={accept} name={name} placeholder={placeholder} onChange={onChange} />
    </div>
  )
}

export default FileSelectInput
