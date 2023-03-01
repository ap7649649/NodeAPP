import { patternMessages } from '../assets/constants';
import { EmployeeData,PersonalDetails,EmploymentDetails,Emplevels,EmpMaritalStatus,EmpGender } from '../interfaces/employeeInterface';
import Ajv, { ValidateFunction } from "ajv";
const ajv = new Ajv({ allErrors: true, $data: true, messages: true });
require("ajv-formats")(ajv);

export default class AjvJsonSchema{
    private employeeSchema = {
        type: "object",
        required: ["first_name", "last_name", "email", "phone_no", "level"],
        properties: {
            first_name: { type: "string",pattern : "^[a-zA-Z]+$",minLength: 1},
            last_name: { type: "string",pattern : "^[a-zA-Z]+$",minLength: 1},
            email: { type: "string", format: "email"},
            phone_no: { type: "string",pattern : "^[0-9]{10}$" },
            level: { type: "string", enum: [Emplevels.manager,Emplevels.developer,Emplevels.tester,Emplevels.intern] },
            supervisor: { type: "string",pattern : "^[0-9]+$" },
        },
        additionalProperties : false,
        "if": {
            "properties": {
                "level": {
                    enum: [Emplevels.developer,Emplevels.tester,Emplevels.intern]
                }
            }
        },
        "then": {
            "required": ["supervisor"]
        }
    }
    private employeeUpdateSchema = {
        type: "object",
        properties: {
            first_name: { type: "string", pattern: "^[a-zA-Z]+$", minLength: 1, maxLength: 50 },
            last_name: { type: "string", pattern: "^[a-zA-Z]+$", minLength: 1, maxLength: 50 },
            email: { type: "string", format: "email", maxLength: 255 },
            phone_no: { type: "string", pattern: "^[0-9]{10}$" },
            level: { type: "string", enum: [Emplevels.manager,Emplevels.developer,Emplevels.tester,Emplevels.intern] },
            supervisor: { type: "string", pattern: "^[0-9]+$",minLength: 10, maxLength: 50 },
        },
        additionalProperties: false,
        "if": {
            "properties": {"level": {enum: [Emplevels.manager]}}
        },
        "then": {
            "not": {"required": ["supervisor"]}
        },
        "else":{
            "required": ["supervisor"]
        }
    }
    private personalDetailsSchema = {
        type: "object",
        properties: {
            gender: { type: "string", enum: [EmpGender.male,EmpGender.female] },
            blood_group: { type: "string", minLength: 1, maxLength: 3 },
            marital_status: { type: "string", enum: [EmpMaritalStatus.single,EmpMaritalStatus.married,EmpMaritalStatus.widowed,EmpMaritalStatus.divorced] },
            international_worker: { type: "boolean" },
            dob: { type: "string", format: "date" },
            physically_disabled: { type: "boolean" }
        },
        additionalProperties: false,
        required: ["gender", "blood_group", "marital_status", "international_worker", "dob", "physically_disabled"]
    }
    private employmentDetailsSchema = {
        type: "object",
        properties: {
            employer: { type: "string",pattern: "^[a-zA-Z]+$",minLength: 1 },
            designation: {type: "string", enum: [Emplevels.manager,Emplevels.developer,Emplevels.tester,Emplevels.intern]},
            location: { type: "string",pattern: "^[a-zA-Z]+$",minLength: 1 },
            department: { type: "string",minLength: 1,pattern: "^[a-zA-Z]+$" },
            reporting_manager: { type: "string",minLength: 1,pattern: "^[a-zA-Z]+$" },
            doj: { type: "string", format: "date" }
        },
        additionalProperties: false,
        required: ["employer", "designation", "location", "department", "reporting_manager", "doj"]
    }

    public employeeSchemaValidator = async(body:EmployeeData,method:string):Promise<string>=>{
        let isvalid : ValidateFunction;
        if(method==="POST"){
            isvalid = ajv.compile(this.employeeSchema);
        }else {
            isvalid = ajv.compile(this.employeeUpdateSchema);
        }
        const valid = isvalid(body);
        if(!valid && isvalid.errors){
            const errors = isvalid.errors.map(error => {
                if(error.keyword=="pattern"){
                    const customMessage:string = patternMessages[error.instancePath.slice(1)];
                    return customMessage ? `${customMessage}` : error.message;
                }else{
                    const errorMessages1 = ajv.errorsText(isvalid.errors ?? [], { separator: '\n' });
                    return errorMessages1;
                }
            });
            return errors.toString();
        }
        return "";
    }
    
    private isError = (isValid:boolean,err:ValidateFunction):string=>{
        if(!isValid && err.errors){
            return err.errors?.map((data)=>data.message).join(', ');
        }
        return "";
    }
    public personalSchemaValidator =async (body:PersonalDetails) : Promise<string> => {
        const isvalid = ajv.compile(this.personalDetailsSchema);
        const valid = isvalid(body);
        return this.isError(valid,isvalid);
    }
    public employmentSchemaValidator =async (body:EmploymentDetails) : Promise<string> => {
        const isvalid = ajv.compile(this.employmentDetailsSchema);
        const valid = isvalid(body);
        return this.isError(valid,isvalid);
    }
}