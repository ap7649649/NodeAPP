import { Employee,Emplevels } from "../../interfaces/employeeInterface"

export const defaultEmployees:Employee[] = [
  {
    "id": 1677220155582,
    "first_name": "Shruti",
    "last_name": "kamath",
    "email": "shruti@gmail.com",
    "phone_no": "1234567890",
    "level": Emplevels.manager
  },
  {
    "id": 1677220190700,
    "first_name": "Tanaya",
    "last_name": "leo",
    "email": "tanaya@gmail.com",
    "phone_no": "1234567890",
    "level": Emplevels.developer,
    "supervisor": "1677220155582"
  },
  {
    "id": 1677220232076,
    "first_name": "Manoj",
    "last_name": "marico",
    "email": "manoj@gmail.com",
    "phone_no": "1234567890",
    "level": Emplevels.tester,
    "supervisor": "1677220155582"
  },
  {
    "id": 1677239938784,
    "first_name": "Soham",
    "last_name": "Patel",
    "email": "soham@gmail.com",
    "phone_no": "1234567890",
    "level": Emplevels.intern,
    "supervisor": "1677220155582"
  }
]

const employmentData = {
    "1677220155582": {
        "employer": "Afour",
        "designation": "Manager",
        "department": "Organisation",
        "location": "Pune",
        "reporting_manager": "",
        "doj": "2008-03-01"
    },
      "1677220190700": {
        "employer": "Afour",
        "designation": "Developer",
        "department": "Development",
        "location": "Pune",
        "reporting_manager": "1677220155582",
        "doj": "2021-03-01"
    },
    "1677220232076": {
        "employer": "Afour",
        "designation": "Tester",
        "department": "QA",
        "location": "Pune",
        "reporting_manager": "1677220155582",
        "doj": "2021-03-01"
    }
}

const personalData = {
    "1677220155582": {
        "gender": "Female",
        "blood_group": "AB+",
        "marital_status": "Married",
        "international_worker": true,
        "dob": "1998-03-01",
        "physically_disabled": false
    },
    "1677220190700": {
        "gender": "Female",
        "blood_group": "B+",
        "marital_status": "Married",
        "international_worker": false,
        "dob": "2000-03-01",
        "physically_disabled": false
    },
    "1677239938784": {
        "gender": "Male",
        "blood_group": "A-",
        "marital_status": "Married",
        "international_worker": true,
        "dob": "2022-03-01",
        "physically_disabled": true
    }
}

