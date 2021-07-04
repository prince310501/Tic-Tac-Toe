import React,{useState,useEffect} from 'react'
import { Button } from 'reactstrap'
import {io} from 'socket.io-client'
import axios from 'axios'


const Game = (props) => {
    const [squares,setSquares]=useState(null)
    const [isX,setIsX]=useState(null)
    const [status,setStatus]=useState(null)
    const [socket,setSocket]=useState()
    const [userCredentials,setUserCredentials]=useState(null)
    const [opponent,setOpponent]=useState(null)
    const {name,channel}=props.location.state
    if(channel>100 || channel<=0 || channel===null || name===null){
        props.history.push({pathname:'/',state:'Please Enter Valid Channel No'})
    }

    const leave=()=>{
        props.history.push('/')
        // props.history.goBack()
        // <Redirect to='/'/>
    }

    useEffect(() => {
        if(props.history===null || channel===null)
            return
        axios.get(`${process.env.REACT_APP_API}/credentials?channel=${channel}`)
        .then(res=>{
            if(res.data.msg){
                props.history.push({pathname:'/',state:'Channel is Full. Join Another Channel'})
            }
            else{
                setUserCredentials(res.data.info)
                
            }
        })
        .catch(err=>console.log(err))
        return () => {
            setUserCredentials(null)
        }
    }, [])

    useEffect(()=>{
        const s=io('http://localhost:5000')
        setSocket(s)
        return ()=>{
            s.disconnect()
        }
    },[])

    useEffect(() => {
        if(socket===null || userCredentials===null || channel===null || name===null)
            return
        socket.emit('get-data',{name,userCredentials,channel})

        socket.on('giveOwnSocketId',()=>{
            socket.emit('takeSocketId',socket.id)
        })
        socket.on('opponent',opp=>{
            setOpponent(opp)
        })

        socket.on('getSquaresAndx',(resp,change)=>{
            if(change===true){
                setSquares(resp.squares)
                setIsX(resp.isX)
            }
        })
        return () => {
            socket.off('giveOwnSocketId',()=>{
                socket.emit('takeSocketId',socket)
            })
            socket.off('opponent',opp=>{
                setOpponent(opp)
            })
    
            socket.off('getSquaresAndx',(resp,change)=>{
                if(change===true){
                    setSquares(resp.squares)
                    setIsX(resp.isX)
                }
            })
        }
    }, [socket,userCredentials])


    useEffect(()=>{
        if(socket===null || userCredentials===null )
            return
        var x=document.querySelectorAll(".Square")
        x.forEach((elem,index)=>{
            elem.addEventListener('click',()=>{
                socket.emit('sqClicked',index)
            })
        })
        var x1=document.getElementById('reset')
        x1.addEventListener('click',()=>{
            socket.emit('reset')
        })
        return ()=>{
            x.forEach((elem,index)=>{
                elem.removeEventListener('click',()=>{
                    socket.emit('sqClicked',index)
                })
            })
            x1.removeEventListener('click',()=>{
                socket.emit('reset')
            })
        }
    },[socket,userCredentials])

    useEffect(()=>{
        if(squares===null)
            return
        var win=0,draw=1,winner
        
        const winningcomb=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
        for(const comb of winningcomb) 
        {
            const [a,b,c]=comb
            if(squares[a] && squares[b]===squares[a] && squares[a]===squares[c])
            {
                win=1
                winner=squares[a]
            }
        }
        squares.forEach((sq)=>{
            if(sq===null)
                draw=0
        })

        if(win===1){
            alert(`Winner is ${winner}`)
            setStatus(`Winner is ${winner}`)
        }
        else if(draw===1){
            alert('The Game ended in Draw')
            setStatus('The Game ended in Draw')
        }

        return()=>{
            setStatus(null)
        }

    },[squares])

    
   
    const headerStyle={
        margin: "30px auto",
        fontWeight:'bold',
        fontSize:'40px',
        textDecoration:'underline' 
      }
    return (
      <div className="App">
          

        {/* header  */}
        <h1 className="center" style={headerStyle}>
          Tic-Tac-Toe   <span className="glyphicon glyphicon-play-circle"></span>
        </h1>

        {/* board  */}
        <div className="Board">
        <div className=" text-primary" style={{fontSize:'18px'}}>You : {name!==null && name}</div>
        <div className="mb-4 text-primary" style={{fontSize:'18px'}}> Opponent : {opponent!==null && opponent}</div>
        <div className="chance text-primary">Your Character : {userCredentials!==null && userCredentials.userIsX?'X':'O'}</div>
        <div className="chance text-warning"> {status===null?`Now Chance : ${isX!==null && isX?'X':'O'}` : status}  </div>

        {/* board */}
         <div className="Board-row">
            <Button className="Square" color="dark" outline> {squares===null?null:squares[0]} </Button>
            <Button className="Square" color="dark" outline> {squares===null?null:squares[1]} </Button>
            <Button className="Square" color="dark" outline> {squares===null?null:squares[2]} </Button>
         </div> 
         <div className="Board-row">
            <Button className="Square" color="dark" outline> {squares===null?null:squares[3]} </Button>
            <Button className="Square" color="dark" outline> {squares===null?null:squares[4]} </Button>
            <Button className="Square" color="dark" outline> {squares===null?null:squares[5]} </Button>
         </div>    
         <div className="Board-row">
            <Button className="Square" color="dark" outline> {squares===null?null:squares[6]} </Button>
            <Button className="Square" color="dark" outline> {squares===null?null:squares[7]} </Button>
            <Button className="Square" color="dark" outline> {squares===null?null:squares[8]} </Button>
         </div> 
        </div>
        <div className="mt-5 mx-auto" style={{display:'flex',justifyContent:'space-between',maxWidth:'15%'}}>
            <Button size="lg" onClick={leave} color="primary" >Leave</Button>
            <Button size="lg" id="reset" color="primary" >Reset</Button>
        </div>
        
         
    </div>
    );
} 
 
export default Game
