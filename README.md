# Odin

Odin is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app). Odin makes it easier to manage software development courses using a combination of [Blackboard eLearning platform](https://www.blackboard.com/en-eu) and the [GitLab DevOps platform](https://about.gitlab.com/). 

Odin has been designed and developed by [Petter Grø Rein](https://www.ntnu.edu/employees/pettegre) and [Tore Stensaker Tefre](https://www.ntnu.edu/employees/torestef) as part of a master thesis project supervised by [George Adrian Stoica](https://www.ntnu.edu/employees/stoica) at [The Department of Computer Science (IDI)](https://www.ntnu.edu/idi) at [The Norwegian University of Science and Technology](https://www.ntnu.edu) in Trondheim, Norway.

Why the name Odin? Because we wanted a cool codename for the project. We thought maybe to use the name of a god, and found out that Odin was the god of knowledge and wisdom, very fitting for the context of the project.

## Getting Started

After cloning the project, please install necessary packages:

```bash
yarn
```

Initialize the local database:

```bash
yarn dbinit
```

Then you need to register a Blackboard app, get it approved to retrieve data from a running instance over the api of the instance. This means for NTNU you have to contact NTNU IT and give them the application ID of your application.  [Registration portal for Blackboard applications](https://developer.blackboard.com/portal/applications/create)  
[Picture of Blackboard settings of application can be seen here](https://github.com/GitForEdu/odin/blob/main/documentation/assets/blackboard_settings_odin.png)  

You also need to create an application on Dataporten. Input the redirect url of this app, client_type should be confidential, scopes/rights should be: email, openid, profile, userid and userid-feide. [Registration portal for Dataporten](https://dashboard.dataporten.no/#!/_)  
[Picture or Dataporten settings of application can be seen here](https://github.com/GitForEdu/odin/blob/main/documentation/assets/screenshot_of_settings_dataporten_odin.png)  
[Picture of required scopes for application can be seen here](https://github.com/GitForEdu/odin/blob/main/documentation/assets/scopes_of_odin_dataporten.png)

The last you will need is access to a GitLab instance. This is for later when the application will ask you where to want to host the Git repositories of the course.

Input all of the keys and URLs in a .env.local to overwrite .env (copy the content of .env and fill missing fields)

Because you probably are not registered as an instructor in a course we have created an override in bbinfo.js at line 6. You can input your userName here to get `underviser` status.

Because we want to have an easy development time we will provide and are working on mock/fake instances of GitLab and Blackboard to use with this application.

Now you are good to go on with development, and can run the application with:

```bash
yarn dev
```


Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Learn More

To learn more about the application read the thesis. [Creating a Web Application Supporting Git in Software Development Courses in Higher Education](https://github.com/GitForEdu/odin/blob/main/documentation/FinalThesis.pdf?raw=true).

We will probably create a wiki and add additional information there when we have time.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
