<?php

namespace App\Http\Controllers\API;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MatchingController extends Controller
{
    public function matchingTest() {

        // FROM iMMAP
        $responsibilities = [
            'reporthub-tor' => 'Requirements gathering and implementation of ReportHub for real-time reporting and statistical analysis in country level contexts based on the country level Humanitarian Response Plan (HRP).
            Server setup, administration, management and optimization including documentation.
            Data Platform software development under TDD approach following the Agile process with task breakdowns, sprint goals and sprint reviews.
            Identification of new technologies and methods to improve the maintainability and scalability of the application.'
        ];

        $qualifications = [
            'reporthub-tor' => 'University degree in Information Technology, mathematics, statistics or related area.
            5 years of relevant work experience in the design and implementation of web development applications.
            Experience with Git, Linux, PostgreSQL / PostGIS, MongoDB, Node.js, AngularJS.
            Experience developing, documenting and maintaining RESTful API data services.
            Experience in the design and implementation training and capacity building.
            Experience with Agile development and Test-Driven Development (TDD) approach.
            Experience with HTML, CSS, Material Design, JavaScript, ES6, TypeScript, Gulp, Bower, xlsForms (Kobo, ONA, ODK).
            Experience with location-based data storage, data formats, manipulation and analysis.
            Experience with training and capacity building.
            Knowledge of UN cluster approach.
            Knowledge of PostGIS, and spatial coordinate reference systems.'
        ];

        // FROM CANDIDATE
        $experiences = [
            'arief-luthfi-aulia' => 'Build a web-based application, Toyota Logistic System (TLS), for PT. Toyota Astra Motor using angularJS, typescript, html, css for frontend. Using C#, .Net Framework for backend and SQL Server for its database. This project also applies the MVC model as an architecture in developing projects. And using GIt in the process of managing the source code.
            Build installment billing system for finance companies using Java, SQL Server, Spring MVC, MyBatis and Ajax.
            Build a desktop application using Java programming and MySql database.
            Conduct an analysis of user needs and design a system that can answer the user’s needs. Build a company website using wordpress CMS tools, and MySQL database.
            Managing information systems for reporting greenhouse gas (GHG) emissions that have been made by third parties, and transferring knowledge to the users.
            Creating and organizing information system socialization activities for reporting greenhouses gas emissions for the industry and making accountability for these activities',

            'muhammad-faiz' => 'Creating a Web-based Enterprise Resource Planning (ERP) System for companies that produce some products with programming languages using .Net as a back-end programmer and TFS as a control system.
            Creating a web dashboard to showcase the budget along with its realization and then show the results in graphic as front-end programmer with AngularJS and Git as control system
            Make a web application to serve business process management for Joint Operating Body (JOB) Tomori PT Pertamina as back-end programmer using java and Git for control system',

        ];

        $skills = [
            'arief-luthfi-aulia' => 'ASP.NET, SQL SERVER, ANGULAR JS, HTML, GIT, COMMUNICATION, ORGANIZATION, TEAM PLAYER, CREATIVITY, SOCIAL, BAHASA, ENGLISH',
            'muhammad-faiz' => 'C/C++/C#, Java, .NET, PHP, SQL, Python, HTML, CSS, MySQL, PostgreSQL, Ms. Access, Microsoft Visual Studio, Netbeans, Git, TFS, Codeigniter, Laravel, AngularJS',
        ];

        // SET UP BY US
        $notNeededWords = [
            "i","you","they","we","us","he","she","it","its","me","am","are","have","has","had","a","an","as","if","than","then","the","this",
            "to","or","of","on","for","and","in","out","with","using","also","that","can","by","these"
        ];

        $person = "muhammad-faiz";
        $vacancy = "reporthub-tor";
        $responsibilitiesToR = array_diff(explode(" ", strtolower(preg_replace("/\s\s+/", " ", preg_replace("/[^a-zA-Z0-9 ]+/", "", $responsibilities[$vacancy]." ".$qualifications[$vacancy])))), $notNeededWords);
        $experiencesCleaned = array_diff(explode(" ", strtolower(preg_replace("/\s\s+/", " ", preg_replace("/[^a-zA-Z0-9 ]+/", "", $experiences[$person]." ".$skills[$person])))), $notNeededWords);
        $sameWords = array_count_values(array_intersect($experiencesCleaned, $responsibilitiesToR));

        return response()->success(__('crud.success.default'), $sameWords);
    }
}
