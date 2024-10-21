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
    if (randCitis.length >= 5) {
      setIsDisabled(true);
      return randCitis[randCitis.length - 1];
    }
  
    let randCity;
    do {
      randCity = arr[Math.floor(Math.random() * arr.length)];
    } while (randCitis.includes(randCity));
  
    setRandCitis([...randCitis, randCity]);
    return randCity;
  };
  useEffect(() => {
    setCity(getRandCity(CONSTANTS.cities));
  }, [isRestart]);

  const checkAnswer = (userAnswer, rightAnswer) => {
    return Math.abs(rightAnswer - userAnswer) <= 4 ? true : false;
  };

  const requestAnswer = (values) => {
    const { temperature } = values;
    if (!temperature) {
      return;
    }
  
    fetch(`${CONSTANTS.API_URL}${city}&appid=${CONSTANTS.API_KEY}&units=metric`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Failed to fetch data from API");
        }
        return res.json();
      })
      .then((data) => {
        const realTemp = Math.round(data.main.temp);
        let color = checkAnswer(temperature, realTemp) ? "green" : "red";
  
        if (color === "green") {
          setPoint(point + 1);
        }
  
        setPointInfo((prev) => [
          ...prev,
          { color, realTemp, temperature },
        ]);
        setCity(getRandCity(CONSTANTS.cities));
      })
      .catch((err) => {
        console.error(err);
        alert("An error occurred while receiving the data. Please try again.");
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
