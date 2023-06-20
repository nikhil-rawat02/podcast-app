import React from 'react'
import './index.css'
function Button({ className, callback, buttonText, icon, type, isLoading }) {
  return (
    <button
      className={`btn ${className}`}
      onClick={callback} style={{ cursor: "pointer" }}
      type={type}
      disabled={isLoading ? true : false}
    >
      {icon &&
        icon
      }
      <span>
        {buttonText}

      </span>
    </button>
  )
}

export default Button
