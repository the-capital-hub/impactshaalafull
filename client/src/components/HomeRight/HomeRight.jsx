import { useState } from "react";
import Preferences from "../Preferences/Preferences";
import ProfileCard from "../ProfileCard/ProfileCard";
import "./homeRight.scss";
import ContactUs from "../ContactUs/ContactUs";
import Collab from "../Collab/Collab";
import { useSelector } from "react-redux";

const HomeRight = () => {
  const [showEmailForm, setShowEmailForm] = useState(false);
  const user = useSelector((state) => state.authUser.user);

  return (
    <div className="homeRight">
      {showEmailForm && (
        <ContactUs email={user?.email} onCancel={setShowEmailForm} />
      )}
      <ProfileCard />
      {/* <Preferences />
      <Collab /> */}
      <div className="getInTouch">
        <h4>Need help with collaborating?</h4>
        <button onClick={() => setShowEmailForm(true)}>Get in Touch</button>
      </div>
    </div>
  );
};

export default HomeRight;
