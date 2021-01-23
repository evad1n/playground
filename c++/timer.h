#include <chrono>
#include <string>

class Timer
{
private:
	std::chrono::high_resolution_clock::time_point start;
	std::string name;

public:
	Timer(std::string name);
	~Timer();
};