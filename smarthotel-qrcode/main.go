/*
[*] Copyright © 2020
[*] Dev/Author ->  Edwin Nduti
[*] Description:
	The code is a REST API using official mongo-driver,mongo golang driver for generating a qrcode and a pdf.
    Written in pure Golang.
 */

package main

// libraries to use
import (
	"os"
	"log"
	"net/http"
	"github.com/urfave/negroni"
	"github.com/zaam-inc/smarthotelpdfapi/router"
)


// Main function
func main() {
	/*
	   mgo.SetDebug(true)
	   mgo.SetLogger(log.New(os.Stdout,"err",6))

	   The above two lines are for debugging errors
	   that occur straight from accessing the mongo db
	*/

	//Register router{id}
	r := router.Router()

	//Get port
	Port := os.Getenv("PORT")
	if Port == "" {
		Port = "8080"
	}

	// establish logger
	n := negroni.Classic()
	n.UseHandler(r)
	server := &http.Server{
		Handler: n,
		Addr   : ":"+Port,
	}
	log.Printf("Listening on PORT: %s",Port)
	server.ListenAndServe()
}
