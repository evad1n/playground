def primes(n):
    A = [True] * n
    p = 2
    while p**2 < n:
        for i in range(p*2, n, p):
            A[i] = False
        p += 1
    
    return [i for i, x in enumerate(A) if x][2:]

print(primes(100))