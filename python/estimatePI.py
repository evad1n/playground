import random
import math

# Sample size
# Bigger = more accurate

def estimate_pi(N):
    circlePoints = 0
    for i in range(N):
        x = random.random()
        y = random.random()
        if (x**2 + y**2) <= 1:
            circlePoints += 1
    print(4 * circlePoints/N)

estimate_pi(10000000)

# # Generates a point between (0,0) and (1,1)
# def generatePoint():
#     x = random.random()
#     y = random.random()
#     return x, y

# def calculateDistance(p1, p2):
#     return math.sqrt((p2[0] - p1[0])**2 + (p2[1] - p1[1])**2)

# for i in range(N):
#     points.append(generatePoint())

# # If distance from point to origin (0,0) is less than radius of circle (1) then it is inside the circle
# for p in points:
#     r = p[0]**2 + p[1]**2
#     radius = calculateDistance((0,0), p)
#     if radius < 1:
#         circlePoints += 1


# Area of circle = PI * r^2
# Area of square = (2r)^2 = 4r^2
# => Area of circle / Area of square = PI/4

# print("PI: ", end="")
# print((circlePoints / len(points)) * 4)
