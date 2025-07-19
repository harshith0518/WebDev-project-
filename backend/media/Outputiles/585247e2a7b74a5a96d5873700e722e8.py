// Write your knight path algorithm here...

n = int(input())

arr = map(int,input().split())

sum = 0
for i in range(arr): sum+=i

print(sum)