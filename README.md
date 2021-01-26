# Welcome to the *Interactive System for Personalized Learning* system



## **Installation instructions**

1. Pull this repository

2. run *npm install* in the project folder

3. Configure PostreSQL database:

   - Create new PostgreSQL database

   - Configure db name, username, password and host in the util/database.js

   - run server

     

## **Project structure**

The project is developed using following technologies:

\-    Node.js

\-    Express.js

\-    Sequelize for database interaction

\-    Multer for files uploads

\-    PostgreSQL database

The project utilizes the **Model-View-Controller** (MVC) approach. 

Basic components are in the folders with corresponding names. 

### **Model**

The models are realized using Sequelize module. Each model contains the structure presented by JavaScript object. Based on those objects, the Sequelize creates corresponding tables in the database. Relations between tables are also defines by Sequelize and are configured in the /util/associations.js

### **View**

 The views are presented by ejs templates.

Those templates are organized by corresponding folders:

\- admin - all views that are related to administrative part

\- auth - authorization views

\- author - all views responsible for topics

\- includes - common parts for all views (header, footer, navigation)

The only view that is not in the folders - 404 error view



### **Controller**

Controllers are .js files that contains separate methods for different get and post actions for views. There are 4 different controllers:

\- admin.js - controller for administrative part. It is responsible for user management and domain/area management

\- auth.js - authorization controller that manages signup, login and logout functionality

\- author.js - Topics management (list of topics, adding new topics)

\- error.js - error handling controller

\- 