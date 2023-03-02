import fs from 'fs/promises';
import {Employee,PersonalDetails,EmploymentDetails} from '../interfaces/employeeInterface';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

export default class FileService {
    private employeeJsonFile: string;
    private personalJsonFile: string;
    private employmentJsonFile: string;
    constructor() {
        if(process.env.ENVIRONMENT==="development"){
            this.employeeJsonFile = path.join(process.cwd(), 'src', 'assets', 'employee.json');
            this.personalJsonFile = path.join(process.cwd(), 'src', 'assets', 'personalData.json');
            this.employmentJsonFile = path.join(process.cwd(), 'src', 'assets', 'employmentData.json');
        }else{
            this.employeeJsonFile = path.join(process.cwd(), 'src', 'test','testData', 'employee.json');
            this.personalJsonFile = path.join(process.cwd(), 'src', 'test','testData', 'personalData.json');
            this.employmentJsonFile = path.join(process.cwd(), 'src', 'test','testData', 'employmentData.json');
        }
    }
    public getEmployeeFileData = async (): Promise<Employee[]> => {
        return await fs.readFile(this.employeeJsonFile)
            .then((data) => {
                return JSON.parse(data.toString()) as Employee[];
                }
            ).catch(err=>{
                return []
                }
            );
    };
    public getPersonalFileData = async (): Promise<PersonalDetails[]> => {
        return await fs.readFile(this.personalJsonFile)
            .then((data) => {             
                return JSON.parse(data.toString());
                }
            ).catch(err=>{
                return {}
                }
            );
    };
    public getEmploymentFileData = async (): Promise<EmploymentDetails[]> => {
        return await fs.readFile(this.employmentJsonFile)
            .then((data) => {
                return JSON.parse(data.toString());
                }
            ).catch(err=>{
                return {}
                }
            );
    };

    public setData = async(inputData: Employee[]) => {
        return await fs.writeFile(this.employeeJsonFile, JSON.stringify(inputData))
        .catch((err)=>{
            throw err;
        })
    }

    public setPersonalFileData = async(inputData: PersonalDetails[]) => {
        return await fs.writeFile(this.personalJsonFile, JSON.stringify(inputData))
        .catch((err)=>{
            throw err;
        })
    }

    public setEmploymentData = async(inputData: EmploymentDetails[]) => {
        return await fs.writeFile(this.employmentJsonFile, JSON.stringify(inputData))
        .catch((err)=>{
            throw err;
        })
    }

    public setDefaultFileData =async (input:Employee[]) => {
        return await fs.writeFile(this.employeeJsonFile, JSON.stringify(input))
        .catch((err)=>{
            throw err;
        })
    }
    public deleteFileData =async () => {
        return await fs.writeFile(this.employeeJsonFile, JSON.stringify([]))
        .catch((err)=>{
            throw err;
        })
    }
}