import React from 'react'
import {Layer, Stage, Shape, Text} from 'react-konva';
import KeyboardEventHandler from 'react-keyboard-event-handler';
import {colorConfig} from './config';


export default class Konva extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            hexSize: 50,
            hexagonals: this.props.hex,
        }
    }

    componentDidMount(){
        fetch("http://68f02c80-3bed-4e10-a747-4ff774ae905a.pub.instances.scw.cloud/2", {
            method: 'POST',
            body: JSON.stringify([])
        })
        .then(res => res.json())
        .then(result => {
            result.forEach(res => {
                this.state.hexagonals.forEach((hex, index) => {
                    if(res.x === hex.x && res.y === hex.y && res.z === hex.z){
                        this.setState(state =>{
                            const newArr = [...state.hexagonals];
                            newArr[index].value = res.value;
                            return {
                                hexagonals: newArr,
                            }
                        })
                    }
                })
            })
        })
    }

    checkDoubles = () => {
        const checkArr = [];
        const {hexagonals} = this.state;

        ['x','y','z'].forEach(item => {
            hexagonals.filter(hex => hex[item] === -1).forEach((elem, i, arr) => {
                if(arr[i + 1] && elem.value !== arr[i + 1].value){
                    checkArr.push(true);
                }
            })

            hexagonals.filter(hex => hex[item] === 0).forEach((elem, i, arr) => {
                if(arr[i + 1] && elem.value !== arr[i + 1].value){
                    checkArr.push(true);
                }
            })

            hexagonals.filter(hex => hex[item] === 1).forEach((elem, i, arr) => {
                if(arr[i + 1] && elem.value !== arr[i + 1].value){
                    checkArr.push(true);
                }
            })
        })

        if(checkArr.length === 12){
            return true
        }
    }

    sort(first, second, third, axis){
        const {hexagonals} = this.state;

        if(
            JSON.stringify(first) !== JSON.stringify(hexagonals.filter(item => item[axis] === -1))
            ||
            JSON.stringify(second) !== JSON.stringify(hexagonals.filter(item => item[axis] === 0))
            ||
            JSON.stringify(third) !== JSON.stringify(hexagonals.filter(item => item[axis] === 1))
        ){
            this.setState( state => {
                return {hexagonals:[...first, ...second, ...third].sort((a,b) => a.id - b.id)}
            })

            this.request(); 
        } 

    }

    changePosition(key){
        const {hexagonals} = this.state;
        
        let first, second, third, axis;

        if(key === 'd' || key === 'e' || key === 's'){ 
            if(key === 'd'){
                axis = 'z'
            }
            if(key === 'e'){
                axis = 'y'
            }
            if(key === 's'){
                axis = 'x'
            }

            first = this.frontChange(hexagonals.filter(item => item[axis] === -1));
            second = this.frontChange(hexagonals.filter(item => item[axis] === 0));
            third = this.frontChange(hexagonals.filter(item => item[axis] === 1));
        }

        if(key === 'q' || key === 'a' || key === 'w'){
            if(key === 'q'){
                axis = 'z'
            }
            if(key === 'a'){
                axis = 'y'
            }
            if(key === 'w'){
                axis = 'x'
            }

            first = this.backChange(hexagonals.filter(item => item[axis] === -1));
            second = this.backChange(hexagonals.filter(item => item[axis] === 0));
            third = this.backChange(hexagonals.filter(item => item[axis] === 1));
        }

        this.sort(first, second, third, axis);
    }

    frontChange(arr){
        const nums = arr.map(item => item.value);
        const another = [];
    
        nums.forEach(item => {
            if(item){
                another.unshift(item);
            } else {
                another.push(item);
            }
        })
        
        another.forEach((item, index, arr) => {
            if(item && item === arr[index + 1]){
                arr[index] = arr[index] * 2;
                arr[index+1] = null;
            } 
        })
        
        const newNums = another.sort((a,b) => b ? 1 : -1).slice().reverse();
    
        return arr.map((item, index) => ({...item, value: newNums[index]}));
    }

    backChange(arr){
        const nums = arr.map(item => item.value);
        const another = [];

        nums.forEach(item => {
            if(item){
                another.push(item);
            } else {
                another.unshift(item);
            }
        })
        
        another.forEach((item, index, arr) => {
            if(item && item === arr[index + 1]){
                arr[index] = arr[index] * 2;
                arr[index+1] = null;
            } 
        })
        
        const newNums = another.sort((a,b) => b ? 1 : -1);

        return arr.map((item, index) => ({...item, value: newNums[index]}));
    }

    request(){
        const arrForRequest = [];
        
        this.state.hexagonals.forEach(hex => {
            if(hex.value){
                arrForRequest.push({x: hex.x, y: hex.y, z: hex.z, value: hex.value});
            }
        })

        fetch("http://68f02c80-3bed-4e10-a747-4ff774ae905a.pub.instances.scw.cloud/2", {
            method: 'POST',
            body: JSON.stringify(arrForRequest),
        })
        .then(res => res.json())
        .then(result => {
            result.forEach(res => {
                this.state.hexagonals.forEach((hex, index) => {
                    if(res.x === hex.x && res.y === hex.y && res.z === hex.z){
                        this.setState(state =>{
                            const newArr = [...state.hexagonals];
                            newArr[index].value = res.value;
                            return {
                                hexagonals: newArr,
                            }
                        })
                    }
                })

                if(this.state.hexagonals.filter(item => item.value !== null).length === 7){
                    if(this.checkDoubles()){
                        this.props.isFinish(true)
                    }
                }
            })
        })      
    }

    fillColor(value){
        let hex;
        colorConfig.forEach(item => {
            if(item[0] === value){
                hex = item[1];
            }
        })
        return hex;
    }

    render(){
        const { hexSize, hexagonals } = this.state;

        return (
            <React.Fragment>
                <KeyboardEventHandler
                    handleKeys={['q', 'w', 'e', 'a', 's', 'd']}
                    onKeyEvent={key => this.changePosition(key)} 
                />
                <Stage width={2000} height={400}>
                        {
                            hexagonals.map(item => {
                                const {a,b,id,value} = item
                                return (
                                    <Layer key={id}>
                                        <Shape
                                            sceneFunc={(context, shape) => {
                                                context.moveTo(a + hexSize * Math.cos(0), b + hexSize * Math.sin(0));

                                                for (let side = 1; side < 7; side++) {
                                                    context.lineTo(a + hexSize * Math.cos(side * 2 * Math.PI / 6), b + hexSize * Math.sin(side * 2 * Math.PI / 6));
                                                }

                                                context.closePath();
                                                context.fillStrokeShape(shape);

                                            }}
                                            fill={this.fillColor(value)}
                                            stroke="#5c5c5c"
                                            strokeWidth={4}
                                            key={id}
                                        />
                                        <Text 
                                            fontSize={25}
                                            fill="#ffffff"
                                            text={value}
                                            wrap="char"
                                            align="center"
                                            x={value > 10 ? a - 12 : a - 5}
                                            y={b - 7}
                                        />
                                    </Layer>
                                )
                            })
                        }
                </Stage>
            </React.Fragment>    
        )
    }
}