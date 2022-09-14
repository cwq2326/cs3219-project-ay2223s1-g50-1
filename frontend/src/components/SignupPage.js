import React from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Typography,
} from "@mui/material";
import { useState } from "react";
import axios from "axios";
import { URL_REGISTER_USER_SVC, URL_LOGIN_USER_SVC } from "../configs";
import { STATUS_CODE_CREATED, MIN_USERNAME_LEN, MIN_PASSWORD_LEN, EMAIL_REGEX } from "../constants";
import { Link } from "react-router-dom";
import classes from './LoginSignUpPage.module.css';
import useExistingAuth from "./hooks/useExistingAuth";

axios.defaults.withCredentials = true;

function SignupPage() {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [usernameIsEmpty, setUsernameIsEmpty] = useState(false);
    const [usernameIsInvalid, setUsernameIsInvalid] = useState(false);
    const [emailIsEmpty, setEmailIsEmpty] = useState(false);
    const [emailIsInvalid, setEmailIsInvalid] = useState(false);
    const [passwordIsEmpty, setPasswordIsEmpty] = useState(false);
    const [passwordIsInvalid, setPasswordIsInvalid] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [dialogTitle, setDialogTitle] = useState("");
    const [dialogMsg, setDialogMsg] = useState("");
    const [isSignupSuccess, setIsSignupSuccess] = useState(false);

    useExistingAuth()

    const validateUsername = (username) => {
        return String(username).length >= MIN_USERNAME_LEN;
    }

    const validatePassword = (password) => {
        return String(password).length >= MIN_PASSWORD_LEN;
    }

    const validateEmail = (email) => {
        // return String(email)
        //   .toLowerCase()
        //   .match(
        //     EMAIL_REGEX
        //   );
        return true
      };

    const validateForm = () => {
        setUsernameIsEmpty(false);
        setUsernameIsInvalid(false);
        setEmailIsEmpty(false);
        setEmailIsInvalid(false);
        setPasswordIsEmpty(false);
        setPasswordIsInvalid(false);
        
        if (!username) {
            setUsernameIsEmpty(prev => {
                return !prev;
            });
        }
        if (username && !validateUsername(username)) {
            setUsernameIsInvalid(prev => {
                return !prev;
            });
        }
        if (!email) {
            setEmailIsEmpty(prev => {
                return !prev;
            });
        }
        if (email && !validateEmail(email)) {
            setEmailIsInvalid(prev => {
                return !prev;
            });
        }
        if (!password) {
            setPasswordIsEmpty(prev => {
                return !prev;
            });
        }
        if (password && !validatePassword(password)) {
            setPasswordIsInvalid(prev => {
                return !prev;
            });
        }
        if (!username || !validateUsername(username) || !email || !validateEmail(email) || !password || !validatePassword(password)) {
            return false;
        }

        return true;

    }
    const handleSignup = async () => {
        setIsSignupSuccess(false);

        if (!validateForm()) {
            return;
        }
    
        const res = await axios
            .post(URL_REGISTER_USER_SVC, { username, password })
            .catch((err) => {
                setErrorDialog(err.response.data.error);
            });
        if (res && res.status === STATUS_CODE_CREATED) {
            setSuccessDialog("Account successfully created");
            setIsSignupSuccess(true);

            // Create session
            axios.post(URL_LOGIN_USER_SVC, { username, password })
                .catch(err => {
                    setErrorDialog(err.response.data.error);
                })

        }
    };

    const handleUsernameChange = (event) => {
        setUsername(event.target.value);
        setUsernameIsEmpty(false);
    };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
        setEmailIsEmpty(false);
    };

    const handlePasswordChange = (event) => {
        setPassword(event.target.value);
        setPasswordIsEmpty(false);
    };

    const closeDialog = () => setIsDialogOpen(false);

    const setSuccessDialog = (msg) => {
        setIsDialogOpen(true);
        setDialogTitle("Success");
        setDialogMsg(msg);
    };

    const setErrorDialog = (msg) => {
        setIsDialogOpen(true);
        setDialogTitle("Error");
        setDialogMsg(msg);
    };

    return (
        <Box
            display={"flex"}
            flexDirection={"column"}
            width={"50%"}
            margin={"auto"}
            border={"solid #e2f0f1 2px"}
            borderRadius={"5%"}
            padding={"100px"}
        >
            <Typography variant={"h3"} marginBottom={"2rem"}>
                Sign Up
            </Typography>
            <TextField
                required
                error={usernameIsEmpty || usernameIsInvalid}
                label="Username"
                variant="standard"
                value={username}
                helperText={(usernameIsEmpty && "Field cannot be empty." )|| (usernameIsInvalid && "Username must have at least 6 characters")}
                onChange={handleUsernameChange}
                sx={{ marginBottom: "1rem" }}
                autoFocus
            />
            <TextField
                required
                error={emailIsEmpty || emailIsInvalid}
                label="Email"
                variant="standard"
                value={email}
                helperText={(emailIsEmpty && "Field cannot be empty.") || (emailIsInvalid && "Incorrect email format")}
                onChange={handleEmailChange}
                sx={{ marginBottom: "1rem" }}
                autoFocus
            />
            <TextField
                required
                error={passwordIsEmpty || passwordIsInvalid}
                label="Password"
                variant="standard"
                type="password"
                value={password}
                helperText={(passwordIsEmpty && "Field cannot be empty.")|| (passwordIsInvalid && "Password must have at least 6 characters")}
                onChange={handlePasswordChange}
            />
            <Typography
                variant={"subtitle2"}
                className={[classes["text-box"], classes.signup].join(' ')}
                component={Link} to="/login"
            >
                Already have an account? Click here to login
            </Typography>
            <Box
                display={"flex"}
                flexDirection={"row"}
                justifyContent={"flex-end"}
                marginTop={"2rem"}
            >
                <Button variant={"outlined"} onClick={handleSignup}>
                    Sign up
                </Button>
            </Box>

            <Dialog open={isDialogOpen} onClose={closeDialog}>
                <DialogTitle>{dialogTitle}</DialogTitle>
                <DialogContent>
                    <DialogContentText>{dialogMsg}</DialogContentText>
                </DialogContent>
                <DialogActions>
                    {isSignupSuccess ? (
                        <Button component={Link} to="/">
                            Continue
                        </Button>
                    ) : (
                        <Button onClick={closeDialog}>Done</Button>
                    )}
                </DialogActions>
            </Dialog>
        </Box>
    );
}

export default SignupPage;
