import math
import tkinter as tk
from tkinter.constants import END

# Set up GUI

window = tk.Tk()
window.title("Base Converter")

window.rowconfigure(0)
window.rowconfigure(1)
window.rowconfigure(2)
window.rowconfigure(3)
window.rowconfigure(4)
window.rowconfigure(5)
window.rowconfigure(6)

window.columnconfigure(0)
window.columnconfigure(1)

lbl_title = tk.Label(text="Base Converter")
lbl_title.grid(row=0, columnspan=2, pady=10)

lbl_base_from = tk.Label(text="From Base")
lbl_base_from.grid(row=1, column=0, pady=(5,0))
ent_base_from = tk.Entry()
ent_base_from.grid(row=2, column=0, padx=10)

lbl_base_to = tk.Label(text="To Base")
lbl_base_to.grid(row=1, column=1, pady=(5, 0))
ent_base_to = tk.Entry()
ent_base_to.grid(row=2, column=1, padx=10)

lbl_val_from = tk.Label(text="From Value")
lbl_val_from.grid(row=3, column=0)
ent_val_from = tk.Entry()
ent_val_from.grid(row=4, column=0)

lbl_val_to = tk.Label(text="To Value")
lbl_val_to.grid(row=3, column=1)
lbl_val_to = tk.Label()
lbl_val_to.grid(row=4, column=1)


# Logic

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

def convert(event=None):
    """ Reads input and attempts to convert. Will do nothing on invalid input. """
    try:
        base_from = int(ent_base_from.get())
        base_to = int(ent_base_to.get())
        val_from = ent_val_from.get()
    except:
        return

    # convert letters to uppercase
    val_from = str(val_from).upper()

    # convert to base 10 numer (computer only recognizes base 10 math)
    num10 = 0
    for i in range(len(val_from)):
        num10 += tableFrom[val_from[i]] * (base_from ** ((len(val_from)-1) - i))

    converted = ""

    # find number of digits
    count = math.floor(math.log(num10, base_to) + 1)

    # for every digit
    for i in range(count - 1, -1, -1):
        # divide, take digit and leave remainder
        digit = str(tableTo[str(num10 // (base_to ** (i)))])
        converted += digit

        # get remainder and repeat
        num10 %= (base_to ** i)

    lbl_val_to["text"] = converted

def swap(event=None):
    """ Swaps conversion direction. """
    bf = ent_base_from.get()
    bt = ent_base_to.get()
    vf = ent_val_from.get()
    vt = lbl_val_to["text"]

    ent_base_from.delete(0, END)
    ent_base_from.insert(0, bt)
    ent_base_to.delete(0, END)
    ent_base_to.insert(0, bf)

    ent_val_from.delete(0, END)
    ent_val_from.insert(0, vt)
    lbl_val_to["text"] = vf

# Link logic to GUI

btn_convert = tk.Button(text="Convert", command=convert)
btn_convert.grid(row=5, columnspan=2, padx=5, pady=5)

btn_swap = tk.Button(text="Swap", command=swap)
btn_swap.grid(row=6, columnspan=2, padx=5, pady=5)

# Hit enter anywhere to convert
window.bind("<Return>", convert)

window.mainloop()