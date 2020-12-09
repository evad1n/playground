#include <iostream>
#include <string>
#include "image_menu.h"

std::string getString( std::istream& is, std::ostream& os, const std::string& prompt ) {
    os << prompt;
    std::string color;
    is >> color;
    return color;
}

int getInteger( std::istream& is, std::ostream& os, const std::string& prompt ){
    os << prompt;
    int num;
    is >> num;
    return num;
}

double getDouble( std::istream& is, std::ostream& os, const std::string& prompt ) {
    os << prompt;
    double num;
    is >> num;
    return num;
}

int assignment1( std::istream& is, std::ostream& os ) {
    std::string color = getString(is, os, "What's your favorite color? ");
    int integer = getInteger(is, os, "What's your favorite integer? ");
    double num = getDouble(is, os, "What's your favorite floating point number? ");

    for (int i = 0; i < integer; i++)
    {
        os << i+1 << " " << color << " " << num << std::endl;
    }
    
    return integer;
}