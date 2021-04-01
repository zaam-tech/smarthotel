package pdf

import (
	"fmt"
	"testing"
)

/* url for testing */
const (
	input string = "https://res.cloudinary.com/shamirjamal/image/upload/v1610357453/smarthotelwebbucket/download_m1fuon.png"
)

/* defined struct for output in DownloadFile */
type ExpectedResult struct {
	FileName string
	Ext      string
	Err      error
}

/* CheckExt Test */
func TestCheckExt(t *testing.T) {
	expected := "png"

	result := CheckExt(input)

	if result != expected {
		t.Errorf("CheckExt(%s) == %s, expected %s", input, result, expected)
	}
}

/* DownloadFile test */
func TestDownloadFile(t *testing.T) {

	expected := ExpectedResult{
		FileName: "Logo.png",
		Ext:      "PNG",
		Err:      nil,
	}

	var result ExpectedResult

	result.FileName, result.Ext, result.Err = DownloadFile(input)

	if result.FileName != expected.FileName && result.Ext != expected.Ext && result.Err != expected.Err {
		t.Errorf("DownloadFile(%s) == %s,%s,%s, expected %s,%s,%s)", input, result.FileName, result.Ext, result.Err, expected.FileName, expected.Ext, expected.Err)
	}
}



/* --- Benchmark the code --- */
// CheckExt code
func BenchmarkCheckExt(b *testing.B){
	for i := 0;i < b.N;i++{
		CheckExt(input)
	}
}

// DownloadFile code
func BenchmarkDownloadFile(b *testing.B){
	for i := 0;i < b.N;i++{
		DownloadFile(input)
	}
}


/* Example code for CheckExt */
func ExampleCheckExt(){
	fmt.Println(CheckExt(input))
	// output : png
}
