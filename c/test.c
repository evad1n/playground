#include <stdio.h>
#include <stdarg.h>
#include "test.h"
#include "pointers.h"
#include "variable_types.h"
#include "threads.h"

int main(int argc, char const *argv[])
{
    // mutate_vars();
    // int x[3] = {10, 2, 3};
    // printf("x[0] is %d\n", x[0]);
    // printf("x[0] is %d\n", --x[0]);
    // printf("x[0] is %d\n", x[0]);
    // int *x |= 5;
    // printf("%d\n", x);
    // pointers_demo();
    // variadic(4, 1, 2, 3, 4);
    // run_threads(8);
    add(3, 4);
    return 0;
}

/* The extern can be modified from any class, but the statics cannot only be modified in the scope they were declared. Unless you pass it in by reference. */
void mutate_vars(void)
{
    extern int yy;
    int xx = 30;
    static int zz = 80;
    printf("static: %d\n", xx);
    printf("extern: %d\n", yy);
    printf("local static: %d\n", zz);
    xx = 50;
    yy = 420;
    init_vars(&zz);
    printf("static: %d\n", xx);
    printf("extern: %d\n", yy);
    printf("local static: %d\n", zz);
}

/* Variable number of parameters */
int variadic(int n_args, ...)
{
    register int i;
    int max, a;
    va_list ap;

    va_start(ap, n_args);
    for (i = 0; i < n_args; i++)
    {
        (a = va_arg(ap, int));
        if (a > max)
            max = a;
        printf("%d\n", a);
    }

    va_end(ap);
    return max;
}