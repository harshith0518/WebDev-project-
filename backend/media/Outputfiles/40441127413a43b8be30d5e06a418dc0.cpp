#include<bits/stdc++.h>

using namespace std;


int main()
{
    string s;
    getline(cin,s);
    string num = "";
    for(char c:s) 
    {
        if(c == ' ') num = "";
        else num+=c;
    }
    cout<<"This is sample output for test case "<<num<<'\n';
}