import { Request, Response } from 'express';
import EmployeeService from '../services/employeeServices';
import { Employee, EmployeeData,PersonalDetails,EmploymentDetails } from '../interfaces/employeeInterface';
import { constants,error,NoEmployeeError,NoEmployeeWithIDError,InvalidBodyError } from '../assets/constants';
import AjvJsonSchema from '../schemas/jsonSchemas';

export default class EmployeeController {
    private empService: EmployeeService;
    private ajvSchemaObj : AjvJsonSchema;
    constructor() {
        this.empService = new EmployeeService();
        this.ajvSchemaObj = new AjvJsonSchema();
    }

    public addEmployees = async (req: Request, res: Response) => {
        try {
            const employeeData: EmployeeData = req.body;
            const isValid : string = await this.ajvSchemaObj.employeeSchemaValidator(employeeData,req.method)
            if(isValid!==""){
                return res.status(400).send(isValid);
            }
            const employee = await this.empService.add(employeeData);
            return res.status(200).json(employee);
        }
        catch (err) {
            return res.status(400).json(constants.catchBlockError);
        }
    }
    public getAllEmployees = (req: Request, res: Response) => {
        this.empService.get()
        .then((result) => {            
            if (result.length >= 1) {
                return res.status(200).send(result);
            } else {
                return res.status(404).json(NoEmployeeError);
            }
        })
        .catch (()=>res.status(400).json(constants.catchBlockError))
    }
    public getEmployee = async (req: Request, res: Response) => {
        const employee: Employee = await this.empService.getById(Number(req.params.id));
        try {
            if (employee.id) {
                res.status(200).json(employee);
            } else {
                res.status(404).json(NoEmployeeError);
            }
        }
        catch (err) {
            res.status(400).json(constants.catchBlockError);
        }
    }
    public deleteEmployee = async(req: Request, res: Response) => {
        const employee: EmployeeData = await this.empService.delete(Number(req.params.id));
        try {
            if (employee) {
                res.status(200).json(employee);
            } else {
                res.status(404).json(NoEmployeeError);
            }
        } catch (error) {
            res.status(400).json(constants.catchBlockError);
        }
    }
    public updateEmployee = async(req: Request, res: Response) => {       
        const employeeData = req.body;
        try {
            const isValid : string = await this.ajvSchemaObj.employeeSchemaValidator(employeeData,req.method)
            if(isValid){
                return res.status(400).json({"error":isValid});
            }
            this.empService.update(Number(req.params.id), employeeData)
            .then((result) => {                        
                if(result){
                    res.status(200).send(result);
                }else{
                    return res.status(404).json(NoEmployeeWithIDError);
                }
            });
        }
        catch (err) {
            return res.status(400).json(InvalidBodyError);
        }
    }
    public getSuperiors = async (req: Request, res: Response) => {
        try{
            const employeeSuperiors = await this.empService.superiors(Number(req.params.id));
            if(employeeSuperiors.length>0){
                res.status(200).json(employeeSuperiors);
            } else {
                res.status(404).json({ "status": "Fail", "reason": error(req.params.id,"Superior") });
            }            
        } catch (error) {
            res.status(400).json(constants.catchBlockError);
        }
    }
    public getSubordinates = async (req: Request, res: Response) => {
        try {
            const employeeSubordinates = await this.empService.subordinates(Number(req.params.id));            
            if(employeeSubordinates.length>0){
                res.status(200).json(employeeSubordinates);
            } else {
                res.status(404).json({ "status": "Fail", "reason": error(req.params.id,"Subordinate") });
            }            
        } catch (error) {
            res.status(400).json(constants.catchBlockError);
        }
    }    
    public getEmployeesByLevel = async (req:Request,res:Response) => {
        try {
            let leveltype = req.query.type;            
            if(leveltype){
                const employees:Employee[] = await this.empService.getlevel(leveltype.toString());
                if(employees.length>0){
                    res.status(200).json(employees);
                } else {
                    res.status(404).json({ "status": "Fail", "Reason": `No Employee with ${req.query.type} type found` });
                }    
            }
        } catch (error) {
            res.status(400).json(constants.catchBlockError);
        }
    }
    public addPersonalDetails = async (req: Request, res: Response) => {        
        const employeeData: PersonalDetails = req.body;
        const employee = await this.empService.getById(Number(req.params.id));        
        if(employee.id){            
            try {
                const isValid : string = await this.ajvSchemaObj.personalSchemaValidator(employeeData);
                if(isValid!==""){
                    return res.status(400).send(isValid);
                }
                const employeePersonal = await this.empService.storePersonalData(Number(req.params.id),employeeData);                     
                return res.status(200).json(employeePersonal);
            }
            catch (err) {
                return res.status(400).json(constants.catchBlockError);
            }
        }else{
            return res.status(400).json(employee.toString());
        }
    }
    public addEmploymentDetails = async (req: Request, res: Response) => {        
        const employeeData: EmploymentDetails = req.body;
        const employee = await this.empService.getById(Number(req.params.id));
        if(employee.id){
            try {
                const isValid : string = await this.ajvSchemaObj.employmentSchemaValidator(employeeData);
                if(isValid!==""){
                    return res.status(400).send(isValid);
                }
                const employement = await this.empService.storeEmploymentData(Number(req.params.id),employeeData);
                return res.status(200).json(employement);
            }
            catch (err) {
                return res.status(400).json(constants.catchBlockError);
            }
        }else{
            return res.status(400).json(employee.toString());
        }
    }
    public getEmployeeDetails = async (req: Request, res: Response) =>{
        try {
            const [personalData,employmentData] = await this.empService.getEmployeeDetails(Number(req.params.id));
            if(personalData==undefined && employmentData==undefined){
                return res.json({"PersonalDetails":"No Data Found","EmploymentDetails":"No Data Found"})
            }else if(personalData==undefined){
                return res.json({"PersonalDetails":"No Data Found","EmploymentDetails":employmentData})
            }else if(employmentData==undefined){
                return res.json({"PersonalDetails":personalData,"EmploymentDetails":"No Data Found"})
            }else{
                return res.json({"PersonalDetails":personalData,"EmploymentDetails":employmentData})
            }
        } catch (error) {
            return res.status(400).json(constants.catchBlockError);
        }
    }
}