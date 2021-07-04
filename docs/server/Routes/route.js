const express=require('express')
const route=express.Router()
const User=require('../models/User')
const Board=require('../models/Board')
const mongoose=require('mongoose')

route.get('/credentials',async(req,res)=>{
    const {channel}=req.query
    const boardFound=await Board.findOne({gameId:channel})
    if(boardFound){
        const users=await User.find({boardId:boardFound._id})
        if(users.length>1){
            res.json({msg:'Board is full'})
        }
        else if(users.length===0){
            res.json({info:{boardId:boardFound._id,userIsX:true}})
        }
        else{
            const isX=!users[0].isX
            res.json({info:{boardId:boardFound._id,userIsX:isX}})
        }
    }
    else{
        const newBoard=new Board({gameId:channel})
        const board=await newBoard.save()
        res.json({info:{boardId:board._id,userIsX:true}})
    }

})

module.exports=route