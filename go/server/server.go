package main

import (
	"fmt"
	"log"
	"net/http"
)

func main() {
	fmt.Printf("Listening at port 8080\n")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}
