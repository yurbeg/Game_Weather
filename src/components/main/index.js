import { Button, Input, Typography, Form } from "antd";
import { useState } from "react";
import Point from "../point";
import { CONSTANTS } from "../../core/constants/constants";
import "./index.css"
const Main = () => {
  const [ form ] = Form.useForm();
  const [ randCitis,setRandCitis ] = useState([])
  const [ isDisabled,setIsDisabled ] = useState(false)
  const [ colorArr,setColorArr ] = useState([])
  const [ point,setPoint ] = useState(0)
  const [ resultGame,setResultGame] = useState(undefined)
  let color;  
  const getRandCity = (arr) => {
    const randCity = arr[Math.round(Math.random() * (arr.length - 1))];
    if(randCitis.length < 5){
      if(!randCitis.includes(randCity)){
        setRandCitis([...randCitis,randCity])
        return randCity;
      }
      else {
        getRandCity(CONSTANTS.cities)
        return randCitis[randCitis.length-1]
      }
    }
    else { 
      setIsDisabled(true)
      if(point >= 4){
        setResultGame("You Win")
      }
      else{
        setResultGame("You Lose")
      }
      return randCitis[randCitis.length-1]
    }
  };
  const [city,setCity] = useState(()=>getRandCity(CONSTANTS.cities))
  const checkAnswer = (userAnswer,rightAnswer) => {
    return Math.abs(rightAnswer - userAnswer) <= 4 ? true : false
  }
  const requestAnswer = (values) => {
    const { temperature } = values;
    if(!temperature){return}    
    fetch(`${CONSTANTS.API_URL}${city}&appid=${CONSTANTS.API_KEY}&units=metric`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {  
        const realTemp = Math.round(data.main.temp)
        if (checkAnswer(temperature,realTemp)){
          color = "green"
          setPoint(point+1)
        } 
        else {
          color = "red"
        }
        setColorArr([...colorArr,{color:color,realTemp:realTemp,temperature:temperature}])
        setCity(getRandCity(CONSTANTS.cities))
      })
      .catch((err) => {
        console.log(err);    
      })
      .finally(() => {
        form.resetFields();
    });
  };
  return (
    <div className="main_container">
      <div>
        <Typography.Title level={3}>{city}</Typography.Title>
        <Form layout="vertical" form={form} onFinish={requestAnswer} disabled={isDisabled}>
          <Form.Item name="temperature">
            <Input type="number" placeholder="Please guess the temperature in this city"/>
          </Form.Item>
          <Button htmlType="submit" type="primary">CHECK</Button>
        </Form>
      </div>
      <div className="point-block">
      {
        randCitis.map((city,i)=>{       
          return <Point key={i} city={city} obj={colorArr[i]} />
        })
      }
      </div>
      <div>
          {
            isDisabled ?  <Typography.Title level={1}>{resultGame}</Typography.Title>:<></>
          }
      </div>
    </div>
  );
};

export default Main;
