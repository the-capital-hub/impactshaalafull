import { useEffect, useState } from "react";
import "./googleSignup.scss";
import axiosInstance from "../../utils/service";
import { gmail } from "../../assets/signUp";
import { useNavigate, useParams } from "react-router-dom";
// import { upload } from "../../../../api/utils/upload";
import {
  citizenOptions,
  corporateOptions,
  educationalOptions,
  ngoOptions,
  sectors,
} from "../../constants";

// this page is shown after google signup
const GoogleSignUp = () => {
  //   states
  const [tags, setTags] = useState([]);
  const [tag, setTag] = useState("");
  const { id } = useParams();
  const [updatedUser, setUpdatedUser] = useState({});
  const [coverImg, setCoverImg] = useState("");
  const navigate = useNavigate();

  // functions
  // tag input
  const handleTagSubmit = (e) => {
    e.preventDefault();
    if (tag) setTags((prev) => [...prev, tag]);
    setTag("");
  };
  // input change
  const handleInputChange = (e) => {
    setUpdatedUser((prev) => {
      return { ...prev, [e.target.name]: e.target.value };
    });
  };

  // form submit
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    console.log(updatedUser);
    // const coverPicUrl = await upload(coverImg);
    try {
      const res = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/company/updateuser/${id}`,
        {
          ...updatedUser,
          // coverPic: coverPicUrl?.toString(),
          tags: tags,
        }
      );
      try {
        const res = await axiosInstance.post(
          `${import.meta.env.VITE_BASE_URL}/api/company/login`,
          {
            email: updatedUser.email,
            password: updatedUser.password,
          }
        );
        console.log(res.data);
        navigate(`/home/${res.data._id}`);
      } catch (err) {
        console.log(err);
        navigate("/");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <form onSubmit={handleFormSubmit} className="googleSignUp">
      <div className="container">
        <h1>Let us know more before continuing</h1>
        <div className="stakeholderContainer">
          <input
            type="file"
            name="coverImg"
            id=""
            onChange={(e) => setCoverImg(e.target.files[0])}
          />
          <div className="dropdownContainer">
            <select
              onChange={(e) => handleInputChange(e)}
              required
              className="dropdown"
              name="stakeholder"
              id=""
            >
              <option value="" disabled selected hidden>
                Stakeholder
              </option>
              <option value="Educational Institution">
                Educational Institutions
              </option>
              <option value="NGO">NGO</option>
              <option value="Corporate">Corporate</option>
              <option value="Working Professional">Working Professional</option>
            </select>
            <select
              onChange={(e) => handleInputChange(e)}
              required
              className="dropdown"
              name="type"
              id=""
            >
              <option value="" disabled selected hidden>
                Type
              </option>
              {updatedUser?.stakeholder === "Educational Institution" &&
                educationalOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              {updatedUser?.stakeholder === "NGO" &&
                ngoOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              {updatedUser?.stakeholder === "Corporate" &&
                corporateOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              {updatedUser?.stakeholder === "Working Professional" &&
                citizenOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
            </select>
            {updatedUser?.type === "Other" && (
              <input
                className="otherInput"
                onChange={(e) => handleInputChange(e)}
                // name="type"
                type="text"
                placeholder="Enter Profession"
                id=""
                required
              />
            )}
            {updatedUser?.stakeholder === "Educational Institution" && (
              <select
                required
                onChange={(e) => handleInputChange(e)}
                className="dropdown"
                name="sector"
                id=""
              >
                <option value="" disabled selected hidden>
                  Sectors
                </option>
                {sectors.map((sector) => (
                  <option key={sector} value={sector}>
                    {sector}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>

        <div className="topInputContainer">
          <div className="left">
            <input
              required
              placeholder="Comapany Name"
              type="text"
              name="companyName"
              onChange={(e) => handleInputChange(e)}
              id=""
            />
            <input
              required
              placeholder="Tag Line"
              type="text"
              name="tagline"
              onChange={(e) => handleInputChange(e)}
              id=""
            />
            <input
              required
              placeholder="Phone Number"
              type="number"
              name="phNum"
              onChange={(e) => handleInputChange(e)}
              id=""
            />
            <input
              required
              placeholder="Website"
              type="text"
              name="website"
              onChange={(e) => handleInputChange(e)}
              id=""
            />
            <textarea
              placeholder="Description"
              name="description"
              onChange={(e) => handleInputChange(e)}
            />
          </div>
          <div className="right">
            <input
              required
              placeholder="Address Line One"
              type="text"
              name="addressOne"
              onChange={(e) => handleInputChange(e)}
              id=""
            />
            <input
              required
              placeholder="Address Line Two"
              type="text"
              name="addressTwo"
              onChange={(e) => handleInputChange(e)}
              id=""
            />
            <input
              required
              placeholder="Pin Code"
              type="text"
              name="pinCode"
              onChange={(e) => handleInputChange(e)}
              id=""
            />
            <input
              required
              placeholder="City"
              type="text"
              name="website"
              onChange={(e) => handleInputChange(e)}
              id=""
            />
            <input
              required
              placeholder="State"
              type="text"
              name="website"
              onChange={(e) => handleInputChange(e)}
              id=""
            />
          </div>
        </div>

        <div className="collabs">
          <h1>Which type of collaborations are looking</h1>
          <div className="collabsinputs">
            <input
              placeholder="Ex. Business"
              type="text"
              name="tag"
              value={tag}
              onChange={(e) => {
                setTag(e.target.value);
              }}
              id=""
            />
            <button type="button" onClick={handleTagSubmit}>
              Add
            </button>
            <textarea
              disabled
              required
              placeholder="Tags"
              value={tags}
              name="description"
            />
          </div>
        </div>
        <button type="submit">Submit</button>
      </div>
    </form>
  );
};

export default GoogleSignUp;
