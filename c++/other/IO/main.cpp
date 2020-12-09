#include <iostream>
#include "functions.h"

using namespace std;

int main() {
    cout << "Hello! What is your name?";
    string name;
    cin >> name;
    cout << "Your name is " << name << endl;


    int n1 = get_number();
    int n2 = get_number();
    int p = n1 * n2;
    display_equation(n1, n2, p);


    return 0;
}