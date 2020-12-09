""" 
I feel like there is a mathematical equation for the greenfly problem, but I can't find it. 
The problem is you start with 1 mature greenfly on day 0. Every day a mature greenfly will produce 8 offspring. 
Offspring take 7 days to mature.
Find the number of greenflies on any given day. 
"""

import matplotlib.pyplot as plt
import numpy as np

from queue import Queue

def greenfly(day) -> int:
	sum = mature = 1
	young = Queue(7)

	for i in range(day):
		if i > 6:
			mature += young.get()
		young.put(mature * 8)
		sum += mature * 8
	return sum	

DAYS = 20

x = list(range(0,DAYS))
y = list(map(greenfly, x))

print(x)
print(y)

# plt.plot(x, y)
# plt.title("Greenfly Growth")
# plt.savefig("greenfly.png")

#       0                  1        
#       1                  9        
#       2                 17        
#       3                 25        
#       4                 33        
#       5                 41        
#       6                 49        
#       7                 57        
#       8                129        
#       9                265        
#      10                465        
#      11                729        