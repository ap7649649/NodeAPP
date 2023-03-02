import { assert, expect } from 'chai';
import axios from 'axios';
import { after, afterEach, before, beforeEach, describe, it } from 'mocha';
import MainServer from '../app';
import { NoEmployeeError,NoEmployeeWithIDError } from '../assets/constants';
import { Employee } from '../interfaces/employeeInterface';
import FileService from '../services/fileServices';
import { defaultEmployees } from './testData/demoData';

let app:MainServer;
let files:FileService;
let newEmployeeID = "";
const newEmployee = {
    "first_name": "Saurav",
    "last_name": "Ganguly",
    "email": "saurav@gmail.com",
    "phone_no": "1234567890",
    "level": "Intern",
    "supervisor": "1677220155582"
}
let newEmployeePersonalData = {
        "gender": "Male",
        "blood_group": "AB-",
        "marital_status": "Married",
        "international_worker": false,
        "dob": "1999-04-07",
        "physically_disabled": false
    }
let newEmployeeEmploymentData = {
    "employer" : "afour",
    "designation": "Developer",
    "department" : "Development",
    "location": "Pune",
    "doj" : "2022-03-01",
    "reporting_manager" : "Varun"
}

before(() => {
    app = new MainServer()
    files = new FileService()
    app.initialize();
});

after(() => {
    process.exit();
});

