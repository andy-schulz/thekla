---
title: Install
parent: Getting Started
has_children: false
nav_order: 1
---

# Environment Setup

Install ``webdriver-manager`` and start the selenium standalone server.

````bash
npm install webdriver-manager -g
webdriver-manager update
webdriver-manager start
```` 

Create a project folder and initialize a npm project.

````bash
mkdir /path/to/you/project
cd /path/to/you/project
npm init # follow the instructions
````

## Install Packages
### thekla
````bash
npm install thekla --save
````

### typescript
````bash
npm install typescript --save
````

## Create the test folder

If you are just setting up a test script repository you can place your all scripts in the main folder. 
Otherwise its good practice to place all test scripts inside a test folder.

Create the test folder ``test`` inside your projects folder.

````bash
mkdir /path/to/your/project/test
````