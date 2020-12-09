class A:

    def __init__(self):
        self.number = 27

    def say_hi(self):
        print("hi")

    def say_bye(self):
        print("bye")

    def get_num(self, num):
        return num

    # Needs to have the same function signature as the decorated function
    # Probably can be done **kwargs or an obj/dict parameter
    def decorator(f):
        def wrapper(self, number):
            self.say_hi()
            f(self, number)
            self.say_bye()
            return self.number
        return wrapper

    @decorator
    def test(self, number):
        print(number)
        print(f"I want {number}!")

    # This won't work because the function signature is different
    # @decorator
    # def other(self):
    #     print("dougnut")


a = A()
print(a.test(7))
# print(a.other())