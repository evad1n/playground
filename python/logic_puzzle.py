#!/usr/bin/env python3

def gen_physics(groups, members):
    rules = ""
    for i in range(len(groups)):
        j = (i + 1) % len(groups)
        g1 = groups[i]
        g2 = groups[j]
        for m1 in members:
            for m2 in members:
                rule = f"{g1}{m1}{g2}{m2} <=>"
                for m3 in members:
                    if m2 != m3:
                        rule += f" !({g1}{m1}{g2}{m3}) &"
                rules += f"{rule[:-2]}\n"

    return rules

groups = ["A", "B", "C"]
members = ["1", "2", "3", "4"]

print(gen_physics(groups, members))