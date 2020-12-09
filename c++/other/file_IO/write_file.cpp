#include <iostream>
#include <fstream>
#include <string>
#include <vector>
#include <cstdlib>
#include <time.h>

int main()
{
    std::string file_name = "greetings.txt";
    std::string binary_file_name = "binary_greetings.txt";
    std::string msg = "Hello World!";

    std::ofstream fout(file_name);
    fout << msg << std::endl;
    fout.close();

    std::ofstream fout2(binary_file_name);
    for (unsigned int i = 0; i < msg.size(); i++)
    {
        unsigned char c = msg[i];
        fout2.write((char *)&c, 1);
    }
    fout2.close();

    for (unsigned int i = 0; i < msg.size(); i++)
    {
        std::cout << (int)msg[i] << " ";
    }
    std::cout << std::endl;

    std::cout << (char)72 << (char)87 << std::endl;

    std::srand(time(0));

    std::cout << std::rand() % 1000 << std::endl;

    return 0;
}