import React from "react"
import Die from "./Die.js"
import { nanoid } from 'nanoid'
import Confetti from 'react-confetti'

export default function App(){
    //default value for state will be allNewDice
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    
    //function to generate random number that will be called into allNewDice
    function generateRandomDie(){
        let random = Math.ceil(Math.random() * 6)
        let die = {
            value: random,
            isHeld: false,
            id: nanoid()
        }
        return die
    }
    
    //Perfect use of a useEffect: when we need to constantly check on a state which will determine the state of another state.
    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const refValue = dice[0].value
        const allValue = dice.every(die => die.value === refValue)
        if(allHeld && allValue){
            setTenzies(true)
        }
        //apparently, can't short circuit and use an && in the same statement. 
    }, [dice])
    
    //Function that will run 10 times to give us newDiceNumbers
    function allNewDice(){
        let newDiceArray = []
        for(let i=0;i<10;i++){
            newDiceArray.push(generateRandomDie())
        }
        return newDiceArray
    }
    
    //Function that will roll the dice again, BUT will not roll dice that are hold.
    function rollDice(){
        //ternary operator conditional 
        !tenzies ? 
            setDice(oldDice => {
                 return oldDice.map(oldDie => {
                     return oldDie.isHeld ? oldDie: generateRandomDie()
                 })
             })
            :
            setDice(allNewDice())
            setTenzies(false)
    
        //traditional if else conditionals 
        // if(!tenzies){
        //     setDice(oldDice => {
        //         return oldDice.map(oldDie => {
        //             return oldDie.isHeld ? oldDie: generateRandomDie()
        //         })
        //     })  
        // }
        // else{
        //     setDice(allNewDice())
        //     setTenzies(false)
        // }
    }
    
    //function that will will allow each specific die to identify and modify itself : roll part 2
    function holdDice(id){
        setDice(oldDice => {
            return oldDice.map(oldDie => {
                return oldDie.id === id ? {...oldDie, isHeld: !oldDie.isHeld} : oldDie
            })
        })
    }
    
    //Map over dice to render Die component for each number in the array 
    const diceElements = dice.map(die => 
        <Die 
            // {...die} sending the entire destructured array as props.property 
            //{die}     sending the entire arrray (props.die.property)
            value={die.value}
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
            key={die.id}
        />)

    return(
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instruction">Roll until all dice are the same. Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <button className="roll-dice" onClick={rollDice}>{tenzies?"New Game":"Roll"}</button>
        </main>
    )
}


