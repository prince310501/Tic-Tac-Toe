import React from 'react'
import { Button } from 'reactstrap'
const Square = (props) => {
    return (
        <Button className="Square" onClick={props.onTouch} color="dark" outline> {props.value} </Button>
    )
}

export default Square
