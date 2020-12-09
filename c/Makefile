CC=gcc
# forces no warnings/errors
STRICT= -Wall -Werror

THREADS= -pthread
# -pthread for threading

all: test

run: test
	./test.exe

test: test.o pointers.o variable_types.o threads.o
	$(CC) $(THREADS) -o test.exe test.o pointers.o variable_types.o threads.o

clean:
	rm -f *.o *.exe *.h.gch