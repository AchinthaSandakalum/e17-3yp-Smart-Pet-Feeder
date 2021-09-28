import React, { useCallback, useEffect, useState } from "react";
// import NotificationBar from "./NotificationBar";
import LoginForm from "../Form-Modal/LoginForm";
// import MessageModal from "./MessageModal";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeedbacks } from "../../store/actions/admin_feedbacks";
import Loader from "react-loader-spinner";
import { useHistory } from "react-router-dom";
import AdminFeedback from "./AdminFeedback";
import ReplyModal from "./ReplyModal";

export default function Notifications(props) {
  const history = useHistory();

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const dispatch = useDispatch();

  const loadFeedbacks = useCallback(() => {
    setError(null);
    setIsLoading(true);

    return dispatch(fetchFeedbacks())
      .then((response) => {
        setIsLoading(false);
      })
      .catch((err) => {
        setError(err.message);
      });
  }, [dispatch, setIsLoading, setError]);

  useEffect(() => {
    loadFeedbacks();
  }, [dispatch, loadFeedbacks]);

  const [modalData, setModalData] = useState({ open: false });

  const showMessage = (id) => {
    setModalData({ open: true, id: id });
  };

  const hideMessage = () => {
    setModalData({ open: false });
  };

  if (error) {
    history.replace(`${process.env.PUBLIC_URL}/500error`);
    return <React.Fragment />;
  }

  return (
    <React.Fragment>
      {isLoading && (
        <div align="center">
          <Loader type="ThreeDots" color="#d42e22" height={100} width={100} />
        </div>
      )}

      {!isLoading && (
        <div className="container">
          {props.admin_feedbacks.map((data) => (
            <AdminFeedback
              title={data.title}
              date_time={data.date_time}
              isRead={data.isHandle}
              id={data._id}
              key={data._id}
              showMessage={showMessage}
            />
          ))}
        </div>
      )}

      {modalData.open && (
        <ReplyModal
          open={modalData.open}
          handleClose={hideMessage}
          id={modalData.id}
        />
      )}
    </React.Fragment>
  );
}