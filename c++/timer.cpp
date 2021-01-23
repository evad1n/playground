#include <chrono>
#include <iostream>
#include <string>

#include "timer.h"

Timer::Timer(std::string name)
	: name(name)
{
	this->start = std::chrono::high_resolution_clock::now();
}

Timer::~Timer()
{
	auto end = std::chrono::high_resolution_clock::now();
	double elapsed = std::chrono::duration_cast<std::chrono::microseconds>(end - this->start).count();
	std::cout << "Function '" << name << "' took " << elapsed / 1000000.0 << " seconds." << std::endl;
}