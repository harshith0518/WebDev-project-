// Write your knight path algorithm here...
#include<bits/stdc++.h>

using namespace std;

int main()
{
    string s;
    getline(cin,s);
    string t = "";
    int num;
    for(char c:s) 
    {
        if(c == ' ') cout<<t<<'/',t = "";
        else t+=c;
    }
    cout<<"This is sample output for test case "<<t<<'\n';

}