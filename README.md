# NodeAPP
It contains all the Solutions I discovered and implemented for below use case :-

We need to create a small ERP for a company which should be able to perform the following operations 
-- CRUD APIs for employees with all their joining information like -     
- first_name    
- last_name    
- email    
- phone_no    
- level (manager, developers, testers and interns)    
- employee supervisor ? (interns can have developer/testers as supervisor and developers and testers can have managers as supervisor)    
- dob?    
- personal_details?: PersonalDetailsData;    
- employment_details?: EmploymentData;

- CRUD APIs for employees with all their personal information like -     
- gender,    
- blood_group,    
- marital_status,    
- international_worker,    
- doj,    
- physically_disabled- 

CRUD APIs for employees with all their Employment information like -     
- employer,    
- designation,    
- location,    
- department,    
- reporting_manager, 

- For the validation will use json data validator package: 
https://ajv.js.org/packages/ajv-formats.html
