def fac(n):
	if n == 0:
		return 1
	else:
		return n* fac(n-1)


print(fac(7))

# while True:
# 	fac(20)