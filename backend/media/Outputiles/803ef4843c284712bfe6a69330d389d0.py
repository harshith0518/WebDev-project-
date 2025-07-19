
n = int(input())

arr = list(map(int, input().split()))
print(arr)   # Output: [10, 20, 30]

sum = 0
for i in range(arr): sum+=i

print(sum)