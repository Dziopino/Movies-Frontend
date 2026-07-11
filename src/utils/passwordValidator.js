export function validatePassword(password) {

    return {
        length: password.length >= 8,
        uppercase: /[A-Z]/.test(password),
        number: /\d/.test(password),
        special: /[!@#$%^&*]/.test(password)
    };

}

export function isPasswordValid(password){

    const validation = validatePassword(password);

    return Object.values(validation).every(Boolean);

}