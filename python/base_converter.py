import math

alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ"

# create table to convert from base 10 up to base 36
tableTo = {}
for i in range(10):
    tableTo[str(i)] = i

for i in range(len(alphabet)):
    tableTo[str(i+10)] = alphabet[i]

# create table to convert from up to base 36 to base 10
tableFrom = {}
for i in range(10):
    tableFrom[str(i)] = i

for i in range(len(alphabet)):
    tableFrom[alphabet[i]] = i+10


# convert (num) in base (baseFrom) to string (converted) in base (baseTo)
def convert(baseFrom, num, baseTo):
    # convert letters to uppercase
    num = str(num).upper()

    # convert to base 10 number (computer only recognizes base 10 math)
    num10 = 0
    for i in range(len(num)):
        num10 += tableFrom[num[i]] * (baseFrom ** ((len(num)-1) - i))

    converted = ""

    # find number of digits
    count = math.floor(math.log(num10, baseTo) + 1)

    # for every digit
    for i in range(count - 1, -1, -1):
        # divide, take digit and leave remainder
        digit = str(tableTo[str(num10 // (baseTo ** (i)))])
        converted += digit

        # get remainder and repeat
        num10 %= (baseTo ** i)

    return converted

def main():
    opt = ""
    while opt != "exit":
        print("\nConvert any whole number from any base up to 36 to the equivalent number in up to base 36!")
        baseFrom = input("Initial base: ")

        while int(baseFrom) <= 1:
            print("Base must be greater than 1")
            baseFrom = input("Initial base: ")

        neg = ""
        num = input("Number: ")
        if num[0] == "-":
            neg = "-"
            num = num[1:]

        baseTo = input("Base to convert to: ")
        while int(baseTo) <= 1:
            print("Base must be greater than 1")
            baseTo = input("Base to convert to: ")

        print(neg + convert(int(baseFrom), num, int(baseTo)))
        opt = input(
            "\nType 'exit' to quit, or simply press ENTER to convert a different number\n")


main()
