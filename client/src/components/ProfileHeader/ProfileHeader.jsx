import { Link, useNavigate } from "react-router-dom";
import { corporate, location, nopfp, linkIcon } from "../../assets/profile";
import Hex from "../Hex/Hex";
import Tags from "../Tags/Tags";
import Tile from "../Tile/Tile";
import "./profileHeader.scss";
import moment from "moment";
import { useSelector } from "react-redux";

const ProfileHeader = ({ user, pageName, userStats }) => {
  const navigate = useNavigate();
  const authUser = useSelector((state) => state.authUser.user);

  return (
    <div className="profileHeader">
      <div className="coverimg">
        <img src={user?.coverPic} alt="cover image of the company" />
      </div>
      <div className="info">
        <div className="info-container">
          <div className="pfp-text">
            <img className="pfp" src={user?.pfp || nopfp} alt="" />
            <div className="company-info">
              <div className="header">
                <h3>{user?.name}</h3>
                {authUser?._id === user._id && pageName !== "editProfile" && (
                  <button
                    className="feedbackbutton"
                    onClick={() => navigate(`/profile/edit`)}
                  >
                    Edit Profile
                  </button>
                )}
                {pageName !== "editProfile" && (
                  <div className="stats">
                    <Hex userStats={userStats} />
                  </div>
                )}
              </div>
              <p className="description">{user?.description}</p>
              <div className="company-info-tiles">
                <Tile
                  className="bg-lightblue"
                  image={corporate}
                  type={user?.stakeholder}
                />
                <Tile image={location} type={user?.city} />
                <a href={user?.websiteLink} target="_blank" rel="noopener noreferrer">
                  <Tile
                    image={linkIcon}
                    type={user?.website || "https://companyurl.com"}
                  />
                </a>

              </div>
            </div>
            <div className="company-about">
              <p>Joined On {moment(user?.createdAt).format("ll")}</p>
              <p className="description">
                {/* Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Sapiente laborum commodi reiciendis labore quibusdam vero
                exercitationem ab fugiat dolor voluptates natus facilis sit unde
                a tempore enim dicta, magni deserunt. */}
                {user?.description}
              </p>
            </div>
            <Tags tags={user?.tags} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileHeader;
