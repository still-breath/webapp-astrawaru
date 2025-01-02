import "./card.scss"

const Card = ({ number, customer, service, carImage, brand, model, progress, description, onDetail, onSelesai }) => {
  return (
    <div className="card">
      <div className="cardHeader">
        <div className="orderNumber">{number}</div>
        <div className="customerInfo">
          <span className="custName">Customer : {customer}</span>
          <span className="service">{service}</span>
        </div>
        <div className="menuDot">⋮</div>
      </div>
      <div className="carImage">
        <img src={carImage} alt={`${brand} ${model}`} />
      </div>
      <div className="carInfo">
        <h3>{brand}</h3>
        <p>{model}</p>
      </div>
      <div className="progress">
        <div className="progressBar">
          <div className="progressFill" style={{ width: `${progress}%` }}></div>
        </div>
        <span className="progressText">{progress}%</span>
      </div>
      <div className="note">
        {description}
      </div>
      <div className="buttons">
        <button className="detail" onClick={onDetail}>Detail</button>
        <button className="selesai" onClick={onSelesai}>Selesai</button>
      </div>
    </div>
  )
}

export default Card