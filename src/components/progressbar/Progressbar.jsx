import "./progressbar.scss"

const Progressbar = ({ value, max }) => {
    return (
    <div className="progress-bar">
      <div className="progress-bar-completed" style={{ width: `${(value / max) * 100}%` }}>
      </div>
    </div>
  );
}

export default Progressbar