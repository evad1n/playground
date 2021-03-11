# https://www.codewars.com/kata/59d582cafbdd0b7ef90000a0/train/python

from datetime import datetime
from collections import defaultdict


class Inspector:
    expiry_date = datetime.strptime('November 22, 1982', '%B %d, %Y')

    def __init__(self):
        self.allow = []
        self.deny = []
        self.wanted = []
        self.reqs = defaultdict(list)
        self.reqs["Citizens"] = defaultdict(list)
    
    def receiveBulletin(self, bulletin) -> None:
        lines = bulletin.splitlines()
        for line in lines:
            if "Allow" in line:
                countries = line[line.index('of') + 3:]
                countries = countries.split(',')
                for c in countries:
                    self.allow.append(c.strip())
            elif "Deny" in line:
                countries = line[line.index('of') + 3:]
                countries = countries.split(',')
                for c in countries:
                    self.deny.append(c.strip())
            elif "Wanted" in line:
                name = line[line.index(':') + 1:]
                self.wanted.append(name.strip())
            elif "require" in line.lower():
                words = line.split()
                # Type of entrant
                entrant_type = words[0]

                if words[1] == "require":
                    item = ' '.joinwords[2:]
                    self.reqs[entrant_type].append(item)
                elif words[1] == "of":
                    countries = []
                    i = 2
                    while ',' in words[i]:
                        countries.append(words[i][:-1])
                        i += 1
                    countries.append(words[i])
                    if words[i+1] == "require":
                        item = ' '.joinwords[i+2:]
                        for c in countries:
                            self.reqs[entrant_type][c].append(item)
                    elif words[i+1] == "no":
                        item = ' '.joinwords[i+3:]
                        for c in countries:
                            self.reqs[entrant_type][c].remove(item)
                elif words[1] == "no":
                    item = ' '.joinwords[4:]
                    self.reqs[entrant_type].remove(item)

                for w in words:
                    print(w)


    def inspect(self, entrant) -> str:
        for k,v in entrant.items():
            print(k, v)
            if k == "passport":
                pass
            elif k == "certificate_of_vaccination":
                pass
        # e = Entrant()
        # lines = entrant.splitlines()
        # for line in lines:
        #     if "NATION" in line:
        #         e.nation = "dog"
        return "Cause no trouble."

    def queryCountries(self):
        for c in self.allow:
            print("Allow", c)
        for c in self.deny:
            print("Deny", c)

class Entrant:
    def __init__(self):
        pass

i = Inspector()

bulletin = """Allow citizens of Obristan
Deny citizens of Kolechia, Republia
Foreigners require access permit
Citizens of Arstotzka require ID card
Wanted by the State: Hubert Popovic"""

i.receiveBulletin(bulletin)

i.queryCountries()

entrant1 = {
    "passport": """ID#: GC07D-FU8AR
    NATION: Arstotzka
    NAME: Guyovich, Russian
    DOB: 1933.11.28
    SEX: M
    ISS: East Grestin
    EXP: 1983.07.10"""
}

i.inspect(entrant1)