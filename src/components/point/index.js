import "./index.css"
const Point = ({ city,color }) => {    
    return(
        <div className={`point_container ${color}`} >
            <h3>{city}</h3>
        </div>
    )
}
export default Point