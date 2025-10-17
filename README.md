Budget Tracker
A full-stack web application that helps users manage their budget efficiently by tracking income and expenses.
This project integrates a Django REST API backend with a React-based frontend, deployed on Render and Vercel respectively.


Tech Stack
Frontend: React (Vite)

Backend: Django + Django REST Framework

Database: SQLite

Deployment:

Backend: Render

Frontend: Vercel

Live Demo
Frontend URL: https://budget-tracker-livid-three.vercel.app

Backend API: https://budget-tracker-api-zfok.onrender.com


User registration, login, and authentication

Create, edit, and delete expense entries

Categorize expenses by type (e.g., Salary, Utility, Groceries)

View daily, weekly, and monthly expense summaries

Responsive dashboard with charts

Secured REST API with CORS and token authentication



project-root/
│
├── backend/                # Django backend (Render)
│   ├── manage.py
│   ├── requirements.txt
│   ├── budget_tracker/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   └── api/                # Django REST Framework app
│
├── frontend/               # React frontend (Vercel)
│   ├── src/
│   │   ├── components/
│   │   └── services/
│   ├── package.json
│   ├── vite.config.js
│   └── ...
│
└── README.md


Installation Steps
Backend (Django)
Clone the repository 
  git clone https://github.com/Titanx123/budget-tracker
  cd backend

  
Create a virtual environment

bash
python -m venv venv
source venv/bin/activate


Install dependencies

bash
pip install -r requirements.txt


Apply migrations

bash
python manage.py migrate
Run the development server

bash
python manage.py runserver


Frontend (React)
Navigate to the frontend directory

bash
cd frontend

Install dependencies

bash
npm install
Run the app locally

bash
npm run dev


Frontend runs on http://localhost:3000 and communicates with Django via CORS.



Deployment
Render (Backend)
Add environment variables:

ALLOWED_HOSTS = ['budget-tracker-api-zfok.onrender.com', 'localhost', '127.0.0.1']

CORS_ALLOWED_ORIGINS = ['https://budget-tracker-livid-three.vercel.app', 'http://localhost:3000']

Auto-deploy on push via GitHub

Vercel (Frontend)
Set VITE_API_BASE_URL=https://budget-tracker-api-zfok.onrender.com

Link repository to Vercel and deploy automatically



Method  |  Endpoint                 |  Description                           
--------+---------------------------+----------------------------------------
POST    |  /api/login/              |  Authenticate user and issue JWT tokens
POST    |  /api/register/           |  Register new user //currently in admin only                    
GET     |  /api/categories/         |  Retrieve categories list     //currently in admin only         
POST    |  /api/categories/         |  Create new category         //currently in admin only          
PUT     |  /api/categories/{id}/    |  Update existing category    //currenly in admin only
DELETE  |  /api/categories/{id}/    |  Delete category             //curently in admin only          
GET     |  /api/transactions/       |  Fetch all transactions                
POST    |  /api/transactions/       |  Add new transaction                   
GET     |  /api/transactions/{id}/  |  Retrieve specific transaction         
PUT     |  /api/transactions/{id}/  |  Update transaction                    
DELETE  |  /api/transactions/{id}/  |  Delete transaction                    
GET     |  /api/budgets/            |  Fetch budgets              //not yet in production
POST    |  /api/budgets/            |  Create budget              //not yet in production           
GET     |  /api/dashboard/          |  Retrieve monthly dashboard summary   





 Learning Outcomes
Understand linking React frontend with Django REST API

Deploying full‑stack apps on cloud (Render + Vercel)

Implementing authentication, CRUD, and CORS securely

Structuring professional documentation for development projects




