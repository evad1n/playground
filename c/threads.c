#include <stdio.h>
#include <pthread.h>

void *thread_function(void *arg)
{
	for (size_t i = 0; i < 5000; i++)
	{
		printf("%d\n", *(int *)arg);
	}
	return 0;
}

int run_threads(int num_threads)
{
	pthread_t threads[num_threads];
	int nums[num_threads];
	long long int rvalue;

	for (size_t i = 0; i < num_threads; i++)
	{
		nums[i] = i;
		printf("%d\n", nums[i]);
		pthread_create(&threads[i], NULL, &thread_function, &nums[i]);
	}
	for (size_t i = 0; i < num_threads; i++)
	{
		pthread_join(threads[i], (void **)&rvalue);
	}

	return rvalue;
}