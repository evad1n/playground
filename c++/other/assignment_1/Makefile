# header files come after
# first target is default, just call ">> make"
# to call specific target call ">> make <target_name>"

# target: dependencies
# <tab>command to build

questions_3: ppm_menu.o image_menu.o
	g++ -std=c++11 -o questions_3 ppm_menu.o image_menu.o

ppm_menu.o: ppm_menu.cpp image_menu.h
	g++ -std=c++11 -c ppm_menu.cpp

image_menu.o: image_menu.cpp image_menu.h
	g++ -std=c++11 -c image_menu.cpp

run: questions_3
	./questions_3

clean:
	rm -f questions_3 *.o