describe('EmployeeController', () => {
    describe('GET /employees', () => {
        beforeEach("Setting Pre-condition",()=>{
            files.deleteFileData();
        })
        afterEach("Setting Default Data",()=>{
            files.setDefaultFileData(defaultEmployees);
        })
        describe('When No Employee available employee in Database',()=>{
            it("should throw status as 404 with a no employee message",async()=>{
                await axios.get('http://127.0.0.1:3000/employees/1234')
                .catch((error=>{                        
                    expect(error.response.status).to.equal(404);
                    expect(error.response.data).to.contain(NoEmployeeError);
                }));
            })
        })
    })

    describe('GET /employees',()=>{
        describe('When fetching all Employees available',()=>{
            it('should return all employees',async()=>{
                const response = await axios.get('http://127.0.0.1:3000/employees')
                const employees:string[] = response.data;
                employees.forEach((employee)=>{
                    const responseKeys = Object.keys(employee)
                    const responseValues = Object.values(employee)
                    responseKeys.map(data=>{
                        expect(data).to.be.a('string');
                    })
                    responseValues.map(data=>{
                        expect(data).not.to.be.null;
                    })
                    assert.typeOf(responseValues[0], 'number');
                })
            })
            it('should return status code 200',async()=>{
                const response = await axios.get('http://127.0.0.1:3000/employees');           
                assert.isNotNull(response.data);
                expect(response.status).to.equal(200);
            })
        })
    })

    describe('POST /employees',()=>{
        describe('When Adding a new Employee',()=>{
            it('should add new employee with ID',async()=>{
                const response = await axios.post('http://127.0.0.1:3000/employees',newEmployee);
                expect(response.data).to.have.property('id');
                assert.typeOf(response.data.id, 'number');
                expect(response.status).to.equal(200);
                newEmployeeID = response.data.id;
            })
        })
        
        describe('When Adding a new Employee with Intern level and No Supervisor Data',()=>{
            it('should throw required properties error ',async()=>{
                await axios.post('http://127.0.0.1:3000/employees',{
                    "first_name": "Sumit",
                    "last_name": "Singh",
                    "email": "sumit@gmail.com",
                    "phone_no": "1234567890",
                    "level": "Intern"
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response).to.have.property('statusText').to.equal('Bad Request');
                    expect(error.response.data).to.contain("data must have required property 'supervisor'")
                }));
            })
        })

        describe('When Adding a Manager Employee without a Supervisor',()=>{
            it('should add new Employee with status code 200',async()=>{
                const response = await axios.post('http://127.0.0.1:3000/employees',{
                    "first_name": "Sumit",
                    "last_name": "Singh",
                    "email": "sumit@gmail.com",
                    "phone_no": "1234567890",
                    "level": "Manager"
                });
                expect(response.status).to.equal(200);
                assert.equal(response.data.level,"Manager");
                expect(response.data).not.to.have.property('supervisor');
            })
        })

        describe('When Adding a new Employee with invalid email',()=>{
            it('should return status code 400 with message',async()=>{
                await axios.post('http://127.0.0.1:3000/employees',{
                    "first_name": "Sakshi",
                    "last_name": "Khanolkar",
                    "email": "sakshi@gmailcom",
                    "phone_no": "1234567890",
                    "level": "Manager"
                })
                .catch((error=>{                        
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.contain('data/email must match format "email"');
                }));
            })
        })

        describe('When Adding a new Employee with firstName as 123',()=>{
            it('should return status code 400 with message',async()=>{
                await axios.post('http://127.0.0.1:3000/employees',{
                    "first_name": "123",
                    "last_name": "Ganguly",
                    "email": "sunny@gmail.com",
                    "phone_no": "1234567890",
                    "level": "Intern",
                    "supervisor": "1677220155582"
                })
                .catch((error=>{                        
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal("first name should be a string containing only alphabets.")
                }));
            })
        })

        describe('When Adding a new Employee with lastName as 123',()=>{
            it('should return status code 400 with message',async()=>{
                await axios.post('http://127.0.0.1:3000/employees',{
                    "first_name": "Saurav",
                    "last_name": "123",
                    "email": "saurav@gmail.com",
                    "phone_no": "1234567890",
                    "level": "Intern",
                    "supervisor": "1677220155582"
                })
                .catch((error=>{                        
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal("last name should be a string containing only alphabets.")
                }));
            })
        })

        describe('When Adding a new Employee with phoneNumber less than 10 numbers',()=>{
            it('should return status code 400 with message',async()=>{
                await axios.post('http://127.0.0.1:3000/employees',{
                    "first_name": "Saurav",
                    "last_name": "Singh",
                    "email": "saurav@gmail.com",
                    "phone_no": "123457890",
                    "level": "Intern",
                    "supervisor": "1677220155582"
                })
                .catch((error=>{                        
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal("phone number should be a 10 digit number.")
                }));
            })
        })

        describe('When Adding a new Employee with invalid Employee level',()=>{
            it('should return status code 400 with message',async()=>{
                await axios.post('http://127.0.0.1:3000/employees',{
                    "first_name": "Saurav",
                    "last_name": "Ganguly",
                    "email": "saurav@gmail.com",
                    "phone_no": "1234567890",
                    "level": "Painter",
                    "supervisor": "1677220155582"
                })
                .catch((error=>{                        
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal("data/level must be equal to one of the allowed values")
                }));
            })
        })
        
        describe('When Adding a new Employee with firstName as blank',()=>{
            it('should return status code 400 with message',async()=>{
                await axios.post('http://127.0.0.1:3000/employees',{
                    "first_name": "",
                    "last_name": "Singh",
                    "email": "sumit@gmail.com",
                    "phone_no": "1234567890",
                    "level": "Manager"
                })
                .catch((error=>{                        
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.contain("first name should be a string containing only alphabets.")
                }));
            })
        })

        describe('When Adding a new Employee with lastName as blank',()=>{
            it('should return status code 400 with message',async()=>{
                await axios.post('http://127.0.0.1:3000/employees',{
                    "first_name": "Sumit",
                    "last_name": "",
                    "email": "sumit@gmail.com",
                    "phone_no": "1234567890",
                    "level": "Manager"
                })
                .catch((error=>{                        
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.contain("last name should be a string containing only alphabets.")
                }));
            })
        })

        describe('When Adding a new Employee with email as blank',()=>{
            it('should return status code 400 with message',async()=>{
                await axios.post('http://127.0.0.1:3000/employees',{
                    "first_name": "Sumit",
                    "last_name": "Singh",
                    "email": "",
                    "phone_no": "1234567890",
                    "level": "Manager"
                })
                .catch((error=>{
                    expect(error.response.data).to.contain('data/email must match format "email"');
                }));
            })
        })
        
        describe('When Adding a new Employee with phoneNumber as blank',()=>{
            it('should return status code 400 with message',async()=>{
                await axios.post('http://127.0.0.1:3000/employees',{
                    "first_name": "Sumit",
                    "last_name": "Singh",
                    "email": "sumit@gmail.com",
                    "phone_no": "",
                    "level": "Manager"
                })
                .catch((error=>{                        
                    expect(error.response.data).to.equal("phone number should be a 10 digit number.");
                }));
            })
        })
        describe('When Adding a new Employee with level as blank',()=>{
            it('should return status code 400 with message',async()=>{
                await axios.post('http://127.0.0.1:3000/employees',{
                    "first_name": "Sumit",
                    "last_name": "Singh",
                    "email": "sumit@gmail.com",
                    "phone_no": "1234567890",
                    "level": ""
                })
                .catch((error=>{                        
                    expect(error.response.data).to.equal("data/level must be equal to one of the allowed values");
                }));
            })
        })

        describe('When Adding a new Employee with missing properties',()=>{
            it('should return status code 400 with message',async()=>{
                await axios.post('http://127.0.0.1:3000/employees',{
                    "first_name": "Sumit",
                    "email": "sumit@gmail.com",
                    "phone_no": "1234567890",
                    "level": "Manager"
                })
                .catch((error=>{                        
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.contain("data must have required property")
                }));
            })
        })        
    })

    describe('GET /employees/:id',()=>{
        describe('When fetching newly added employee',()=>{
            it("should fetch the required employee",async()=>{
                const response = await axios.get('http://127.0.0.1:3000/employees/'+newEmployeeID);
                expect(response.data.id).to.be.a('number');
                expect(response.status).to.equal(200);
            })
        })
        describe('When fetching Unavailable employee',()=>{
            it("should throw status as 404 with a message",async()=>{
                await axios.get('http://127.0.0.1:3000/employees/1234')
                .catch((error=>{                        
                    expect(error.response.status).to.equal(404);
                    expect(error.response.data).to.contain(NoEmployeeError);
                }));
            })
        })
    })
    
    describe('PUT /employees/:id',()=>{
        describe('When Updating a Specific Employee',()=>{
            it('should return employee Data with updated value',async()=>{
                const response = await axios.put('http://127.0.0.1:3000/employees/'+newEmployeeID,{
                    "first_name":"Ashish"
                });
                expect(response.data).to.have.property("first_name","Ashish");
                assert.equal(response.data.id,Number(newEmployeeID));
                expect(response.status).to.equal(200);
            })
        })

        describe('When Updating an Unavailable Employee',()=>{
            it('should throw status 404 with a error message',async()=>{
                await axios.put('http://127.0.0.1:3000/employees/12345',{
                    "first_name":"Ashish"
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(404);
                    expect(error.response.data).to.contain(NoEmployeeWithIDError);
                }));
            })
        })

        describe('When Updating an Available Employee with blank firstName',()=>{
            it('should throw status 400 with a error message',async()=>{
                await axios.put('http://127.0.0.1:3000/employees/'+newEmployeeID,{
                    "first_name":""
                })
                .catch((error=>{                        
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data.error).to.contain("first_name must NOT have fewer than 1 characters");
                }));
            })
        })

        describe('When Updating an Available Employee with blank lastName',()=>{
            it('should throw status 400 with a error message',async()=>{
                await axios.put('http://127.0.0.1:3000/employees/'+newEmployeeID,{
                    "last_name":""
                })
                .catch((error=>{                        
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data.error).to.contain("last_name must NOT have fewer than 1 characters");
                }));
            })
        })

        describe('When Updating an Available Employee with blank phoneNumber',()=>{
            it('should throw status 400 with a error message',async()=>{
                await axios.put('http://127.0.0.1:3000/employees/'+newEmployeeID,{
                    "phone_no":""
                })
                .catch((error=>{                        
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data.error).to.contain("phone number should be a 10 digit number.");
                }));
            })
        })

        describe('When Updating an Available Employee with blank level',()=>{
            it('should throw status 400 with a error message',async()=>{
                await axios.put('http://127.0.0.1:3000/employees/'+newEmployeeID,{
                    "level":""
                })
                .catch((error=>{                
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data.error).to.contain("level must be equal to one of the allowed values");
                }));
            })
        })

        describe('When Updating an Available Employee with new property',()=>{
            it('should throw status 400 with a error message',async()=>{
                await axios.put('http://127.0.0.1:3000/employees/'+newEmployeeID,{
                    "age":"20"
                })
                .catch((error=>{                        
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data.error).to.contain("data must NOT have additional properties");
                }));
            })
        })

        describe('When Updating a non-manager employee level without supervisor data',()=>{
            it('should throw status 400 with a error message',async()=>{
                await axios.put('http://127.0.0.1:3000/employees/'+newEmployeeID,{
                    "level": "Intern"
                })
                .catch((error=>{                        
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data.error).to.contain("data must have required property 'supervisor'");
                }));
            })
        })

        describe('When Updating a non-manager employee level with supervisor data',()=>{
            it('should return employee with updated data',async()=>{
                const response = await axios.put('http://127.0.0.1:3000/employees/'+newEmployeeID,{
                    "level": "Developer",
                    "supervisor":"1677220155582"
                })
                assert.equal(response.data.id,Number(newEmployeeID));
                expect(response.status).to.equal(200);
                expect(response.data).to.have.property("level","Developer");
                expect(response.data).to.have.property("supervisor","1677220155582");
            })
        })
    })

    describe('GET /employees/level?type=""',()=>{
        describe("When fetching employees of particular level",()=>{
            it("should return all employees with given level",async()=>{
                const response = await axios.get('http://127.0.0.1:3000/employees/level?type=Intern');
                const employees:Employee[] = response.data;
                employees.forEach((employee)=>{
                    assert.equal(employee.level, 'Intern');
                })
            })
        })

        describe("When fetching employees of invalid level",()=>{
            it("should throw 404 status with a message",async()=>{
                await axios.get('http://127.0.0.1:3000/employees/level?type=Painter')
                .catch(error=>{
                    expect(error.response.status).to.equal(404);
                    expect(error.response.data).to.have.property('Reason').that.equals('No Employee with Painter type found');
                })
            })
        })
    })
    
    describe("GET /employees/:id/subordinates",()=>{
        describe("When fetching subordinates for particular employee",()=>{
            it("should fetch all subordinates of given employee",async()=>{
                const response = await axios.get("http://127.0.0.1:3000/employees/1677220155582/subordinates")
                assert.isArray(response.data);
                expect(response.data[0].supervisor).to.equal("1677220155582");
            })
        })

        describe('When fetching subordinates of employee with lowest level',()=>{
            it("should throw status as 404 with a message",async()=>{
                await axios.get('http://127.0.0.1:3000/employees/1677239938784/subordinates')
                .catch((error=>{
                    expect(error.response.status).to.equal(404);
                    expect(error.response.data).to.have.property("reason").that.equals("No Subordinate for 1677239938784 found");
                }));
            })
        })
        
        describe('When fetching subordinates of unavailable employee',()=>{
            it("should throw status as 404 with a message",async()=>{
                await axios.get('http://127.0.0.1:3000/employees/16772399784/subordinates')
                .catch((error=>{
                    assert.deepEqual(error.response.statusText,"Not Found")
                    expect(error.response.data).to.have.property("reason").that.equals("No Subordinate for 16772399784 found");
                }));
            })
        })
    })

    describe("GET /employees/:id/superiors",()=>{
        describe("When fetching superiors for particular employee",()=>{
            it("should fetch all superiors of given employee",async()=>{
                const response = await axios.get("http://127.0.0.1:3000/employees/1677239938784/superiors")
                expect(response.data).to.be.an('Array');
                expect(response.data).length.to.be.greaterThan(0);
            })
        })

        describe('When fetching Superior of employee with highest level',()=>{
            it("should throw status as 404 with a message",async()=>{
                await axios.get('http://127.0.0.1:3000/employees/1677220155582/superiors')
                .catch((error=>{
                    expect(error.response.status).to.equal(404);
                    expect(error.response.data).to.have.property("reason").that.equals("No Superior for 1677220155582 found");
                }));
            })
        })
        
        describe('When fetching Superior of unavailable employee',()=>{
            it("should throw status as 404 with a message",async()=>{
                await axios.get('http://127.0.0.1:3000/employees/16772399784/superiors')
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    assert.deepEqual(error.response.statusText,"Bad Request");
                    expect(error.response.data).to.have.property("reason").that.equals("Error");
                }));
            })
        })
    })

    describe("POST /employees/:id/personaldetails",()=>{
        describe("When adding personaldetails of a particular available employee",()=>{
            it("should add the details with status 200",async()=>{
                const response = await axios.post("http://127.0.0.1:3000/employees/"+newEmployeeID+"/personaldetails",newEmployeePersonalData)                
                expect(response.data).to.have.keys('gender','blood_group','marital_status','international_worker','dob','physically_disabled');
            })
        })        
        describe("When adding personaldetails of a unavailable employee",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1234567/personaldetails",newEmployeePersonalData)
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal("Error: No employee with given ID");
                }));
            })
        })
        describe("When adding personaldetails of a available employee with blank gender value",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/personaldetails",{
                    "gender" : "",
                    "blood_group" : "B+",
                    "marital_status" : "Single",
                    "international_worker" : true,
                    "dob"  : "2022-03-01",
                    "physically_disabled" : false
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal("must be equal to one of the allowed values");
                }));
            })
        })
        describe("When adding personaldetails of a available employee with Invalid gender value",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/personaldetails",{
                    "gender" : "Mens",
                    "blood_group" : "B+",
                    "marital_status" : "Single",
                    "international_worker" : true,
                    "dob"  : "2022-03-01",
                    "physically_disabled" : false
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal("must be equal to one of the allowed values");
                }));
            })
        })
        describe("When adding personaldetails of a available employee with blank blood_group value",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/personaldetails",{
                    "gender" : "Male",
                    "blood_group" : "",
                    "marital_status" : "Single",
                    "international_worker" : true,
                    "dob"  : "2022-03-01",
                    "physically_disabled" : false
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal("must be equal to one of the allowed values");
                }));
            })
        })
        describe("When adding personaldetails of a available employee with invalid blood_group value",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/personaldetails",{
                    "gender" : "Male",
                    "blood_group" : "ABC",
                    "marital_status" : "Single",
                    "international_worker" : true,
                    "dob"  : "2022-03-01",
                    "physically_disabled" : false
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal("must be equal to one of the allowed values");
                }));
            })
        })
        describe("When adding personaldetails of a available employee with blank marital_status value",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/personaldetails",{
                    "gender" : "Male",
                    "blood_group" : "B+",
                    "marital_status" : "",
                    "international_worker" : true,
                    "dob"  : "2022-03-01",
                    "physically_disabled" : false
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal("must be equal to one of the allowed values");
                }));
            })
        })
        describe("When adding personaldetails of a available employee with invalid marital_status value",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/personaldetails",{
                    "gender" : "Male",
                    "blood_group" : "B+",
                    "marital_status" : "NA",
                    "international_worker" : true,
                    "dob"  : "2022-03-01",
                    "physically_disabled" : false
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal("must be equal to one of the allowed values");
                }));
            })
        })
        describe("When adding personaldetails of a available employee with blank international_worker value",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/personaldetails",{
                    "gender" : "Male",
                    "blood_group" : "B+",
                    "marital_status" : "Single",
                    "international_worker" : "",
                    "dob"  : "2022-03-01",
                    "physically_disabled" : false
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal("must be boolean");
                }));
            })
        })
        describe("When adding personaldetails of a available employee with blank dob value",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/personaldetails",{
                    "gender" : "Male",
                    "blood_group" : "B+",
                    "marital_status" : "Single",
                    "international_worker" : false,
                    "dob"  : "",
                    "physically_disabled" : false
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal('must match format "date"');
                }));
            })
        })
        describe("When adding personaldetails of a available employee with additional property",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/personaldetails",{
                    "gender" : "Female",
                    "blood_group" : "B+",
                    "marital_status" : "Single",
                    "international_worker" : true,
                    "dob"  : "2022-03-01",
                    "physically_disabled" : false,
                    "name":"Bob"
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal("must NOT have additional properties");
                }));
            })
        })
    })

    describe("POST /employees/:id/employmentdetails",()=>{
        describe("When adding employmentdetails of a particular available employee",()=>{
            it("should add the details with status 200",async()=>{
                const response = await axios.post("http://127.0.0.1:3000/employees/"+newEmployeeID+"/employmentdetails",newEmployeeEmploymentData)
                expect(response.data).to.have.keys('employer','designation','department','location','doj','reporting_manager');
            })
        })
        
        describe("When adding employmentdetails of a unavailable employee",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1234567/employmentdetails",newEmployeeEmploymentData)
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal("Error: No employee with given ID");
                }));
            })
        })

        describe("When adding employmentdetails of a available employee with blank employer value",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/employmentdetails",{
                    "employer" : "",
                    "designation": "Developer",
                    "department" : "Development",
                    "location": "pune",
                    "doj" : "2022-03-01",
                    "reporting_manager" : "Varun"
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.contain("must NOT have fewer than 1 characters");
                }));
            })
        })

        describe("When adding employmentdetails of a available employee with blank designation value",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/employmentdetails",{
                    "employer" : "afour",
                    "designation": "",
                    "department" : "Development",
                    "location": "Pune",
                    "doj" : "2022-03-01",
                    "reporting_manager" : "Varun"
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.contain("must be equal to one of the allowed values");
                }));
            })
        })

        describe("When adding employmentdetails of a available employee with blank department value",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/employmentdetails",{
                    "employer" : "afour",
                    "designation": "Developer",
                    "department" : "",
                    "location": "Pune",
                    "doj" : "2022-03-01",
                    "reporting_manager" : "Varun"
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.contain("must NOT have fewer than 1 characters");
                }));
            })
        })

        describe("When adding employmentdetails of a available employee with blank location value",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/employmentdetails",{
                    "employer" : "afour",
                    "designation": "Developer",
                    "department" : "Development",
                    "location": "",
                    "doj" : "2022-03-01",
                    "reporting_manager" : "Varun"
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.contain("must be equal to one of the allowed values");
                }));
            })
        })
        describe("When adding employmentdetails of a available employee with invalid location value",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/employmentdetails",{
                    "employer" : "afour",
                    "designation": "Sales",
                    "department" : "Development",
                    "location": "",
                    "doj" : "2022-03-01",
                    "reporting_manager" : "Varun"
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.contain("must be equal to one of the allowed values");
                }));
            })
        })

        describe("When adding employmentdetails of a available employee with blank doj value",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/employmentdetails",{
                    "employer" : "afour",
                    "designation": "Developer",
                    "department" : "Development",
                    "location": "Pune",
                    "doj" : "",
                    "reporting_manager" : "Varun"
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal('must match format "date"');
                }));
            })
        })

        describe("When adding employmentdetails of a available employee with additional property",()=>{
            it("should throw status 400 with a message",async()=>{
                await axios.post("http://127.0.0.1:3000/employees/1677220155582/employmentdetails",{
                    "employer" : "afour",
                    "designation": "Developer",
                    "department" : "Development",
                    "location": "Pune",
                    "doj" : "2022-03-01",
                    "reporting_manager" : "Varun",
                    "dob" : "2022-03-01"
                })
                .catch((error=>{
                    expect(error.response.status).to.equal(400);
                    expect(error.response.data).to.equal("must NOT have additional properties");
                }));
            })
        })
    })

    describe("GET /:id/getdetails",()=>{
        describe("When fetching Particular employees Personal and Employment Details",()=>{
            it("should fetch employee's personal and employment Data",async()=>{
                const response = await axios.get("http://127.0.0.1:3000/employees/"+newEmployeeID+"/getdetails")
                expect(response.data).to.have.property("PersonalDetails");
                expect(response.data).to.have.property("EmploymentDetails");
                expect(response.data.PersonalDetails).not.to.be.null;
                expect(response.data.EmploymentDetails).not.to.be.null;
            })
            it("should fetch employee's all personalData property",async()=>{
                const response = await axios.get("http://127.0.0.1:3000/employees/"+newEmployeeID+"/getdetails")
                expect(response.data.PersonalDetails).to.have.keys('gender','blood_group','marital_status','international_worker','dob','physically_disabled');
            })
            it("should fetch employee's all employmentlData property",async()=>{
                const response = await axios.get("http://127.0.0.1:3000/employees/"+newEmployeeID+"/getdetails")
                expect(response.data.EmploymentDetails).to.have.keys('employer','designation','department','location','doj','reporting_manager');
            })
        })

        describe("When fetching unavailable employee Data with Personal and Employment Details",()=>{
            it("should display No Data found for personal and employment Details",async()=>{
                const response = await axios.get("http://127.0.0.1:3000/employees/167722015552/getdetails")
                expect(response.data).to.have.property("PersonalDetails","No Data Found");
                expect(response.data).to.have.property("EmploymentDetails","No Data Found");
                expect(response.status).to.equal(200);
            })
        })

        describe("When fetching employee Data with Personal data available and Employment Details unavailable",()=>{
            it("should display personal Data and No Data found for employment Details",async()=>{
                const response = await axios.get("http://127.0.0.1:3000/employees/1677239938784/getdetails")
                assert.lengthOf(Object.keys(response.data.PersonalDetails), 6);
                expect(response.data).to.have.property("EmploymentDetails","No Data Found");
                expect(response.status).to.equal(200);
            })
        })

        describe("When fetching employee Data with Employment data available and Personal Details unavailable",()=>{
            it("should display Employment Data and No Data found for Personal Details",async()=>{
                const response = await axios.get("http://127.0.0.1:3000/employees/1677220232076/getdetails");
                assert.lengthOf(Object.keys(response.data.EmploymentDetails), 6);
                expect(response.data).to.have.property("PersonalDetails","No Data Found");
                expect(response.status).to.equal(200);
            })
        })

    })

    describe("DELETE /employees/:id",()=>{
        describe("When deleting a particular employee",()=>{
            it("should delete the employee with given id",async()=>{
                const response = await axios.delete('http://127.0.0.1:3000/employees/'+newEmployeeID)
                expect(response.data).to.have.property("id",newEmployeeID);
                expect(response.statusText).to.equal("OK");
            })
        })

        describe("When deleting a unavailable/deleted employee",()=>{
            it("should throw status 404 with a message",async()=>{
                await axios.delete('http://127.0.0.1:3000/employees/'+newEmployeeID)
                .catch((error=>{
                    expect(error.response.status).to.equal(404);
                    expect(error.response.data).to.have.property("reason").that.equals("No employee Found");
                }));
            })
        })
    })
})