import React from 'react'
import { AiOutlineClose } from 'react-icons/ai';
import Button from '../Button/Button';
import './ConfirmUpdate.css'
function ConfirmUpdate({ title, submitCallback, closeConfirmCallBack, buttonText }) {

    return (
        <div className="confirm_update_container">
            <div className="confirm_update">
                <div className="confirm_update_navbar">
                    <AiOutlineClose cursor={"pointer"} onClick={closeConfirmCallBack} />
                </div>
                <div className="confirm_update_main">
                    <h4>{title}</h4>
                    <Button callback={submitCallback} buttonText={buttonText} type="submit" />
                </div>
            </div>

        </div>
    )
}

export default ConfirmUpdate
