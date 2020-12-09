# default convention
all: person

person: person.o
	g++ -std=c++11 -o person person.o main.o

person.o: person.cpp person.h
	g++ -std=c++11 -c person.cpp

main.o: main.cpp person.h
	g++ -std=c++11 -c main.cpp

