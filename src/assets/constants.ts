export const constants = {
    createBody : "create",
    catchBlockError :{ "status": "Fail", "reason": "Error" },
};

export const error = (id:string,type:string)=>`No ${type} for ${id} found`;
export const validationError = (error:string)=> `${error}`;
export const NoEmployeeError = { "status": "Fail", "reason": "No employee Found" };
export const NoEmployeeWithIDError = { "status": "Fail", "reason": "No Such Employee with given id present" };
export const InvalidBodyError = { "status": "Fail", "reason": "Invalid Request Body" };

export const patternMessages : {[key: string]: string} = {
    "first_name": "first name should be a string containing only alphabets.",
    "last_name": "last name should be a string containing only alphabets.",
    "email": "email should be a valid email address.",
    "phone_no": "phone number should be a 10 digit number.",
    "level": "level should be one of the following values: 'manager', 'developer', 'tester', 'intern'.",
    "supervisor": "supervisor should be a string containing only numbers."
}