import "./hex.scss";
import { hex } from "../../assets/profile";

const Hex = ({ userStats }) => {
  return (
    <div className="hex-container">
      <div className="hex one">
        <img className="img" src={hex} alt="" />
        <div className="text">
          <h2>{userStats?.posts || 0}</h2>
          <p>Number of Self Initiated Projects</p>
        </div>
      </div>
      <div className="hex two">
        <img className="img" src={hex} alt="" />
        <div className="text">
          <h2>{userStats?.collabsNotPending || 0}</h2>
          <p>Number of Collaboration Projects</p>
        </div>
      </div>
      <div className="hex three">
        <img className="img" src={hex} alt="" />
        <div className="text">
          <h2>{userStats?.completedCollabs || 0}</h2>
          <p>Total Number of Impacts Had</p>
        </div>
      </div>
    </div>
  );
};

export default Hex;
