package main

import (
	"fmt"
	"log"
	"net/http"
	"strconv"
)

func main() {
	fileServer := http.FileServer(http.Dir("./static"))
	http.Handle("/", fileServer)

	http.HandleFunc("/hello", helloHandler)
	http.HandleFunc("/form", formHandler)

	http.HandleFunc("/secret", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Shhh... it's a secret!")
	})
	http.HandleFunc("/dog", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Woof!")
	})

	fmt.Printf("Listening at port 8080\n")
	if err := http.ListenAndServe(":8080", nil); err != nil {
		log.Fatal(err)
	}
}

func helloHandler(w http.ResponseWriter, r *http.Request) {
	if r.URL.Path != "/hello" {
		http.Error(w, "404 not found.", http.StatusNotFound)
		return
	}

	if r.Method != "GET" {
		http.Error(w, "Method not supported", http.StatusNotFound)
		return
	}

	fmt.Fprintf(w, "Hello!")
}

func formHandler(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseForm(); err != nil {
		fmt.Fprintf(w, "ParseForm() err: %v", err)
		return
	}

	fmt.Fprintf(w, "POST successful\n")
	name := r.FormValue("name")
	age, err := strconv.Atoi(r.FormValue("age"))
	if err != nil {
		fmt.Fprintf(w, "age isn't a number?")
		return
	}

	fmt.Fprintf(w, "Name: %s\n", name)
	fmt.Fprintf(w, "Age: %d\n", age)
}
