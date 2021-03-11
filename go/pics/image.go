package main

import (
	"image"
	"image/color"
)

type Image struct{}

// ColorModel => RGBA
func (i Image) ColorModel() color.Model {
	return color.RGBAModel
}

// Bounds size
func (i Image) Bounds() image.Rectangle {
	return image.Rect(0, 0, 2000, 2000)
}

// At for making pretty patterns
func (i Image) At(x, y int) color.Color {
	// Default black
	r, g, b, a := 0, 0, 0, 255

	topLeft, topRight, botLeft, botRight := i.corners(x, y)

	x, y = i.quad(x, y)

	transform := func(x, y int) int {
		// return (x * y) / 100
		return (x | y) * 10
		// return x / (y + 1)
		// return int(float64(x%(y+1.0)) / 0.02)
	}

	switch {
	case topLeft:
		r = transform(x, y)
	case topRight:
		g = transform(x, y)
	case botLeft:
		b = transform(x, y)
	case botRight:
		grey := transform(x, y)
		r, g, b = grey, grey, grey
	}

	return color.RGBA{uint8(r), uint8(g), uint8(b), uint8(a)}
}

func inside(x, y int, rect image.Rectangle) bool {
	return (x > rect.Min.X &&
		x < rect.Max.X &&
		y > rect.Min.Y &&
		y < rect.Max.Y)
}

func (i Image) quad(x, y int) (int, int) {
	// Corner patterns
	if x > i.Bounds().Dx()/2 {
		x = i.Bounds().Dx() - x
	}
	if y > i.Bounds().Dy()/2 {
		y = i.Bounds().Dy() - y
	}
	return x, y
}

func (i Image) radialize(x, y int) (int, int) {
	// Corner patterns
	if x > i.Bounds().Dx()/2 {
		x = i.Bounds().Dx() - x
	}
	if y > i.Bounds().Dy()/2 {
		y = i.Bounds().Dy() - y
	}
	return x, y
}

func (i Image) corners(x, y int) (topLeft, topRight, botLeft, botRight bool) {
	width, height := i.Bounds().Dx(), i.Bounds().Dy()

	switch {
	case inside(x, y, image.Rect(0, 0, width/2, height/2)):
		topLeft = true
	case inside(x, y, image.Rect(width/2, 0, width, height/2)):
		topRight = true
	case inside(x, y, image.Rect(0, height/2, width/2, height)):
		botLeft = true
	case inside(x, y, image.Rect(width/2, height/2, width, height)):
		botRight = true
	}
	return
}
