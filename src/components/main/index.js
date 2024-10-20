import { Button, Input, Typography, Form } from "antd";
import { useEffect, useState } from "react";
import Point from "../point";
import { CONSTANTS } from "../../core/constants/constants";
import "./index.css";
const Main = () => {
  const [form] = Form.useForm();
  const [randCitis, setRandCitis] = useState([]);
  const [isDisabled, setIsDisabled] = useState(false);
  const [pointInfo, setPointInfo] = useState([]);
  const [point, setPoint] = useState(0);
  const [resultGame, setResultGame] = useState(undefined);
  const [isRestart, setIsRestart] = useState(false);
  const [city, setCity] = useState("");
  const getRandCity = (arr) => {
    const randCity = arr[Math.round(Math.random() * (arr.length - 1))];
    if (randCitis.length !== 5) {
      if (!randCitis.includes(randCity)) {
        setRandCitis([...randCitis, randCity]);
        return randCity;
      } else {
        getRandCity(CONSTANTS.cities);
        return randCitis[randCitis.length - 1];
      }
    } else {
      setIsDisabled(true);
      return randCitis[randCitis.length - 1];
    }
  };
  const checkAnswer = (userAnswer, rightAnswer) => {
    return Math.abs(rightAnswer - userAnswer) <= 4 ? true : false;
  };

  const requestAnswer = (values) => {
    let color;
    const { temperature } = values;
    if (!temperature) {
      return;
    }
    fetch(`${CONSTANTS.API_URL}${city}&appid=${CONSTANTS.API_KEY}&units=metric`)
      .then((res) => {
        return res.json();
      })
      .then((data) => {
        const realTemp = Math.round(data.main.temp);
        if (checkAnswer(temperature, realTemp)) {
          color = "green";
          setPoint(point + 1);
        } else {
          color = "red";
        }
        setPointInfo([
          ...pointInfo,
          { color: color, realTemp: realTemp, temperature: temperature },
        ]);
        setCity(getRandCity(CONSTANTS.cities));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        form.resetFields();
      });
  };
  const restartGame = () => {
    setIsRestart(!isRestart);
    setRandCitis([]);
    setPointInfo([]);
    setPoint(0);
    setIsDisabled(!isDisabled);
  };
  // eslint-disable-next-line
  useEffect(() => {
    setCity(getRandCity(CONSTANTS.cities));
  }, [isRestart]);

  useEffect(() => {
    if (point >= 4) {
      setResultGame("You Win");
    } else {
      setResultGame("You Lose");
    }
  }, [point]);
  return (
    <div className="main_container">
      <div>
        <Typography.Title level={3}>{city}</Typography.Title>
        <Form
          layout="vertical"
          form={form}
          onFinish={requestAnswer}
          disabled={isDisabled}
        >
          <Form.Item name="temperature">
            <Input
              type="number"
              placeholder="Please guess the temperature in this city"
            />
          </Form.Item>
          <Button htmlType="submit" type="primary">
            CHECK
          </Button>
        </Form>
      </div>
      <div className="point-block">
        {randCitis.map((city, i) => {
          return <Point key={i} city={city} obj={pointInfo[i]} />;
        })}
      </div>
      <div>
        {isDisabled ? (
          <Typography.Title style={{ marginTop: "20px" }} level={1}>
            {resultGame}
          </Typography.Title>
        ) : (
          <></>
        )}
        <Button
          onClick={restartGame}
          style={{ marginTop: "20px", padding: "12px" }}
          disabled={!isDisabled}
          type="primary"
        >
          {" "}
          RESTART GAME{" "}
        </Button>
      </div>
    </div>
  );
};

export default Main;
