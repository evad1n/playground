import random
import timeout

def blank_board():
    board = []
    for i in range(9*9):
        board.append(0)
    return board

def fill_board_random():
    board = blank_board()
    shuffled = [1,2,3,4,5,6,7,8,9]
    random.shuffle(shuffled)
    solve(board, shuffled)
    return board

def generate_random_puzzle(num_filled):
    """ Will generate a random solvable puzzle. """
    board = fill_board_random()
    for i in range(81-num_filled):
        index = random.randint(0, 80)
        while board[index] == 0:
            index = random.randint(0,80)
        board[index] = 0
    return board

def to_board(board, row, col):
    return board[(row * 9) + col]

def from_board(index):
    row = index // 9
    col = index - (row * 9)
    return row, col

def print_border():
    print("+-----------------------+")

def print_board(board):
    for row in range(9):
        if row % 3 == 0:
            print_border()
        for col in range(9):
            if col % 3 == 0:
                print('| ', end='')
            num = to_board(board, row, col)
            print(num if num != 0 else ' ', end=' ')
        print('|')
    print_border()

def check_row(board, row, val):
    return val not in board[row*9:(row*9)+9]

def check_col(board, col, val):
    return val not in board[col::9]

def check_square(board, row, col, val):
    r = (row // 3) * 3
    c = (col // 3) * 3
    square = []
    for i in range(r, r+3):
        for j in range(c, c+3):
            square.append(to_board(board, i, j))
    return val not in square


def is_valid(board, row, col, val):
    return check_row(board, row, val) and check_col(board, col, val) and check_square(board, row, col, val)

def solve(board, shuffled=[1,2,3,4,5,6,7,8,9]):
    i = 0
    # Find next available slot
    for i in range(0,81):
        # If slot is empty
        if board[i] == 0:
            # Test each valid value
            for num in shuffled:
                if is_valid(board, *from_board(i), num):
                    board[i] = num
                    if solve(board, shuffled):
                        return True
            board[i] = 0
            return False
    return True

def limited_solve(board):
    """ If it is not solved within X seconds then give up. """
    try:
        with timeout.time_limit(0.2):
            return solve(board)
    except timeout.TimeoutException as e:
        return False


def read_board(input):
    board = []
    for digit in input:
        board.append(int(digit))
    return board

def read_formatted_board(input):
    board = []
    for line in input:
        try:
            board.append(int(line))
        except:
            continue
    return board

def find_solution(board):
    print_board(board)
    if limited_solve(board):
        print("Solved")
    else:
        print("Can't be solved")
    print_board(board)

# SAMPLE = "941362007006000400050000619000986001008000900100534000315000090004000500800653124"
# SAMPLE="941362857786195432253847619572986341438271965169534278315428796624719583897653120"

F="""
+-----------------------+
| 2 3 4 | 6 7 8 | 5 1 9 |
| 5 1 6 | 1 4 9 | 2 3 7 |
| 9 1 7 | 2 5 3 | 6 8 4 |
+-----------------------+
| 1 5 2 | 3 9 6 | 4 7 8 |
| 8 6 3 | 4 1 7 | 9 5 2 |
| 4 7 9 | 5 8 2 | 1 6 3 |
+-----------------------+
| 6 2 8 | 9 3 1 | 7 4 5 |
| 7 9 5 | 8 6 4 | 3 2 1 |
| 3 4 1 | 7 2 5 | 8 9 6 |
+-----------------------+
"""

# find_solution(read_board(SAMPLE))
# print_board(fill_board_random())

board = generate_random_puzzle(20)
# # board = generate_one_puzzle(10)
print_board(board)
# print(limited_solve(board))
# print_board(board)
# read_formatted_board(F)