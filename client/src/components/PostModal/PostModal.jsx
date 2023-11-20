import { useEffect, useState } from "react";
import Post from "../Post/Post";
import "./postModal.scss";
import axiosInstance from "../../utils/service";
import { useNavigate, useParams } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { setUserAuth } from "../../store/slices/user";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";

const PostModal = ({ user, collabId, post, onCancel, page, closeModel, getUser }) => {
  const dispatch = useDispatch();
  const [collab, setCollab] = useState(null);
  // const { id } = useParams();
  const { user: authUser } = useOutletContext();
  const otherUser = authUser._id === post?.createdById ? user?._id : authUser._id;
  const { setPageLoading } = useOutletContext();

  const navigate = useNavigate();

  const getCollab = async () => {
    const response = await axiosInstance.get(
      `${import.meta.env.VITE_BASE_URL}/api/collaboration/single/${collabId}`
    );
    // console.log("Res", response);
    setCollab(response.data);
  }

  useEffect(() => {
    getCollab();
  }, [])

  const handleChatClick = async () => {
    try {
      const findChat = await axiosInstance.get(
        `${import.meta.env.VITE_BASE_URL}/api/chat/find/${authUser._id}/${otherUser}`
      );
      if (!findChat?.data) {
        try {
          const chatRes = await axiosInstance.post(
            `${import.meta.env.VITE_BASE_URL}/api/chat/`,
            {
              senderId: authUser._id,
              recieverId: otherUser,
            }
          );
        } catch (err) {
          console.log(err);
        }
        console.log("chat not found");
        navigate(`/chats`);
      }
      if (findChat?.data) {
        console.log("chat found");
        navigate(`/chats`);
      }
    } catch (err) {
      console.log(err);
    }
  };

  const handleAccept = async () => {
    try {
      const shouldCancel = window.confirm("Are you sure you want to accept this collaboration?");
      if (!shouldCancel) {
        return;
      }
      // update current loggedin use
      setPageLoading(true);
      const resToCurrentUserOne = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/company/updateuser/${otherUser}`,
        { $push: { collaborationIdsAccepted: collabId } }
      );
      const resToCurrentUserTwo = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/company/updateuser/${otherUser}`,
        { $pull: { collaborationIds: collabId } }
      );

      //update user who posted the collaborating
      const resToOtherUserOne = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/company/updateuser/${post?.createdById
        }`,
        { $push: { collaborationIdsAccepted: collabId } }
      );

      const resToOtherUserTwo = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/company/updateuser/${post?.createdById
        }`,
        { $pull: { collaborationIds: collabId } }
      );
      dispatch(setUserAuth({ user: resToOtherUserTwo.data }));
      localStorage.setItem("IsUser", JSON.stringify(resToOtherUserTwo.data));
      const updateCollabs = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/collaboration/update/${collabId}`,
        {
          completed: "ongoing"
        }
      );
      await axiosInstance.post(`${import.meta.env.VITE_BASE_URL}/api/notification/create`, {
        fromId: post?.createdById,
        toId: otherUser,
        title: "Collab Request Accepted",
        message: "Collab Request Accepted",
      });
      // handleChatClick();
      onCancel(false);
      toast.success("Collab Accepted");
      getUser();
    } catch (err) {
      console.log(err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleDecline = async () => {
    try {
      const shouldCancel = window.confirm("Are you sure you want to decline this collaboration?");
      if (!shouldCancel) {
        return;
      }
      setPageLoading(true);
      // update current loggedin use
      const resToCurrentUser = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/company/updateuser/${otherUser}`,
        { $push: { collaborationIdsDeclined: collabId } }
      );
      const resToCurrentUserTwo = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/company/updateuser/${otherUser}`,
        { $pull: { collaborationIds: collabId } }
      );

      //update user who posted the collaborating
      const resToOtherUser = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/company/updateuser/${post?.createdById
        }`,
        { $push: { collaborationIdsDeclined: collabId } }
      );
      const resToOtherUserTwo = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/company/updateuser/${post?.createdById
        }`,
        { $pull: { collaborationIds: collabId } }
      );
      dispatch(setUserAuth({ user: resToOtherUserTwo.data }));
      localStorage.setItem("IsUser", JSON.stringify(resToOtherUserTwo.data));

      const updateCollabs = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/collaboration/update/${collabId}`,
        {
          completed: "declined"
        }
      );
      onCancel(false);
      toast.success("Collab Rejected");
      getUser();
    } catch (err) {
      console.log(err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleCancel = async () => {
    try {
      const shouldCancel = window.confirm("Are you sure you want to cancel this collaboration?");
      if (!shouldCancel) {
        return;
      }
      setPageLoading(true);

      const cancelCollabResponse = await axiosInstance.delete(
        `${import.meta.env.VITE_BASE_URL}/api/collaboration/deleteCollab/${collabId}`
      );

      const resToCurrentUserTwo = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/company/updateuser/${otherUser}`,
        { $pull: { collaborationIds: collabId } }
      );
      dispatch(setUserAuth({ user: resToCurrentUserTwo.data }));

      const resToOtherUserTwo = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/company/updateuser/${post?.createdById
        }`,
        { $pull: { collaborationIds: collabId } }
      );
      toast.success("Collab Cancelled");
      onCancel(false);
      getUser();
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  };

  const handleMarkAsCompleted = async () => {
    try {
      const shouldMark = window.confirm("Are you sure you want to mark this collabaration as completed?");
      if (!shouldMark) {
        return;
      }
      const updateCollabs = await axiosInstance.post(
        `${import.meta.env.VITE_BASE_URL}/api/collaboration/update/${collabId}`,
        {
          completed: "completed"
        }
      );
      toast.success("Collab marked as completed");
      getCollab();
      setPageLoading(true);
    } catch (err) {
      console.error(err);
    } finally {
      setPageLoading(false);
    }
  }

  return (
    <div className="postModal">
      <div className="blackbg" onClick={() => onCancel(false)}></div>
      <Post post={post} />
      {page === "collabsRecieved" && (
        <div className="buttons">
          <button className="green" onClick={handleAccept}>
            Accept
          </button>
          <button className="red" onClick={handleDecline}>
            Decline
          </button>
        </div>
      )}

      {page === "collabSent" && (
        <div className="buttons">
          <button className="red" onClick={handleCancel}>
            Cancel
          </button>
        </div>
      )}

      {collab?.completed !== "completed" && page === "collabsAccepted" && (
        <div className="buttons">
          <button className="green" onClick={handleMarkAsCompleted}>
            Mark As Completed
          </button>
        </div>
      )}

      {collab?.completed === "completed" && page === "collabsAccepted" && (
        <div className="buttons">
          <button className="green">
            Completed
          </button>
        </div>
      )}
    </div>
  );
};

export default PostModal;
