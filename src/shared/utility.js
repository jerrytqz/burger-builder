export const updateObject = (oldObject, updatedProperties) => {
    return {
        ...oldObject,
        ...updatedProperties
    }
}

export const checkValidity = (value, rules) => {
    let isValid = true;
    
    if (rules.required) {
        isValid = value.trim() !== '' && isValid; 
    }

    if (rules.length) {
        isValid = value.length === rules.length && isValid; 
    }

    if (rules.isEmail) {
        const pattern = /\S+@\S+\.\S+/;
        isValid = pattern.test(value) && isValid;
    }

    if (rules.minLength) {
        isValid = value.length >= rules.minLength && isValid
    }

    return isValid; 
}