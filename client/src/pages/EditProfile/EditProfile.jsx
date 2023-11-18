import React, { useEffect, useState } from "react";
import { Link, useNavigate, useOutletContext } from "react-router-dom";
import ProfileHeader from "../../components/ProfileHeader/ProfileHeader";
import TitleInput from "../../components/TitleInput/TitleInput";
import "./editProfile.scss";
import { updateUserAPI } from "../../api/company";
import { useDispatch } from "react-redux";
import { setUserAuth } from "../../store/slices/user";
import { toast } from "react-toastify";
import { getBase64 } from "../../utils/getBase64";
import axiosInstance from "../../utils/service";

const EditProfile = () => {
  const { user, setPageTitle } = useOutletContext();
  const [updateUser, setUpdateUser] = useState({
    name: user?.name || "",
    tagline: user?.tagline || "",
    description: user?.description || "",
    email: user?.email || "",
    website: user?.website || "",
    addressOne: user?.addressOne || "",
    addressTwo: user?.addressTwo || "",
    city: user?.city || "",
    pfp: user?.pfp || "",
    coverPic: user?.coverPic || "",

  });
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [updating, setUpdating] = useState(false);
  const [pfp, setPfp] = useState(null);
  const [cover, setCover] = useState(null);

  // Update page title
  useEffect(() => {
    setPageTitle("Edit Profile");
  }, []);

  const handleUserUpdate = (e) => {
    const { name, value } = e.target;
    setUpdateUser((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (e.target.name === 'pfp') {
      setPfp(selectedFile);
    } else {
      setCover(selectedFile);
    }
  };

  const handleSubmit = async (e) => {
    try {
      setUpdating(true);
      e.preventDefault();

      if (pfp) {
        const base64 = await getBase64(pfp);
        const response = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/api/company/uploadImage`, {
          image: base64,
        })
        console.log(response.data.url);
        updateUser.pfp = response.data.url
      }
      if (cover) {
        const base64 = await getBase64(cover);
        const response = await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/api/company/uploadImage`, {
          image: base64,
        })
        console.log(response.data.url);
        updateUser.coverPic = response.data.url
      }
      const updatedUser = await updateUserAPI(user._id, updateUser);
      dispatch(setUserAuth({ user: updatedUser }));
      toast.success("Profile Updated");
      navigate(`/profile/${user._id}`);
    } catch (error) {
      console.log(error);
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="editProfile">
      <ProfileHeader user={user} pageName={"editProfile"} />
      <form onSubmit={handleSubmit} className="edits">
        <TitleInput
          type="file"
          onChange={handleFileChange}
          title={"Profile Picture"}
          name="pfp"
        />
        <TitleInput
          type="file"
          onChange={handleFileChange}
          title={"Cover Picture"}
          name="coverPic"
        />
        <TitleInput
          onChange={handleUserUpdate}
          title={"Company Name"}
          value={updateUser?.name}
          name="name"
        />
        <TitleInput
          onChange={handleUserUpdate}
          title={"Tag Line"}
          value={updateUser?.tagline}
          name="tagline"
        />
        <TitleInput
          onChange={handleUserUpdate}
          title={"Description"}
          value={updateUser?.description}
          name="description"
        />
        <TitleInput
          onChange={handleUserUpdate}
          title={"Email"}
          value={updateUser?.email}
          name="email"
        />
        <TitleInput
          onChange={handleUserUpdate}
          title={"Website"}
          value={updateUser?.website}
          name="website"
        />
        <TitleInput
          onChange={handleUserUpdate}
          title={"Address 1"}
          value={updateUser?.addressOne}
          name="addressOne"
        />
        <TitleInput
          onChange={handleUserUpdate}
          title={"Address 2"}
          value={updateUser?.addressTwo}
          name="addressTwo"
        />
        <TitleInput
          onChange={handleUserUpdate}
          title={"Location"}
          value={updateUser?.city}
          name="city"
        />
        <div className="action_buttons">
          <Link to={`/profile/${user._id}`} className="btn btn-outline-primary">
            Back
          </Link>
          <button type="submit" className="btn btn-primary" disabled={updating}>
            {updating ? "Updating..." : "Update"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProfile;
