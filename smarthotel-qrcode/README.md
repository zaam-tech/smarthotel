# SmartHotelPdfAPI

[![Build Status](https://travis-ci.com/zaam-inc/smarthotelpdfapi.svg?token=nDQCvsqiU235MowksLxc&branch=master)](https://travis-ci.com/zaam-inc/smarthotelpdfapi)
![License: MIT](https://img.shields.io/badge/Language-Golang-blue.svg)
![License: MIT](https://img.shields.io/badge/Database-MongoDB-lightgreen.svg)

A REST-API that retrieves data from MongoDB tables collection, generates the qrcode, retrieves data from hotel and businessDetails collection and attaches that data(qrcode inclusive) to an automatically generated PDF.


A REST API made in Golang.
### Requirements


<ul>
<li>GOLANG</li>
<li>A BROWSER</li>
<li>MONGO COMPASS GUI</li>
</ul>


You can run it locally(if you have the data collection in your machine)  and online:

##### Locally

```bash
$ git clone https://github.com/zaam-inc/smarthotelpdfapi.git     #clone the git repo
$ cd smarthotelpdfapi   #change directory 
$ go mod download     #Install app dependencies
$ export MONGOURI=mongodb://localhost:27017  #set mongoURI
$ sudo service mongod start  #start mongo service
$ go run main.go       #run the app
```

Available locally:

| function              |   path                    |   method  |
|   ----                |   ----                    |   ----    |
| display pdf		|   /{tableid}/pdf           		|	GET  |


##### Online


Click [here](https://zaampdf.herokuapp.com/6012573bdba2930017ced602/pdf) for sample test

The format is:
https://zaampdf.herokuapp.com/{tableid}/pdf



Have Fun!
