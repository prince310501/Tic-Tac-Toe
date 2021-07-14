const express=require('express')
const http=require('http')
const cors=require('cors')
const socketio=require('socket.io')
const mongoose=require('mongoose')
const route=require('./Routes/route')
const User=require('./models/User')
const Board=require('./models/Board')

require('dotenv/config')

// const PORT=5000
const app=express()
const server=http.createServer(app)
const io=socketio(server,{
    cors:{
        origin:process.env.FRONT_URI,
        methods:["GET","POST","PUT","DELETE"],
        credentials:true
    }
})

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors({
    origin:process.env.FRONT_URI,
    methods:["GET","POST","PUT","DELETE"],
    credentials:true 
})) 
app.use('/',route)
// console.log(process.env.URI)
mongoose.connect(process.env.URI,{ useNewUrlParser: true, useUnifiedTopology: true ,useCreateIndex:true, useFindAndModify:false},(err)=>{
    if(err)
        console.log(err)
    else
        console.log('connected to db')    
})

io.on('connection',(socket)=>{
    console.log('connected')
    socket.on('get-data',async(userData)=>{
        
        socket.join(userData.channel)

        await userJoin(userData,socket.id)
        io.to(userData.channel).emit('giveOwnSocketId') 

        socket.on('takeSocketId',async(sok)=>{
            const opp=await getOpponent(sok,userData)
            socket.emit('opponent',opp)
        })

        const boardData=await squaresAndx(userData.userCredentials.boardId)
        io.to(userData.channel).emit('getSquaresAndx',boardData,true)

        socket.on('sqClicked',async(index)=>{
            const ans=await changeSquares(index,socket.id,userData)
            if(ans.status==='noChange'){
                io.to(userData.channel).emit('getSquaresAndx',ans.board,false)
            }
            else{
                io.to(userData.channel).emit('getSquaresAndx',ans.board,true)
            }
        })

        socket.on('reset',async()=>{
            const updatedBoard= await resetBoard(userData.userCredentials.boardId)
            io.to(userData.channel).emit('getSquaresAndx',updatedBoard,true)
        })

    })


    socket.on('disconnect',async()=>{
        const deletedUser=await User.findOneAndRemove({socketId:socket.id})
        const board=await Board.findById(deletedUser.boardId)
        io.to(String(board.gameId)).emit('giveOwnSocketId')
        console.log('disconnected')
    }) 
})

const userJoin=async(userData,socketId)=>{
    const newUser =new User({
      name: userData.name,
      socketId,
      isX: userData.userCredentials.userIsX,
      boardId: userData.userCredentials.boardId,
    })

    const user=await newUser.save()
}

const getOpponent=async(sokid,userData)=>{
    const users=await User.find({$and:[{boardId:userData.userCredentials.boardId},{socketId:{$ne:sokid}}]})
    if(users.length===0){
        return 'None'
    }
    else{
        return users[0].name
    }
}

const squaresAndx=async(id)=>{
    const board=await Board.findById(id)
    return board
}

const changeSquares=async(index,socketid,userdata)=>{
    const user=await User.findOne({socketId:socketid})    
    const board=await Board.findById(userdata.userCredentials.boardId)
    var win=0
    const sq=board.squares
    const winningcomb=[[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]
    for(const comb of winningcomb) 
    {
        const [a,b,c]=comb
        if(sq[a] && sq[b]===sq[a] && sq[a]===sq[c])
            win=1
    }
    
    if(win===1 || sq[index]!==null || user.isX!==board.isX){
        return {board,status:'noChange'}
    }
    else{
        board.squares[index] = board.isX===true ? "X" : "O"
        board.isX = !board.isX
        board.markModified('squares')
        const savedBoard= await board.save()
        
        return {board:savedBoard,status:'done'}
    }

}

const resetBoard=async(id)=>{
    const newSq=new Array(9).fill(null)
    const board=await Board.findByIdAndUpdate(id,{squares:newSq,isX:true},{new:true})
    return board
}

server.listen(process.env.PORT || 5000,()=>console.log(`connected at port server`))