#include "person.h"

Person::Person()
    : mName("Jane Doe"), mAge(0)
{
}

Person::Person(const std::string &name)
    : mName(name), mAge(0)
{
}

// const after function to signify data should not change (just a getter)
const std::string &Person::getName() const
{
    return this->mName;
}