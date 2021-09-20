import React, { useContext, useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

import useInput from "../../hooks/use-input";
import Button from "@material-ui/core/Button";

import * as Validators from "../../helpers/validators";
import { useDispatch } from "react-redux";
import * as authActions from "../../store/actions/auth";
import Loader from "react-loader-spinner";

const useStyles = makeStyles((theme) => ({
  paper: {
    backgroundColor: theme.palette.background.paper,

    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },

  modal: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  button: {
    background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
    borderRadius: 3,
    border: 0,
    color: "white",
    height: 48,
    padding: "0 30px",
    boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
    // $disabled is a reference to the local disabled
    // rule within the same style sheet.
    // By using &, we increase the specificity.
    "&$disabled": {
      background: "rgba(0, 0, 0, 0.12)",
      color: "white",
      boxShadow: "none",
    },
  },
  disabled: {},
}));

export default function LoginForm(props) {
  const classes = useStyles();
  const history = useHistory();

  const [error, setError] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (error) {
      alert("Invalid Email or Password!");
    }
  }, [error]);

  const {
    value: email,
    isValid: emailIsValid,
    hasError: emailHasError,
    valueChangeHandler: emailChangeHandler,
    inputBlurHandler: emailBlurHandler,
    reset: resetEmail,
  } = useInput("", Validators.isEmail);

  const {
    value: password,
    isValid: passwordIsValid,
    hasError: passwordHasError,
    valueChangeHandler: passwordChangeHandler,
    inputBlurHandler: passwordBlurHandler,
    reset: resetPassword,
  } = useInput("", Validators.isNotEmpty);

  let formIsValid = false;
  if (passwordIsValid && emailIsValid) {
    formIsValid = true;
  }

  const submitForm = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await dispatch(authActions.login(email, password));
      history.replace(`${process.env.PUBLIC_URL}/user`);
    } catch (err) {
      setError(err.message);
      setIsLoading(false);
    }
  };

  const closeFormHandler = () => {
    resetEmail();
    resetPassword();
    props.handleClose();
  };
  return (
    <Container component="main" maxWidth="xs">
      {/*<Button variant="contained" color="secondary" onClick={handleOpen}>*/}
      {/*  Open Animated Modal*/}
      {/*</Button>*/}

      <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        className={classes.modal}
        open={props.open}
        onClose={closeFormHandler}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.open}>
          <div className="pricing-box" style={{ width: 400 }}>
            <form>
              <div align="middle">
                <h2 className="">Login</h2>
              </div>
              <div>
                <input
                  type="email"
                  id="email"
                  placeholder="Email"
                  value={email}
                  onChange={emailChangeHandler}
                  onBlur={emailBlurHandler}
                  className="form-control invalid"
                  required="required"
                />
                {emailHasError && (
                  <p className="error-message">*Incorrect Email</p>
                )}
              </div>
              <div>
                <input
                  type="password"
                  id="password"
                  placeholder="Password"
                  value={password}
                  onChange={passwordChangeHandler}
                  onBlur={passwordBlurHandler}
                  className="form-control"
                  required="required"
                />
                {passwordHasError && (
                  <p className="error-message">*Password should not be empty</p>
                )}
              </div>
              <div className="form-actions">
                {isLoading ? (
                  <div align="center">
                    <Loader
                      type="ThreeDots"
                      color="#d42e22"
                      height={100}
                      width={100}
                    />
                  </div>
                ) : (
                  <Button
                    classes={{
                      root: classes.button, // class name, e.g. `root-x`
                      disabled: classes.disabled, // class name, e.g. `disabled-x`
                    }}
                    disabled={!formIsValid}
                    onClick={submitForm}
                  >
                    Submit
                  </Button>
                )}
              </div>
            </form>
          </div>
        </Fade>
      </Modal>
    </Container>
  );
}
