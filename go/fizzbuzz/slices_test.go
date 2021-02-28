package main

import (
	"testing"
)

const (
	size   = 20
	insert = 1000
)

// go test slices_test.go -benchmem -bench=. -count=1

func BenchmarkStack(b *testing.B) {
	for N := 0; N < b.N; N++ {
		s := make([]int, size)
		for i := 0; i < size; i++ {
			s[i] = insert
		}
	}
}

func BenchmarkStackRange(b *testing.B) {
	for N := 0; N < b.N; N++ {
		s := make([]int, size)
		for i := range s {
			s[i] = insert
		}
	}
}

func BenchmarkHeap(b *testing.B) {
	var s []int
	for N := 0; N < b.N; N++ {
		s = make([]int, size)
		for i := range s {
			s[i] = insert
		}
	}
}

func BenchmarkNaive(b *testing.B) {
	for N := 0; N < b.N; N++ {
		var s []int
		for i := 0; i < size; i++ {
			s = append(s, insert)
		}
	}
}
