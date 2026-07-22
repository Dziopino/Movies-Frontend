import {NavLink} from "react-router-dom";

function StatusMessage({icon, title, message, buttonText, buttonLink}) {

    return (
        <section className="vh-100 gradient-custom">
            <div className="container py-5 h-100">
                <div className="row d-flex justify-content-center align-items-center h-100">
                    <div className="col-12 col-md-8 col-lg-6 col-xl-5">

                        <div className="card bg-dark text-white" style={{borderRadius:"1rem"}}>
                            <div className="card-body p-5 text-center">

                                <div className="py-4">

                                    <div className="mb-4">
                                        <i className={`${icon} text-warning`} style={{fontSize:"60px"}}></i>
                                    </div>

                                    <h2 className="fw-bold mb-3">
                                        {title}
                                    </h2>

                                    <p className="text-white-50 mb-4">
                                        {message}
                                    </p>

                                    {buttonText && buttonLink && (
                                        <NavLink to={buttonLink} className="btn btn-outline-light btn-lg px-5">
                                            {buttonText}
                                        </NavLink>
                                    )}

                                </div>

                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </section>
    );
}

export default StatusMessage;