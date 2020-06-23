const path=require('path')
const express=require('express')
const bodyParser = require('body-parser')
const hbs=require('hbs')
const { count } = require('console')
const fs = require('fs')
const { query } = require('express')
// import { plot, Plot } from 'nodeplotlib';


const app=express()

const port=process.env.PORT || 3000

const publicDirectoryPath=path.join(__dirname,'../public')
const viewPath=path.join(__dirname,'../templates/views')
const partialsPath=path.join(__dirname,'../templates/partials')

//setting up handlers
app.set('view engine','hbs')

//setting path for views
app.set('views',viewPath)

hbs.registerPartials(partialsPath)

//app.use is a way to customize your server
app.use(express.static(publicDirectoryPath))
app.use(bodyParser.urlencoded({
    extended: true
  }));
app.use(express.json()) 

app.get('/drawGraph', (req,res,next)=>{
    res.render('index');
})

app.post('/drawGraph',(req,res,next)=>{
    coeff = parseFloat(req.query.restitution)
    height =parseFloat( req.query.height).toFixed(2)
    console.log(coeff +"  "+height)
    u=0
    let count = 0
    diffHeights = []
    diffTimes = []
    try{
        var dataArray = require('../data.json')
    }catch(e){
        dataArray=[];
    }
    
    
    // console.log( dist)
    while(height>0){
        v = Math.sqrt(2*9.8*height)
        vf = coeff*v
        height = parseFloat((vf*vf)/(2*9.8)).toFixed(2)
        diffHeights.push(height)
        time = parseFloat(vf/(2*9.8)).toFixed(3)
        diffTimes.push(time)
        count = count +1
    }
    bounces = count
    console.log(count)
    console.log(diffHeights)
    console.log(diffTimes)
    let a ={bounces, diffHeights, diffTimes}
    dataArray.push(a)
    fs.writeFileSync('data.json',JSON.stringify(dataArray))
    console.log("success")
    // console.log(req.body)
    // const data: Plot[] = [{x: [1, 3, 4, 5], y: [3, 12, 1, 4], type: 'line'}];
    // plot(data)
    res.send(a)

})

app.get('/showResults',(req,res,next)=>{
    const data = fs.readFileSync('data.json')
    const parsedData = JSON.parse(data)
    res.send(parsedData)
})
//If I drop a ball from a height H and the ball rebounds from the floor it 
//will bounce back up to a height of e2h where e is the coefficient of restitution of the collision 
//between the floor and the ball.

app.get('*',(req,res)=>{
    res.render('404',{
        title:'404',
        name:'Rakshita Jain',
        errorMessage:'Page not found'
    })
})

app.listen(port,()=>{
    console.log('Server is up on the port '+ port)//This msg is never gonna display
})
