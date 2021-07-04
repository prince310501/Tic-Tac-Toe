const express=require('express')
const mongoose=require('mongoose')


const Board=new mongoose.Schema({
    isX:{
        type:Boolean,
        default:true
    },
    squares:{
        type:[String],
        default:new Array(9).fill(null)
    },
    gameId:{
        type:Number,
        unique:true,
        required:true
    }
})

module.exports=mongoose.model('Board',Board)