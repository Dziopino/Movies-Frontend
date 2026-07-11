import { validatePassword } from "../utils/passwordValidator.js";


function PasswordValidator({ password }) {

    const validation = validatePassword(password);


    return (
        <div className="text-start mt-3">

            <p>Password requirements:</p>

            <ul className="list-unstyled">

                <li className={validation.length ? "text-success" : "text-danger"}>
                    {validation.length ? "✓" : "✗"} Minimum 8 characters
                </li>

                <li className={validation.uppercase ? "text-success" : "text-danger"}>
                    {validation.uppercase ? "✓" : "✗"} One uppercase letter
                </li>

                <li className={validation.number ? "text-success" : "text-danger"}>
                    {validation.number ? "✓" : "✗"} One number
                </li>

                <li className={validation.special ? "text-success" : "text-danger"}>
                    {validation.special ? "✓" : "✗"} One special character
                </li>

            </ul>

        </div>
    );
}

export default PasswordValidator;