#include<bits/stdc++.h>
using namespace std;


int main() {

    int n;
    cin>>n;

    vecotr<int> v(n);
    for(int i=0;i<n;i++) cin>>v[i];
    cout<<accumulate(v.begin(),v.end(),0)<<'\n';


}