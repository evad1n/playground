package main

import (
	"image"
	"image/png"
	"log"
	"os"
)

func main() {
	createImage(Image{})
}

func createImage(m image.Image) {
	f, err := os.Create("img.png")
	if err != nil {
		log.Fatalf("creating file: %v", err)
	}
	defer f.Close()
	if err := png.Encode(f, m); err != nil {
		log.Fatalf("encoding to png: %v", err)
	}
}
