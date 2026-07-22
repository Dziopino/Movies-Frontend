import {NavLink} from "react-router-dom";
import {useState} from "react";
import {useNavigate} from "react-router-dom";
import useAuth from "../hooks/useAuth.js";
import config from "../config/api.js";
import toast from "react-hot-toast";
import StatusMessage from "./StatusMessage.jsx";

function Login() {
    const navigate = useNavigate();

    const {setUserData} = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [userStatus, setUserStatus] = useState("ACTIVE");
    const [suspendedUntil, setSuspendedUntil] = useState(null);

    const onSubmit = (e) =>{
        e.preventDefault();

        if(email === "" || password === ""){
            alert("Please enter your data");
            return;
        }

        fetch(`${config.apiUrl}/checkLoginData`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({email, password}),
        }).then((res) => res.json())
        .then(data => {

            if (data.success === false){
                if(data.suspended === true){
                    setSuspendedUntil(data.suspendedUntil);
                    return setUserStatus("SUSPENDED");
                }
                if(data.banned === true){
                    return setUserStatus("BANNED");
                }
                return toast.error(data.message);
            }


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
        })
    }

    return (
        <>
            {userStatus === "ACTIVE" ? (
                <section className="gradient-custom">
                    <div className="container py-5 h-100">
                        <div className="row d-flex justify-content-center align-items-center h-100">
                            <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                                <div className="card bg-dark text-white" style={{ borderRadius: "1rem"}}>
                                    <div className="card-body p-5 text-center">

                                        <form className="mb-md-5 mt-md-4 pb-5" onSubmit={onSubmit}>

                                            <h2 className="fw-bold mb-2 text-uppercase">Login</h2>
                                            <p className="text-white-50 mb-5">Please enter your email and password!</p>

                                            <div data-mdb-input-init className="form-outline form-white mb-4">
                                                <input type="email" id="typeEmailX" className="form-control form-control-lg" onChange={(e)=>setEmail(e.target.value)} />
                                                <label className="form-label" htmlFor="typeEmailX">Email</label>
                                            </div>

                                            <div data-mdb-input-init className="form-outline form-white mb-4">
                                                <input type="password" id="typePasswordX" className="form-control form-control-lg" onChange={(e)=>setPassword(e.target.value)} />
                                                <label className="form-label" htmlFor="typePasswordX">Password</label>
                                            </div>

                                            <p className="small mb-5 pb-lg-2"><NavLink className="text-white-50" to="/forgotPassword">Forgot password?</NavLink></p>


                                            <div data-mdb-input-init className="form-outline form-white mb-4">
                                                <button data-mdb-button-init data-mdb-ripple-init className="btn btn-outline-light btn-lg px-5" type="submit">Login</button>
                                            </div>



                                            <button data-mdb-button-init data-mdb-ripple-init className="btn btn-outline-light btn-lg px-5 mt-4" type="button" onClick={()=> {
                                                setUserData({id: 0, email: "", username: "guest", avatar_url: null, created_at: null, role: 0, bio: "", language_code: "en"});
                                                localStorage.setItem("userId", 0);
                                                localStorage.setItem("language_code", "en")
                                                navigate("/");
                                            }}>Continue as guest</button>

                                        </form>

                                        <div>
                                            <p className="mb-0">Don't have an account? <NavLink className="text-white-50 fw-bold" to="/register">Sign Up</NavLink></p>
                                        </div>

                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ):(
                <>
                    {userStatus === "BANNED" ? (
                        <StatusMessage
                            icon="bi bi-shield-x"
                            title="Account banned"
                            message="Your account has been banned. If you think this is a mistake, please contact support."
                            buttonText="Go back"
                            buttonLink="/"
                        />
                    ):(
                        <StatusMessage
                            icon="bi bi-shield-x"
                            title="Account suspended"
                            message={`Your account has been suspended. If you think this is a mistake, please contact support. Account will be suspended until: ${new Date(suspendedUntil).toLocaleString()}`}
                            buttonText="Go back"
                            buttonLink="/"
                        />
                    )
                    }
                </>

            )}

        </>
    )
}

export default Login;