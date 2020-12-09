# num = "7040506"

# print(" + ".join(x + '0' * (len(num)- y - 1) for y,x in enumerate(num) if x != '0'))

# print()

# print(" + ".join((str(x)) for x in range(6) if x % 2 == 0))

def FindMaximumSubsequence(array):
    start = 0
    end = len(array)
    total = array[0]

    for i in range(len(array)):
        test = array[i]
        for j in range(i + 1,  len(array)):
            # add all next numbers as long as it doesn't decrease below 0
            test += array[j]

            if(test > total):
                total = test
                start = i
                end = j

            if(test <= 0):
                break

    return start, end

import random
def CreateDuplicateRandomNumbers(n):
    B = []
    for i in range(n):
        r = random.randrange(0,n)
        B.append(r)
    return B

def QuickSort(A, low, high):
    if high <= low:
        return

    # modified stuff
    
    pivot = low + 1
    for i in range(low + 1, high + 1):
        if A[i] < A[low]:
            A[pivot], A[i] = A[i], A[pivot]
            pivot += 1
    A[pivot - 1], A[low] = A[low], A[pivot - 1]

    QuickSort(A, low, pivot - 2)
    QuickSort(A, pivot, high)


# A = [4,2,6,1]
# QuickSort(A, 0, len(A) - 1)
# print(A)

#    0  1  2  3  4  5  6  7  8  9  10 11 12 13 14 15 16 17 18 19 20 21 22 23 24
A = [2,-3, 0, 1, 4,-3,-1, 2,-3, 3, 1,-2,-1, 4, 1,-2, 0, 3, 1,-1, 2,-1, 3,-4, 2]
B = [1,-4,-6, 7,-6, 6,-5, 5,-4, 4,-3, 3,-2, 2,-1, 1, 0,-2, 3,-3, 2,-400,400]
# print(FindMaximumSubsequence(B))

# print(CreateDuplicateRandomNumbers(5))

def SelectionSort(A):
    for i in range(len(A)-1):
        smallestIndex = i
        for j in range(i, len(A)):
            if A[j] < A[smallestIndex]:
                smallestIndex = j
        A[i], A[smallestIndex] = A[smallestIndex], A[i]

# SelectionSort(A)
# print(A)
# print(3/5)
# print(3//5)

def FizzBuzz(n):
    for i in range(1, n+1):
        if i % 3 != 0 and i % 5 != 0:
            print(i, end="")
        if i % 3 == 0:
            print("Fizz", end="")
        if i % 5 == 0:
            print("Buzz", end="")
        print()

# FizzBuzz(30)

w = [False, True, False, True]

[print(i) for i, x in enumerate(w) if x]


def iq_test(numbers):
    numbers = numbers.split(" ")
    ct = []
    for num in numbers:
        if int(num) % 2 == 0:
            ct.append(num)
    if len(ct) > 1:
        for w in numbers:
            if int(w) % 2 == 1:
                return numbers.index(w) + 1
    return numbers.index(ct[0]) + 1


# print(iq_test("2 4 7 8 10"))

import random
def sumOfDice():
    return random.randint(1,10) + random.randint(1,10)


def sumEvens(nums, x):
    return sum(y for y in nums if y % x == 0 )

# print(sumEvens([3,5,6,27,9], 3))

def bothFalse(a, b):
    return not a and not b

# print(bothFalse(True, True))

# print("Hello World!")

def printLast(word):
    if not len(word):
        return
    print(word[-1])
    printLast(word[:-1])

printLast("giggity")