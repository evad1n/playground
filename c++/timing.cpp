#include <iostream>
#include <sys/time.h>

#include "timing.h"

using namespace std;

double getElapsed(struct timeval start, struct timeval end)
{
	double start_sec = (double)start.tv_sec + ((double)start.tv_usec / 1000000);
	double end_sec = (double)end.tv_sec + ((double)end.tv_usec / 1000000);
	return end_sec - start_sec;
}

void time_diffs()
{
	struct timeval start, end;
	gettimeofday(&start, NULL);

	int x = 0;
	for (size_t i = 0; i < 9999; i++)
	{
		for (size_t i = 0; i < 99999; i++)
		{
			x++;
		}
	}

	gettimeofday(&end, NULL);

	double diff = getElapsed(start, end);

	cout << diff << endl;
}
