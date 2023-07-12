
## iMMAP HR Roster
 
### About
 
Welcome to iMMAP HR Roster, also known as iMMAP Careers. This source code represents the website where highly skilled information management officers (IMOs) can register and apply to help organizations improve the quality, timeliness, use, and sharing of critical humanitarian response data and information.

The website manages and maintains a roster of rapidly deployable information management officers and other experts who provide surge capacity support in emergency operations.

Moreover, this website extends its capabilities by providing features for internal iMMAP workers, such as job applications and travelling registrations.

### Installation
 
- **Install** [PHP](https://www.php.net/downloads) and [MySQL](https://www.mysql.com/downloads).
 
- **Install** Composer:
  - Linux: 

      - curl -sS https://getcomposer.org/installer | php

  - Mac: 

      - curl -sS https://getcomposer.org/installer | php
      - mv composer.phar /usr/local/bin/composer
      - chmod +x /usr/local/bin/composer

  - Windows: 
  
      - Download Composer from https://getcomposer.org/Composer-Setup.exe
      - Run the installer

- **Install** [NodeJS](https://nodejs.org/en/download).

- **Install** [PDF Converter](https://wkhtmltopdf.org/downloads.html).

- **Install** Spatie/Laravel/MediaLibrary dependencies: 

  - Linux:

    - `sudo apt install jpegoptim optipng pngquant gifsicle`
    - `npm install -g svgo`
  
  - Mac:

    - `brew install jpegoptim`
    - `brew install optipng`
    - `brew install pngquant`
    - `brew install gifsicle`
    - `npm install -g svgo`

- **Create** a Mailtrap email address at https://mailtrap.io to test and debug the site's email notifications. The Mailtrap's SMTP credentials will be added on the `.env` file.

- **Clone** the HR-Roster project: `git clone https://github.com/iMMAP/HR-Roster.git`

- Open your terminal and go to the HR-Roster **folder**: `cd HR-Roster`

- **Create** and **Setup** the `.env` file at `./HR-Roster`: change the database username and password based on the values from your local database, add the SMTP values from Mailtrap, etc.

  - Find a sample `.env` file at `./HR-Roster/.env.example`

- Use the **database file** located at `database/dev-db/immap_careers_dev_db.sql` to load sample data. 

- **Run** the following commands from your terminal (HR-Roster folder) in order to **build** and run the site:

  - `composer self-update 1.9.0` : To make sure the composer version is compatible with the production server
  - `composer install` : to **(install/update)** libraries the project depends on.
  - `npm install` : to **download** packages and dependencies.
  - `php artisan migrate` : to **run** all outstanding migrations.
  - `php artisan storage:link` : To **create** a symbolic link, so you are able to access the files from the web.
  - `php artisan serve` : to **run** the project. Access it via http://localhost:8000.
  - `npm run watch` : to **reload** the browser whenever we make changes in the source. Access it via http://localhost:3000.

### Development
**Develop** a new feature in a new feature branch, following the next steps:

- `git checkout develop`
- `git pull`
- `git checkout -b IC-xxx-user-story-name`

To test that the new feature **builds** successfully, follow the next steps:

- `git checkout IC-xxx-user-story-name`
- `rm -r public/js/prod/chunks/`
- `composer install`
- `npm install`
- `npm run production`

To **commit** and **push** the new feature to Git, follow the next steps:

- `git checkout IC-xxx-user-story-name`
- `git add .`
- `git commit -m “IC-xxx new user story comments”`
- `git checkout develop`
- `git pull`
- `git checkout IC-xxx-user-story-name`
- `git merge develop` (fix the conflicts, if any, and in case of doubt, assume the remote code is the right one, or ask your team members.)
- `git push`

 ### Folder Structure
The folder structure of the website mostly follows Laravel's 5.8 folder structure: 
 
 - **app** 
 - bootstrap 
 - **config** 
 - **database**
 - public
 - **resources**
 - **routes**
 - **storage**
 - **tests**

 #### Back-end Folders
There are 6 folders covering the back-end code. This includes the APIs the website exposes:
 - The **app** folder, and its subfolders, is where API implementations are found:
    - The **Console** folder contains the schedule and artisan commands files.
    - The **Exceptions** folder consist of the Handler.php file, where custom exception's configurations reside.
    - The **Exports** folder has custom configuration files for exporting Excel files using the package maatwebsite/excel.
    - **Http** folder:
        - The **Controllers** folder, and its subfolders, contains all the controller files that define the functions for the API routes.
        - The **Middleware** folder contains all middleware software used on the website.
    - The **Mail** folder has all the email configurations needed by the website.
    - The **Models** folder, and its subfolders, gathers the business logic of the website.
    - The **Notifications** folder lists the files in charge of sending notification emails such as the one for resetting the password.
    - The **Providers** folder contains the logic from service providers. See our service provider for custom responses at ResponseServiceProvider.php.
    - The **Rules** folder gathers the logic for custom validation rules.
    - The **Traits** folder contains all the PHP Traits used by other files within the project.
 - The **config** folder accommodates all the configuration files of the project. 
 - The **database** folder carries the migrations and seeders files used for the development and update of the website's database. It is also the area where a sample database file resides.
    - dev-db        -> where the sample database file is located.
    - migrations    -> where the migration files are located. 
    - seeds         -> where the seed files are located.
 - The **routes** folder contains the route declarations for the API (see api.php) and front-end (see web.php).
 - The **storage** folder has all the files uploaded by the users, error logs and API documentation. 
    - api-docs  -> where the generated API documentation file is located.
    - app       -> where the files uploaded by the users are located.
    - logs      -> where the error logs are located.
 - The **tests** folder contains the files for Unit and Feature testing.

 #### Front-end Folders
We use the **resources** folder, and its subfolders, to locate all the front-end code.
All the front-end files are located in **resources/js/components/Web** folder.
This is the list of the sub folder under Web folder for the developer to pay attention to:
 - The **assets/css** folder contains the css files.
 - The **common** folder and it's subfolder contains reusable component files.
 - The **config** folder contains configuration files.
 - The **pages** folder and it's subfolder contains page component files.
 - The **permissions** folder contains permission checker files.
 - The **redux** folder:
    - The **actions** folder and it's subfolder contains redux actions files.
    - The **reducers** folder and it's subfolder contains redux reducer files.
    - The **types** folder and it's subfolder contains redux type files.
 - The **routes** folder contains route component files.
 - The **utils** folder contains utility code and function files.
 - The **validations** folder and it's subfolder contains validation files.


