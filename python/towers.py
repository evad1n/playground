count = 1

# (2^n) - 1 moves for a given number of disks n

def main():
    N = input("How many disks? ")
    N = int(N)
    print("\nSolving towers of hanoi with", N, "disks")
    Solve(N, 1, 3, 2)

def Solve(N, source, destination, other):
    global count
    if N == 1:
        print("MOVE", count, ": Move 1 disk from tower", source, "to tower", destination)
        count += 1
    else:
        Solve(N-1, source, other, destination)
        Solve(1, source, destination, other)
        Solve(N-1, other, destination, source)

main()