CC=g++ 
CFLAGS=-Wall -Werror


all: test

run: test
	./test.exe

test: test.o timing.o
	g++ -std=c++11 -o test.exe test.o timing.o
	
clean:
	rm -f test *.o