#ifndef _PERSON_H_
#define _PERSON_H_
#include <string>

class Person {
public:
    Person();
    Person(const std::string& name);

    const std::string& getName() const;

private:
    std::string mName;
    int mAge;
};

#endif