package main

import (
	"fmt"
	"io/ioutil"
	"net/http"

	"rsc.io/quote"
)

func main() {
	fmt.Println(quote.Go())
	go screw("yourself")
	requestServer()
	go doSomething()
}

func screw(a string) {
	fmt.Println("I had to..")
}

func requestServer() {
	resp, err := http.Get("http://localhost:8080")
	fmt.Println(err)
	defer resp.Body.Close()
	body, err := ioutil.ReadAll(resp.Body)
	fmt.Printf("\nWebserver said: `%s`", string(body))
}

func doSomething() {
	for i := 0; i < 100; i++ {
		fmt.Println(i)
	}
}
