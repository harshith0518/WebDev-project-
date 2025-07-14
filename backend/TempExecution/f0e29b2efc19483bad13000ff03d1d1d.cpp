#include <bits/stdc++.h>
using namespace std;
#define ll long long
#define ld long double
#define mod 1000000007
#define bb begin()
#define ee end()
#define rb rbegin()
#define re rend()
#define ff first
#define ss second
#define yes cout << "Yes\n"
#define no cout << "No\n"
#define nodeptr node *
#define line cout << '\n'

void solve()
{
    int x, y;
    int a, b;
    cin >> a >> b >> x >> y;
    if(a == b) {cout<<"0\n";return;}
    int score = 0;
    if(a<b)
    {
        if(x>y)
        {
            if(a%2 == 1) a++,score+=x;
            while(a!=b)
            {
                score+=(x+y);a+=2;
                if(a>b) score-=x,a--;
            }
            cout<<score<<'\n';return;
        }
        cout<<x*(b-a)<<'\n';
        return;
    }
    else 
    {
        if(a-1!=b || a%2==0) {cout<<"-1\n";return;}
        else cout<<y<<'\n';
    }
    cout<<"hello nigger\n";
}

signed main()
{
    ios::sync_with_stdio(false);
    cin.tie(0);
    cout.tie(0);

    ll t;
    cin >> t;
    // t = 1;
    while (t--)
        solve();

    return 0;
}
