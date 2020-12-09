#include <iostream>
#include "functions.h" // for error checking


using namespace std;

int get_number() {
    cout << "Gimme number: ";
    int num;
    cin >> num;
    return num;
}