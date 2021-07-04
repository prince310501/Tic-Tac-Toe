const express=require('express')
const mongoose=require('mongoose')
const Board=require('./Board')

const User=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    socketId:{
        type:String,
        unique:true,
        required:true
    },
    isX:{
        type:Boolean,
        required:true
    },
    boardId:{
        type:mongoose.Types.ObjectId,
        ref:"Board"
    }
})

module.exports=mongoose.model('User',User)