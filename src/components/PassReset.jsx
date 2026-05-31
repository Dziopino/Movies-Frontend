import {NavLink} from "react-router-dom";

function PassReset() {
    return (
        <>
            <section className="vh-100 gradient-custom">
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card bg-dark text-white" style={{ borderRadius: "1rem"}}>
                                <div className="card-body p-5 text-center">

                                    <div className="mb-md-5 mt-md-4 pb-5">

                                        <h2 className="fw-bold mb-2 text-uppercase">Reset your password</h2>
                                        <p className="text-white-50 mb-5">Please enter your email address</p>

                                        <div data-mdb-input-init className="form-outline form-white mb-4">
                                            <input type="email" id="typeEmailX" className="form-control form-control-lg"/>
                                            <label className="form-label" htmlFor="typeEmailX">Email</label>
                                        </div>

                                        <p className="small mb-5 pb-lg-2"><NavLink className="text-white-50" to="/">Back to login page</NavLink></p>

                                        <button data-mdb-button-init data-mdb-ripple-init className="btn btn-outline-light btn-lg px-5" type="submit">Reset password</button>

                                    </div>

                                    <div>
                                        <p className="mb-0">Don't have an account? <NavLink className="text-white-50 fw-bold" to="/register">Sign Up</NavLink></p>
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
export default PassReset