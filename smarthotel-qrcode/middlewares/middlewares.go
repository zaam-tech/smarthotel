package middlewares

// libraries to use
import (
	"context"
	"encoding/json"
	"fmt"
	"github.com/gorilla/mux"
	go_qrcode "github.com/skip2/go-qrcode"
	"github.com/zaam-inc/smarthotelpdfapi/model"
	"github.com/zaam-inc/smarthotelpdfapi/pdf"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"log"
	"net/http"
	"os"
	"time"
)

// database and collection names are statically declared

const database, collection = "smarthotel", "tables"

// create connection to mongodb
func CreateConnection() (*mongo.Client, error) {
	// connect to mongodb
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	// set MONGOURI
	MongoURI := os.Getenv("MONGOURI")

	// connect to mongodb
	client, err := mongo.Connect(ctx, options.Client().ApplyURI(
		MongoURI,
	))
	Check(err)

	// return client and error
	return client, nil
}

// handle error
func Check(err error) {
	if err != nil {
		log.Fatal(err)
	}
}

// Generating qrcode with string type
func GenerateStringOfQrcode(myTable model.Table) (string, error) {

	out, err := json.Marshal(myTable)
	Check(err)

	values := fmt.Sprintf(string(out))

	var filename string = "qr.png"
	err = go_qrcode.WriteFile(values, go_qrcode.Medium, 256, filename)
	Check(err)

	return filename, nil
}

// Generating qrcode with byte type
func GenerateByteOfQrcode(myTable model.Table) ([]byte, error) {

	out, err := json.Marshal(myTable)
	Check(err)

	values := fmt.Sprintf(string(out))

	var fileInByte []byte
	fileInByte, err = go_qrcode.Encode(values, go_qrcode.Medium, 256)
	Check(err)

	return fileInByte, nil
}

// /GET pdf handler
func GetPdfHandler(w http.ResponseWriter, r *http.Request) {
	// get tableid
	vars := mux.Vars(r)
	table_id, err := primitive.ObjectIDFromHex(vars["tableid"])
	Check(err)

	var table model.Table

	// create connection
	client, err := CreateConnection()
	Check(err)

	// select db and collection
	cTable := client.Database(database).Collection(collection)
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)

	defer cancel()

	/*^^	TABLE  DOC	^^*/

	// find table document
	err = cTable.FindOne(ctx, bson.M{"_id": table_id}).Decode(&table)
	Check(err)

	/*^^	HOTEL  DOC	^^ */

	// get hotelId
	//hotel_id,err := primitive.ObjectIDFromHex(table.HotelInfo)
	hotel_id := table.HotelInfo
	//Check(err)

	var hotel model.Hotel

	// get hotel collection
	cHotel := client.Database(database).Collection("hotels")
	// get hotel document
	err = cHotel.FindOne(ctx, bson.M{"_id": hotel_id}).Decode(&hotel)
	Check(err)

	/*^^	BUSINESSDETAILS	DOC	^^*/

	// get businessInfoId
	//businessInfo_id,err := primitive.ObjectIDFromHex(hotel.BusinessInfo)
	businessInfo_id := hotel.BusinessInfo
	// Check(err)

	var businessInfo model.BusinessDetails

	// get businessDetails collection
	cBusinessDetails := client.Database(database).Collection("businessdetails")
	// get businessdetails document
	err = cBusinessDetails.FindOne(ctx, bson.M{"_id": businessInfo_id}).Decode(&businessInfo)
	Check(err)

	/**** Generate Qrcode & PDF given the parameters ****/

	// qrcode
	qrcode, err := GenerateStringOfQrcode(table)
	Check(err)

	// set headers with the filename to be generated
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Method", "GET")
	// get time and tablename & table number plus concatenate to form pdf
	now := time.Now()
	currentDate := now.Format("2006-01-02_3:4:5_pm")
	filename := fmt.Sprintf("Table_%s_%s", table.TableNumber, currentDate)

	fileDetails := fmt.Sprintf("attachment; filename=%s.pdf", filename)
	w.Header().Set("Content-Disposition", fileDetails)
	w.WriteHeader(http.StatusOK)

	// generate pdf function
	pdf.GeneratePdf(w, qrcode, table, hotel, businessInfo)
}




/* GET hotel data */
func HotelHandler(w http.ResponseWriter,r *http.Request){
	/*^^    HOTEL  DOC      ^^ */

	// get hotelId
	vars := mux.Vars(r)
	hotel_id,err := primitive.ObjectIDFromHex(vars["hotelid"])
	Check(err)
							      var hotel interface{}

	// create connection
	client, err := CreateConnection()
	Check(err)

	// select db and collection
	cHotel := client.Database(database).Collection("hotels")
	ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)

	defer cancel()

        // get hotel document
	err = cHotel.FindOne(ctx, bson.M{"_id": hotel_id}).Decode(&hotel)
	Check(err)

	// set headers with the filename to be generated
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Method", "GET")
	w.WriteHeader(http.StatusOK)

	// write 
	json.NewEncoder(w).Encode(hotel)
}
