import {NavLink, useNavigate} from "react-router-dom";
import {useState} from "react";
import useAuth from "../hooks/useAuth.js";
import {isPasswordValid} from "../utils/passwordValidator.js";
import PasswordValidator from "./PasswordValidator.jsx";
import config from "../config/api.js";
import PasswordInput from "./PasswordInput.jsx";

function Register() {

    const navigate = useNavigate();
    const {setUserData} = useAuth();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");



    const onSubmit = (e)=>{
        e.preventDefault();

        if (password !== confirmPassword) {
            return setMessage("Passwords don't match");
        }

        if (!isPasswordValid(password)) {
            return setMessage("Password does not meet requirements");
        }

        setMessage("");

        fetch(`${config.apiUrl}/addUser`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({username, email, password})
        }).then(res => res.json()).then(data => {
            setMessage(data.message);
            if(data.success === true){
                setUserData({
                    id: parseInt(data.user.id),
                    email:data.user.email,
                    username:data.user.username,
                    avatar_url:data.user.avatar_url,
                    created_at:data.user.created_at,
                    role:data.user.role,
                    bio:data.user.bio,
                    language_code:data.user.language_code
                });


                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.user.role);
                localStorage.setItem("userId", data.user.id);

                navigate("/");
            }
        })

    }

    return (
        <>
            <section className="vh-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card bg-dark text-white" style={{ borderRadius: "1rem"}}>
                                <div className="card-body p-5 text-center">

                                    <form className="mb-md-5 mt-md-4 pb-5" onSubmit={onSubmit}>

                                        <h2 className="fw-bold mb-2 text-uppercase">Register</h2>
                                        <p className="text-white-50 mb-5">Please enter your details!</p>

                                        <div data-mdb-input-init className="form-outline form-white mb-4">
                                            <input type="text" id="typeUserNameX" className="form-control form-control-lg" onChange={(e) => setUsername(e.target.value)} />
                                            <label className="form-label" htmlFor="typeUserNameX">Username</label>
                                        </div>

                                        <div data-mdb-input-init className="form-outline form-white mb-4">
                                            <input type="email" id="typeEmailX" className="form-control form-control-lg" onChange={(e) => setEmail(e.target.value)} />
                                            <label className="form-label" htmlFor="typeEmailX">Email</label>
                                        </div>

                                        <div data-mdb-input-init className="form-outline form-white mb-4">

                                            <PasswordInput id={"typePasswordX"} value={password} onChange={(e) => setPassword(e.target.value)}/>
                                            <label className="form-label" htmlFor="typePasswordX">Password</label>
                                            <PasswordValidator password={password}/>
                                        </div>


                                        <div data-mdb-input-init className="form-outline form-white mb-4">
                                            <PasswordInput id={"typeConfirmPassword"} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}/>
                                            <label className="form-label" htmlFor="typeConfirmPassword">Confirm password</label>
                                        </div>



                                        <p className="text-danger mb-4">{message}</p>

                                        <button data-mdb-button-init data-mdb-ripple-init className="btn btn-outline-light btn-lg px-5" type="submit">Register</button>

                                    </form>

                                    <div>
                                        <p className="mb-0">Don't have an account? <NavLink className="text-white-50 fw-bold" to="/login">Log in</NavLink></p>
                                    </div>

                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    )
}
export default Register;