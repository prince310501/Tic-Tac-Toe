import React,{useState,useEffect} from 'react'
import Square from './Square'
const Board = () => {
    const initialSquares=new Array(9).fill(null)
    const[squares,setsquares]=useState(initialSquares)
    const[isX,setisX]=useState(true)

    const winner=()=>{
        const winningcomb=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
        for(const comb of winningcomb)
        {
            const [a,b,c]=comb
            if(squares[a] && squares[b]===squares[a] && squares[a]===squares[c])
                return squares[a]
        }
        return null
    }

    const Winner=winner()
    useEffect(() => {
        if(winner())
            alert(`Winner is ${winner()}`)
        
    }, [Winner])

    const handleClick=(i)=>{
        const filled=squares[i]
        const Winner=winner()
        
        if(filled || Winner)
            return
        
        const newSquares=[...squares]
        newSquares[i]=isX ? 'X' : 'O';
        setsquares(newSquares)
        setisX(!isX)
        
    }
    const chance=winner()? `Winner is : ${winner()} ` : `Next Chance : ${isX ? 'X' : 'O'} `

    const renderSquare=(i)=>{
        return(
            <Square onTouch={()=>handleClick(i)} value={squares[i]} />
        )
    }

    return (
        <div className="Board">
        <div className="chance">{chance}</div>
         <div className="Board-row">{renderSquare(0)}{renderSquare(1)}{renderSquare(2)}</div>    
         <div className="Board-row">{renderSquare(3)}{renderSquare(4)}{renderSquare(5)}</div> 
         <div className="Board-row">{renderSquare(6)}{renderSquare(7)}{renderSquare(8)}</div> 
        </div>
    )
}

export default Board
