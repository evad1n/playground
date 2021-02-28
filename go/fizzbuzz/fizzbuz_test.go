package main

import (
	"fmt"
	"testing"
)

/* The goroutines definitely run faster
Got faster as CPU warmed up or something, I could avg them but who cares
standard (10^8): ~5s
goroutines (10^8 with 1 goroutines): 5.126s
goroutines (10^8 with 2 goroutines): 3.591s
goroutines (10^8 with 4 goroutines): 3.065s
goroutines (10^8 with 8 goroutines): 2.783s I have 8 cores
goroutines (10^8 with 20 goroutines): 2.679s
goroutines (10^8 with 50 goroutines): 2.666s

Clearly some diminishing returns
*/

const limit = 100000000

func BenchmarkStandard(b *testing.B) {
	for N := 0; N < b.N; N++ {
		output := make([]string, limit)
		for i := 0; i < limit; i++ {
			output[i] = fizzbuzz(i)
		}
	}
}

func BenchmarkParallel(b *testing.B) {
	for N := 0; N < b.N; N++ {
		// b.RunParallel()
		output := make([]string, limit)
		for i := 0; i < limit; i++ {
			output[i] = fizzbuzz(i)
		}
	}
}

func BenchmarkGoroutines(b *testing.B) {
	const numThreads = 4
	chunkSize := b.N / numThreads
	for N := 0; N < b.N; N++ {
		done := make(chan struct{})

		output := make([]string, limit)
		for i := 0; i < numThreads; i++ {
			go func(i int) {
				fizzBuzzThread(i*chunkSize, (i*chunkSize)+chunkSize, &output)
				done <- struct{}{}
			}(i)
		}
		// Wait for finish
		for i := 0; i < numThreads; i++ {
			<-done
		}
	}
}

func fizzBuzzThread(start int, end int, out *[]string) {
	for i := start; i < end; i++ {
		(*out)[i] = fizzbuzz(i)
	}
}

func fizzbuzz(i int) string {
	n := 0
	if i%3 == 0 {
		n++
	}
	if i%5 == 0 {
		n += 2
	}

	switch n {
	case 1:
		return "Fizz"
	case 2:
		return "Buzz"
	case 3:
		return "FizzBuzz"
	default:
		return fmt.Sprint(i)
	}
}
