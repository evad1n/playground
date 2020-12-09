#include <iostream>
#include <string>
#include <vector>
#include <cmath>
#include <algorithm>
#include <vector>

#include "timing.h"

using namespace std;

int clamp(const int &val, const int &low, const int &high)
{
    return (val < low) ? low : (val > high) ? high : val;
}

/* local variable is same as a member's name */
class Test
{
private:
    int x;
    int mX;

public:
    void setX(int x)
    {
        // The 'this' pointer is used to retrieve the object's x
        // hidden by the local variable 'x'
        this->x = x;
        // If there is no duplicate variable name, then I don't need 'this'
        mX = x;
    }
    void print()
    {
        cout << "x = " << x << endl;
        cout << "mX = " << mX << endl;
    }
};

int main()
{
    // int x;
    // cout << "Enter an integer: ";
    // cin >> x;

    // // string rel = x < 5 ? "lower" : "higher";
    // // cout << rel << endl;

    // x = clamp(x, 0, 10);
    // cout << x << endl;

    // vector<int> y(10);

    // for (size_t i = 0; i < y.size(); i++)
    // {
    //     cout << y[i] << endl;
    // }

    // string bob = "hey";

    // cout << bob << endl;

    // Test obj;
    // int x = 20;
    // obj.setX(x);
    // obj.print();

    // enum Color
    // {
    //     red,
    //     green,
    //     blue
    // };

    // for (size_t i = red; i <= blue; i++)
    // {
    //     cout << i << endl;
    // }

    time_diffs();

    return 0;
}
