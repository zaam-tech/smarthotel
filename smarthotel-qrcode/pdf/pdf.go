/*
-*- The pdf package
-*- The pdf package has the function that impelements the generation of a pdf file
*/

package pdf

import (
	"os"
	"io"
	"fmt"
	"strings"
	"net/http"
	"path/filepath"
	"github.com/jung-kurt/gofpdf"
	"github.com/zaam-inc/smarthotelpdfapi/model"
)

/*
[*] pdf file generator function
[*] Takes five parameters
[*] table, hotel, businessdetails
[*] logo and writer(where the pdf will be outputted.
*/

func GeneratePdf(w io.Writer, qrcode string, table model.Table, hotel model.Hotel, businessInfo model.BusinessDetails) {
	//Create a new pdf with properties below
	//There is A2,A3,A4,A5,Legal,Tabloid,Letter
	pdf := gofpdf.New("P", "mm", "A5", "")

	// add new page
	pdf.AddPage()

	// set font Times,bold of size 27 points
	pdf.SetFont("Times", "B", 16)
	pdf.Ln(33)

	// CellFormat(width, height, text, border, position after, align, fill, link, linkStr)
	pdf.CellFormat(125, 6, strings.ToUpper(hotel.HotelName), "0", 0, "CM", false, 0, "")

	// moves the current position to a new line, with an optional line height parameter.
	pdf.Ln(7)

	// define line to separate qrcode to contacts
	pdf.SetLineWidth(1)
	// Line takes (x1,y1,x2,y2)
	pdf.Line(0, 178, 280, 178)

	//set hotel type
	/* add hotel.type */
	pdf.CellFormat(125, 6, "", "0", 0, "CM", false, 0, "")

	// moves the current position to a new line, with an optional line height parameter.
	pdf.Ln(7)

	// set hotel address
	address := fmt.Sprintf("ADDRESS %s",strings.ToUpper(businessInfo.Address.PostalCode))
	pdf.CellFormat(125, 6, address, "0", 0, "CM", false, 0, "")

	// ImageOptions(src, x, y, width, height,flow, options, link, linkStr)
	if hotel.LogoUrl != ""{
		Logo, ext, _ := DownloadFile(hotel.LogoUrl)
		pdf.ImageOptions(
			/* add logo*/
			Logo,
			35, 0,
			75, 42,
			false,
			gofpdf.ImageOptions{
				ImageType: ext,
				ReadDpi:   true,
			},
			0,
			"",
		)
	}

	/* move centerwards */
	pdf.Ln(7)
	location := fmt.Sprintf("%s, %s.",strings.ToUpper(businessInfo.Address.City),strings.ToUpper(businessInfo.Address.Country))
	pdf.CellFormat(125, 6, location, "0", 0, "CM", false, 0, "")

	pdf.SetFont("Arial", "", 12)

	pdf.Ln(13)

	pdf.CellFormat(125, 6, "USE SMARTHOTEL MOBILE APP", "0", 0, "CM", false, 0, "")

	pdf.SetFont("Arial", "", 17)

	pdf.Ln(8)
	pdf.CellFormat(125, 8, "SCAN THE CODE FOR THE MENU", "0", 0, "CM", false, 0, "")
	pdf.Ln(84)

	// ImageOptions(src, x, y, width, height,flow, options, link, linkStr)
	pdf.ImageOptions(
		qrcode,
		38, 96,
		70, 70,
		false,
		gofpdf.ImageOptions{
			ImageType: "PNG",
			ReadDpi:   true,
		},
		0,
		"",
	)

	/* hotel contacts */
	pdf.SetFont("Times", "", 11)

	// Set footer
	contacts := fmt.Sprintf("%s  |  %s  |  %s",hotel.PhoneNumber,hotel.Website,hotel.Email)
	/*full_Link := fmt.Sprintf("https://%s",hotel.Website)*/
	//contacts, full_Link := SetContacts(hotel)

	pdf.CellFormat(126, 9, contacts, "0", 0, "CM", false, 0, "")
	pdf.Ln(9)

	/* the footer */
	footer := fmt.Sprintf("Powered by Zaam Technologies | Smart Hotel | %s", hotel.Email)
	pdf.CellFormat(127, 9, footer, "0", 0, "CM", false, 0, "")

	//outputed pdf
	pdf.Output(w)
}


/* set contacts and full_Link 
func SetContacts(hotel model.Hotel)(string,string){
	var contacts,full_Link string

	if hotel.Website == "" {
		contacts = fmt.Sprintf("%s  |  %s  ", hotel.PhoneNumber,hotel.Email)
		full_Link = fmt.Sprint("")
		return contacts, full_Link
	}else {
		contacts = fmt.Sprintf("%s  |  %s  |  %s", hotel.PhoneNumber,hotel.Website,hotel.Email)
		full_Link = fmt.Sprintf("https://%s", hotel.Website)
		return contacts, full_Link
	}
}

*/

/* download image from AWS bucket */
func DownloadFile(URL string) (string, string, error) {
	// check extension
	ext := CheckExt(URL)
	capExt := strings.ToUpper(ext)

	// Get the response bytes from the url
	response, err := http.Get(URL)
	if err != nil {
		return "Undisplayed", capExt, err
	}

	defer response.Body.Close()
	if response.StatusCode != 200 {
		return "Received non 200 response code",capExt,nil
	}

	// Create a empty file
	fileName := fmt.Sprintf("Logo.%s",ext)
	file, err := os.Create(fileName)
	if err != nil {
		return "Unattached",capExt,err
	}

	defer file.Close()

	// Write the bytes to the file
	_, err = io.Copy(file, response.Body)
	if err != nil {
		return "Ungotten",capExt,err
	}

	return fileName, capExt, nil
}

func CheckExt(url string) string {
	ext := filepath.Ext(url)
	newExt := ext[1:]
	if newExt == "png" || newExt == "PNG"{
		newExt = "png"
	} else if newExt == "jpg" || newExt == "JPG" || newExt == "jpeg" || newExt == "JPEG" {
		newExt = "jpg"
	}else {
		// default
		newExt = "png"
	}
	return newExt
}
