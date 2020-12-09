#include <vector>
#include <iostream>
#include "person.h"

int main()
{
    std::vector<int> numbers;
    numbers.push_back(14);

    std::cout << numbers[1] << std::endl;

    for (size_t i = 0; i < numbers.size(); i++)
    {
        std::cout << numbers[i] << std::endl;
    }

    return 0;
}