import React from 'react'
import { Button, Form, FormGroup, Label, Input, FormText } from 'reactstrap';

const Home = (props) => {
    // console.log(props)
    const msg=props.location.state
    const headerStyle={
        margin: "30px auto 15px",
        fontWeight:'bold',
        fontSize:'40px',
        textDecoration:'underline' 
    }
    

    const handleSubmit=(e)=>{
        e.preventDefault()
        const channel=document.getElementById('channel').value
        const name=document.getElementById('name').value
        props.history.push({pathname:'/game',state:{channel,name}})
    }
    return (
        <div className="App">
            
            {/* heading */}
            <h1 className="center" style={headerStyle}>
                Tic-Tac-Toe   <span className="glyphicon glyphicon-play-circle"></span>
            </h1>
            <p style={{fontSize:'large'}}>Play Online With Friends</p>

            <br/>
            <br/>
            {/* form */}
            <Form onSubmit={handleSubmit}>
            <div style={{textAlign:'left',maxWidth:'40%',margin:'15px auto'}}>
                <FormGroup>
                    <Label style={{fontSize:'medium'}} for="exampleEmail">Nickname</Label>
                    <Input bsSize="lg" type="text" maxLength="30"  id="name" placeholder="Nickname" required/>
                </FormGroup>
                <br/>
                <FormGroup>
                    <Label style={{fontSize:'medium'}} for="examplePassword">Channel No(1-100)</Label>
                    <Input bsSize="lg" type="number" min="1" max="100"  id="channel" placeholder="Channel No" required/>
                </FormGroup>
                <br/>
            </div>
                <FormGroup>
                    <Input value="Enter" type="submit" bsSize="lg" className="btn btn-primary btn-lg " style={{maxWidth:'90px',border:'none'}} />
                </FormGroup>
            </Form>

            {/* msg to user */}
            <div className="text-warning" style={{maxWidth:'40%',margin:'30px auto',fontSize:'medium'}}>
                {msg}
            </div>

        </div>
    )
}

export default Home
