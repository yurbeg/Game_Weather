import { Typography } from "antd";

import "./index.css"
const Point = ({ city,obj }) => {    
    return(
        <div className={`point_container ${obj?.color}`} >
            <Typography.Title level={3}>{city}</Typography.Title>
            <Typography.Title level={4}>Your Answer: {obj?.temperature}</Typography.Title>
            <Typography.Title level={4}>Right Answer: {obj?.realTemp}</Typography.Title>
        </div>
    )
}
export default Point