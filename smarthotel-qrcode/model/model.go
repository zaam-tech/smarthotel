/*
<*> This is the schema file
<*> It consists of data similar to the ones in the database for corresponse when retrieving.
<*> The schema data will be used to create a pdf and also generate a pdf
*/

package model

import (
	"go.mongodb.org/mongo-driver/bson/primitive"
)

// table data in the schema
type Table struct {
	ID          primitive.ObjectID `bson:"_id" json:"id"`
	TableName   string             `json:"tableName"`
	TableNumber string             `json:"tableNumber"`
	HotelInfo   primitive.ObjectID `json:"hotelInfo"`
}

// the hotel structure
type Hotel struct {
	ID           primitive.ObjectID `bson:"_id"  json:id"`
	HotelName    string             `json:"hotelName"`
	Address      string             `json:"address"`
	BusinessInfo primitive.ObjectID `json:"businessInfo"`
	LogoUrl      string             `json:"logoUrl"`
	Website      string             `json:"hotelWebSite"`
	Email        string             `json:"hEmail"`
	PhoneNumber  string             `json:"hotelPhoneNumber"`
}

// the business details
type BusinessDetails struct {
	ID      primitive.ObjectID `bson:"_id"  json:"id"`
	Address Address            `json:"address"`
}

// the address struct
type Address struct {
	Country    string `json:"country"`
	PostalCode string `json:"postalCode"`
	City       string `json:"city"`
}
