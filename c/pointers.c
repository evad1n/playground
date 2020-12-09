#include <stdio.h>
#include <stdlib.h>
#include "pointers.h"

void pointers_demo(void)
{
    int a[4];
    int *b = malloc(16);
    int *c;
    int i;

    printf("1: a = %p, b = %p, c = %p\n", a, b, c);

    c = a;
    for (i = 0; i < 4; i++)
        a[i] = 100 + i;
    c[0] = 200;
    printf("2: a[0] = %d, a[1] = %d, a[2] = %d, a[3] = %d\n", a[0], a[1], a[2], a[3]);

    c[1] = 300;
    *(c + 2) = 301;
    3 [c] = 302;
    printf("3: a[0] = %d, a[1] = %d, a[2] = %d, a[3] = %d\n", a[0], a[1], a[2], a[3]);

    // c is now pointing 4 bytes (size of int) ahead of a
    c = c + 1;
    *c = 400;
    printf("4: a[0] = %d, a[1] = %d, a[2] = %d, a[3] = %d\n", a[0], a[1], a[2], a[3]);

    // IMPORTANT: STORED AS SIGNED 2'S COMPLEMENT

    // IMPORTANT: USES LITTLE ENDIAN MODE IN WHICH LEAST SIGNIFICANT BIT IS STORED FIRST
    // e.g. read the individual bits in order, but read the bytes in reverse

    // c
    // |
    // V
    // a[1]                                a[2]
    // 10010000 00000001 00000000 00000000 00101101 00000001 00000000 00000000

    c = (int *)((char *)c + 1);

    // c is now pointing 5 bytes (size of int + size of char) ahead of a
    // c = a[1.25]
    //          c
    //          |
    //          |
    // a[1]     V                          a[2]
    // 10010000 00000001 00000000 00000000 00101101 00000001 00000000 00000000

    *c = 500;
    // leaves least significant byte of a[1] which leaves 144 (400 % 256 = 144)
    // adds in new 500 value, but 1 byte ahead of a[1]
    // effectively bitshifts new added value (500) left by 8 (1 byte) which multiples by 256 (2^8) => 500 * 256 = 128000
    // Now a[1] is comprised of the remaining least significant bits + new bits => 144 + 128000 = 128144

    // a[2] now has all its least significant bits removed due to them being overwritten by the most significant bits of 500 (which is just an empty byte {00000000})
    // It is left with just the three most significant bytes, which then get reincorporated with the end of a[1.25]
    // In this case the result is 256 ((301 // 256) * 256)
    // {//} is integer division

    // 11110100 00000001 00000000 00000000 = 500
    //          c
    //          |
    //          |
    // a[1]     V                          a[2]
    // 10010000 11110100 00000001 00000000 00000000 00000001 00000000 00000000
    printf("5: a[0] = %d, a[1] = %d, a[2] = %d, a[3] = %d\n", a[0], a[1], a[2], a[3]);

    b = (int *)a + 1;
    c = (int *)((char *)a + 1);
    printf("6: a = %p, b = %p, c = %p\n", a, b, c);
}