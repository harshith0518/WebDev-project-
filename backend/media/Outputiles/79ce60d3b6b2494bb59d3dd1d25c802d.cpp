// Write your knight path algorithm here...

#include<btis/stdc++.h>

using namespace std;

int main() {
    int n;
    cin>>n;
    int p,val = 0;
    while(n--) cin>>p,val+=p;
    cout<<val<<'\n';
}

