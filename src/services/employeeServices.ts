import { Employee, EmployeeData,PersonalDetails,PersonalDetailsData,EmploymentDetails,EmploymentDetailsData, Emplevels } from '../interfaces/employeeInterface';
import FileService from './fileServices';

export default class employeeData {
    private fService: FileService;
    constructor() {
        this.fService = new FileService();
    }
    public get = (): Promise<Employee[]> => {
        return this.fService.getEmployeeFileData()
        .then((result) => {
            result.filter(element => {
                if (element !== null) {
                    if (element.supervisor === "na") {
                        Object.defineProperty(element, 'supervisor', { enumerable: false })
                    }
                }
            })
            return result.filter(data => data !== null)
        })
        .catch((err) => { return err });
    }
    public getById = (uid: number): Promise<Employee> => {
        return this.fService.getEmployeeFileData()
            .then(data => {
                const employee = data.find(item =>item!=null && item.id === uid);
                if (employee!==undefined) {
                    if (employee.supervisor === "na") {
                        Object.defineProperty(employee, 'supervisor', { enumerable: false })
                    }
                    return employee;
                } else {
                    return new Error("No employee with given ID");
                }
            })
            .catch((err) => { return err })
    }
    public add = (data: EmployeeData): Promise<EmployeeData> => {
        return this.fService.getEmployeeFileData()
            .then((result) => {
                const id: number = new Date().valueOf();
                const newEmployee: Employee = { id, ...data };
                result.push(newEmployee);
                this.fService.setData(result);
                return newEmployee;
            })
            .catch(err => { return err });
    }
    public delete = async(empid: number): Promise<Employee> => {
        return this.fService.getEmployeeFileData()
            .then((result) => {
                const eleIndex: number = result.findIndex(item => item!=null && item.id === empid);
                if (eleIndex >= 0) {
                    const deleteEmployee = result[eleIndex];
                    delete result[eleIndex];
                    this.fService.setData(result);
                    this.fService.getPersonalFileData().then(data=>{
                        delete data[empid];
                        this.fService.setPersonalFileData(data);
                    })
                    this.fService.getEmploymentFileData().then(data=>{
                        delete data[empid];
                        this.fService.setEmploymentData(data);
                    })
                    return deleteEmployee;
                } else {
                    return null;
                }
            })
            .catch((err) => { return err });
    }
    public update = (empid: number, data: EmployeeData): Promise<Employee> => {
        return this.fService.getEmployeeFileData().then(result => {
            const index = result.findIndex((data) => data!==null && data.id === empid);
            if (index > -1) {
                result[index] = { ...result[index], ...data };
                this.fService.setData(result);
                return result[index];
            }
            return result[index];
        })
    }
    public subordinates = async (empid: number): Promise<Employee[]> => {
        const result: Employee[] = [];
        const employees = await this.fService.getEmployeeFileData();
        const addSubordinates = (id: number) => {
            const subordinates = employees.filter((employee) => 
                employee!==null && employee.supervisor === id.toString() && employee.level !== Emplevels.manager) as Employee[];
            subordinates.forEach((user) => {
                result.push(user);
                addSubordinates(user.id);
            });
        };
        addSubordinates(empid);
        return result;
    }
    public superiors = async (empid: number): Promise<Employee[]> => {
        const result: Employee[] = [];
        try {
            const employees = await this.fService.getEmployeeFileData();
            const addSuperiors = (id: number) => {
                const employee : Employee = employees.find((employee) => employee!==null && employee.id === id) as Employee;
                if (employee.supervisor !== 'na') {
                    const superior = employees.find((user) => {
                        if(user!==null){
                            return user.id === Number(employee.supervisor) && user.level !== employee.level
                        }}) as Employee;
                    if (superior) {
                        result.push(superior);
                        addSuperiors(superior.id);
                    }
                }
                };
                addSuperiors(empid);
                return result;
        } catch (error) {           
            throw error;
        }
    }
    public getlevel = (level: string): Promise<Employee[]> => {
        return this.fService.getEmployeeFileData()
            .then((result) => {
                result.filter(element => {
                    if (element != null) {
                        if (element.supervisor === "na") {
                            Object.defineProperty(element, 'supervisor', { enumerable: false })
                        }
                    }
                })
                return result.filter(data => data != null && data.level.toLowerCase() === level.toLowerCase())
            })
            .catch((err) => { return err });
    }
    public storePersonalData = async(empId: number,data:PersonalDetails):Promise<PersonalDetailsData> =>{
        return this.fService.getPersonalFileData()
        .then(result => {
            result[empId] = data;
            this.fService.setPersonalFileData(result);                
            return result[empId];
            })
        .catch((err) => { return err })
    }
    public storeEmploymentData = async(empId: number,data:EmploymentDetails):Promise<EmploymentDetailsData> =>{
        const isEmployee = await this.getById(empId).catch((err) => { return err });
        if(isEmployee.id){
            return this.fService.getEmploymentFileData()
            .then(result => {
                result[empId] = data;
                this.fService.setEmploymentData(result);
                return result[empId];
                })
            .catch((err) => { return err })
        }else{
            throw Error;
        }
    }
    public getEmployeeDetails = async(empId : number): Promise<[PersonalDetails,EmploymentDetails]>=>{
        const personalData = await this.fService.getPersonalFileData().then(data=>{return data[empId]});
        const employmentData = await this.fService.getEmploymentFileData().then(data=>{return data[empId]});
        return Promise.all([personalData,employmentData]).then((result)=>{return result}).catch(err=>{throw err});
    }    
}