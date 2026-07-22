import {NavLink, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import PasswordValidator from "./PasswordValidator.jsx";
import { isPasswordValid } from "../utils/passwordValidator.js";
import config from "../config/api.js";
import StatusMessage from "./StatusMessage.jsx";

function ResetPassword() {
    const navigate = useNavigate();
    const {token}= useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [valid, setValid] = useState();
    const [finalMessage, setFinalMessage] = useState("");
    const [isChanged, setIsChanged] = useState(false);


    useEffect(() => {
        fetch(`${config.apiUrl}/getResetToken/${token}`)
            .then(res => res.json()).then((data) => {
                setValid(data.valid);
        })
    },[token])

    const onSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            return setMessage("Passwords don't match");
        }

        if (!isPasswordValid(password)) {
            return setMessage("Password does not meet requirements");
        }

        setMessage("");

        fetch(`${config.apiUrl}/resetPassword/${token}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({password: password}),
        }).then(res => res.json()).then((data) => {
            setIsChanged(data.isChanged);
            setFinalMessage(data.message);
        })

    };


    return (
        <>
        {valid ?
            (<section className="vh-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card bg-dark text-white" style={{ borderRadius: "1rem"}}>
                                <div className="card-body p-5 text-center">


                                        <div>
                                            <form className="mb-md-5 mt-md-4 pb-5" onSubmit={onSubmit}>

                                                <h2 className="fw-bold mb-2 text-uppercase">Reset your password</h2>

                                                <p className="text-white-50 mb-5">Please enter your new password</p>

                                                <div data-mdb-input-init className="form-outline form-white mb-4">
                                                    <input type="password" value={password} id="password" className="form-control form-control-lg" onChange={(e) => setPassword(e.target.value)}/>
                                                    <label className="form-label" htmlFor="password">Password</label>
                                                    <PasswordValidator password={password}/>
                                                </div>

                                                <div data-mdb-input-init className="form-outline form-white mb-4">
                                                    <input type="password" value={confirmPassword} id="confirmPasssword" className="form-control form-control-lg" onChange={(e) => setConfirmPassword(e.target.value)}/>
                                                    <label className="form-label" htmlFor="confirmPasssword">Confirm password</label>
                                                </div>

                                                <p className="text-danger mb-4">{message}</p>
                                                {!isChanged ? (
                                                    <button className="btn btn-outline-light btn-lg px-5" type="submit" disabled={!isPasswordValid(password)}>
                                                        Reset password
                                                    </button>
                                                ):(
                                                    <button className="btn btn-outline-light btn-lg px-5" type="button" onClick={()=>{navigate("/login")}} >
                                                        Go back to login page
                                                    </button>)}

                                                {isChanged ?
                                                    <p className="text-success mt-4">{finalMessage}</p>
                                                    :
                                                    <p className="text-danger mt-4">{finalMessage}</p>
                                                }




                                            </form>
                                        </div>
                                            <div className="py-4">

                                                <div className="mb-4">
                                                    <i className="bi bi-exclamation-triangle-fill text-warning" style={{fontSize:"60px"}}></i>
                                                </div>

                                                <h2 className="fw-bold mb-3">
                                                    Link expired
                                                </h2>

                                                <p className="text-white-50 mb-4">
                                                    This password reset link has expired or is no longer valid. Please request a new password reset link.
                                                </p>

                                                <NavLink to="/forgotPassword" className="btn btn-outline-light btn-lg px-5">Request new link</NavLink>
                                            </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            ):(
                <StatusMessage
                    icon="bi bi-exclamation-triangle-fill"
                    title="Link expired"
                    message="This password reset link has expired or is no longer valid. Please request a new password reset link."
                    buttonText="Request new link"
                    buttonLink="/forgotPassword"
                />
            )}
        </>
    )
}
export default ResetPassword;