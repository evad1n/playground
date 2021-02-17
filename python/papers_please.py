# https://www.codewars.com/kata/59d582cafbdd0b7ef90000a0/train/python

from datetime import datetime


class Inspector:
    expiry_date = datetime.strptime('November 22, 1982', '%B %d, %Y')

    def __init__(self):
        self.allow = []
        self.deny = []
        self.wanted = []
        self.reqs = {}
    
    def receiveBulletin(self, bulletin):
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
                # Kind of worker
                kind = words[0]

                for w in words:
                    print(w)


    def inspect(self, entrant):
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