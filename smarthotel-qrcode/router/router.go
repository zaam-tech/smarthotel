/*
++ The router package
++ Major routes are traces here.
++ Only routes are both GET methods.
*/

package router

import(
	"github.com/gorilla/mux"
	"github.com/zaam-inc/smarthotelpdfapi/middlewares"
)

func Router() *mux.Router {
	//Register router{id}
	r := mux.NewRouter().StrictSlash(false)

	// API routes,handlers and methods
	r.HandleFunc("/{tableid}/pdf",middlewares.GetPdfHandler).Methods("GET","OPTIONS")
	r.HandleFunc("/{hotelid}",middlewares.HotelHandler).Methods("GET","OPTIONS")

	// return router
	return r
}
