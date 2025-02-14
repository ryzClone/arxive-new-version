import React from "react";
import '../style/Success.css'
export default function Success(props){

    const successStyle = {
        backgroundColor: props.background ? '#c8f1cc' : 'red',
        color: props.background ? 'black' : 'white',
      };

    return(
        <div className="Success" style={successStyle}>
            {props.title}
        </div>
    )
}