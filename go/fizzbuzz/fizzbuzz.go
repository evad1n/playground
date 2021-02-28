package main

// import (
// 	"fmt"
// 	"sync"
// )

// const limit = 100000000

// /* The goroutines definitely run faster
// Got faster as CPU warmed up or something, I could avg them but who cares
// standard (10^8): ~5s
// goroutines (10^8 with 1 goroutines): 5.126s
// goroutines (10^8 with 2 goroutines): 3.591s
// goroutines (10^8 with 4 goroutines): 3.065s
// goroutines (10^8 with 8 goroutines): 2.783s I have 8 cores
// goroutines (10^8 with 20 goroutines): 2.679s
// goroutines (10^8 with 50 goroutines): 2.666s

// Clearly some diminishing returns
// */

// func main() {
// 	goroutines(limit, 1)
// 	// standard(limit)
// }

// func standard(num int) {
// 	output := make([]string, num)
// 	for i := 0; i < num; i++ {
// 		output[i] = fizzbuzz(i)
// 	}
// }

// func goroutines(num int, numThreads int) {
// 	var wg sync.WaitGroup

// 	chunkSize := num / numThreads

// 	output := make([]string, num)
// 	for i := 0; i < numThreads; i++ {
// 		wg.Add(1)
// 		go fizzBuzzThread(&wg, i*chunkSize, (i*chunkSize)+chunkSize, &output)
// 	}
// 	wg.Wait()
// 	// for _, line := range output {
// 	// 	fmt.Println(line)
// 	// }
// }

// func fizzBuzzThread(wg *sync.WaitGroup, start int, end int, out *[]string) {
// 	defer wg.Done()
// 	for i := start; i < end; i++ {
// 		(*out)[i] = fizzbuzz(i)
// 	}
// }

// func fizzbuzz(i int) string {
// 	n := 0
// 	if i%3 == 0 {
// 		n++
// 	}
// 	if i%5 == 0 {
// 		n += 2
// 	}

// 	switch n {
// 	case 1:
// 		return "Fizz"
// 	case 2:
// 		return "Buzz"
// 	case 3:
// 		return "FizzBuzz"
// 	default:
// 		return fmt.Sprint(i)
// 	}
// }
