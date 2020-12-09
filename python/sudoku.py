import random

board = []

def blank_board():
    for i in range(9*9):
        board.append(0)

def generate_random_puzzle(num_filled):
    blank_board()
    filled = 0
    index = 0
    while filled < num_filled:
        index %= 81
        if random.random() < (num_filled / 81):
            board[index] = random.randint(1,9)
            filled += 1
        index += 1

def to_board(row, col):
    return board[(row * 9) + col]

def from_board(index):
    row = index // 9
    col = index - (row * 9)
    return row, col

def print_border():
    print("+-----------------------+")

def print_board():
    for row in range(9):
        if row % 3 == 0:
            print_border()
        for col in range(9):
            if col % 3 == 0:
                print('| ', end='')
            print(to_board(row, col), end=' ')
        print('|')
    print_border()

def check_row(row, val):
    return val not in board[row*9:(row*9)+9]

def check_col(col, val):
    return val not in board[col::9]

def check_square(row, col, val):
    r = (row // 3) * 3
    c = (col // 3) * 3
    square = []
    for i in range(r, r+3):
        for j in range(c, c+3):
            square.append(to_board(i, j))
    return val not in square


def is_valid(row, col, val):
    if not check_row(row, val):
        return False
    if not check_col(col, val):
        return False
    if not check_square(row, col, val):
        return False
    return True

def solve():
    i = 0
    # find next available slot
    while i < 81:
        if board[i] == 0:
            print(i)
            break
        i += 1
    if i < 81:
        for num in range(1,10):
            if is_valid(*from_board(i), num):
                board[i] = num
                solve()
        board[i] = 0
    else:
        print("IMPOSSIBLE")
        return False


def read_input():
    with open(filename) as f:
        while True:
            c = f.read(1)
            if not c:
                print("End of file")
                break
            print("Read a character:", c)

def find_solution():
    print(solve())
    print_board()

generate_random_puzzle(5)
print_board()
find_solution()