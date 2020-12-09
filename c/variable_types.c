#include <stdio.h>

static int xx = 5;
int yy = 10;

/* 
The extern var changes
The static one cannot be referenced outside this class, so it has no effect
The passed in static variable also won't change in the calling scope
 */
void init_vars(int *zz)
{
    printf("extern inside: %d\n", yy);
    yy = 3;
    xx = 2;
    printf("passed static inside before: %d\n", *zz);
    *zz = 100;
    printf("passed static inside after: %d\n", *zz);
}

int add(int a, int b, int c)
{
    return a + b + c;
}