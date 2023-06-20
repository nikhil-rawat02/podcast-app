import React from 'react';
import './index.css';
function index({ type, state, setState, placeholder, required, name, accept, style, inputStyle }) {

  return (
    <div className='input_container' style={style ? style : {}}>
      <input
        type={type ? type : ""}
        value={state ? state : ""}
        onChange={(e) => setState(e.target.value)}
        placeholder={placeholder ? placeholder : ""}
        required={required ? required : ""}
        name={name ? name : ""}
        accept={accept ? accept : ""}
        style={inputStyle ? inputStyle : {}}
      />
    </div>
  )
}

export default index
