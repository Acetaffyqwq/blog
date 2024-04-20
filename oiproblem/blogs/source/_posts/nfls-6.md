---
title: nfls 训练赛#6
date: 2024-03-20 10:09:13
tags: ["模拟赛"]
---

赛时过了 $4$​ 题，C 题来不及写。

<!-- more -->

### A

> 已知一个长度为 $n$ 的序列 $a$，每次操作可以选择两个数 $a_i,a_j$，令 $a_i=a_i\oplus a_j$。
>
> 操作任意次，求 $\sum a_i$ 的最大值。
>
> $n\le 50,a_i\le 10^{15}$

感觉这个题还是很有难度的。

先吧所有数放到线性基里，那么无法放入的数最后肯定是线性基里异或出的最大值。

然后考虑选线性基里一些数异或的方案，怎么比较大小。

此时一个套路是把线性基完全消元，也就是主元列上只有一个 $1$ 。

那么此时两种方案异或出的值的大小只要比选出的数的方案对应的二进制数即可。

比如线性基里有 $\{5,3\}$，方案 $\{00,01,10,11\}$ 就对应 $\{0,3,5,6\}$ 。

也就是题目转化为 $a_i=2^i$ 求答案。

那么最后的 $a_i$ 肯定操作为 $2^{n-1}-1-a_i[i< n]$ 最优。

### C

> 给定一个字符串，然后给定一个目标串，每一次可以讲所有的相同字符 +1 或者 -1 ，其中 z 的后继为 a，给定 +1 的代价和 -1 的代价，然后你要计算出最小的代价。
>
> $|\sum|\le 26$ 。

代码艺术题。

显然可以变成一个环上，一个区间要移到一个点上。

这题主要难写在环上走，直接写非常困难。

考虑把所有点放在一条长度无限的数轴上，这样如果每个点终点确定，那么答案就很好计算。

终点的相对顺序与起点相同，但是由于是环，终点可以加减 $|\sum|$。

由于转多圈肯定不优，枚举转常数圈，也就是终点集体加减，然后计算答案即可，这样代码就很好写。

找区间和终点可以用哈希，对一个区间的和去找一个相同的点。

场上还是有不少人写出 10k+ 代码的，非常恐怖。

```cpp
mt19937 rnd(random_device{}());

struct hzy {
    int l, r, z;
};

int main() {
    ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);

    int A, B, n = 26;
    cin >> A >> B;
    string S, T;
    cin >> S >> T;
    if (S == T)
        return cout << 0 << '\n', 0;

    Vi a(2 * n + 5), b(2 * n + 5);
    For(i, 0, sz(S) - 1) {
        int t = rnd() % 100000;
        a[S[i] - 'a'] += t, b[T[i] - 'a'] += t;
    }
    For(i, 0, n - 1) a[i + n] = a[i];
    int ff = 1;
    For(i, 0, n - 1) if (!b[i]) ff = 0;
    if (ff)
        return cout << "-1\n", 0;

    auto fd = [&](int z) {
        For(i, 0, n - 1) if (b[i] == z) return i;
        return -1;
    };

    auto solve = [&](auto r, int k) {
        V<hzy> vec;
        For(i, 0, n - 1) if (r[i]) {
            int s = 0, j = i, g = 0;
            for (; j < n; j++) {
                s += r[j];
                if ((g = fd(s)) != -1)
                    break;
            }
            if (j == n)
                return Inf;
            vec.pb({ i, j, g - k }), i = j;
        }
        For(i, 1, sz(vec) - 1) while (vec[i].z < vec[i - 1].z) vec[i].z += 26;
        if (sz(vec) > 1 && vec.back().z > vec[0].z + 26)
            return Inf;
        int ans = Inf;
        For(_, -4, 4) {
            int sum = 0;
            for (auto x : vec) {
                int w = x.z + _ * 26;
                if (w < x.l)
                    sum += (x.r - w) * B;
                else if (w > x.r)
                    sum += (w - x.l) * A;
                else
                    sum += (w - x.l) * A + (x.r - w) * B;
            }
            ans = min(ans, sum);
        }
        return ans;
    };

    int ans = Inf;
    For(i, 0, n - 1) ans = min(ans, solve(a.begin() + i, i));
    cout << (ans == Inf ? -1 : ans) << '\n';
}
```

### D

> 给定一个正 $n$ 边形，要用 $n-3$ 条弦把它划分为 $n-2$ 个三角形，求有一个面积严格大于其他三角形的三角形的方案数。
>
> $n\le 444$ 。 

笑点解析：$O(n^4)$ 。

三角形大小没什么结论，直接暴力跑出所有三角形的面积，离散化一下。

枚举最大三角形的大小，然后相当于分割成了三个部分，每个部分是经典 dp，设 $f_i$ 表示还有 $i$ 个点的方案，然后去枚举中间选哪个点组成三角形，然后划分成两个子问题，转移就是一个卷积。

暴力做就是 $O(n^4)$，然后加亿点卡常就可以通过。

急宝没过，急死了 /cf。

### E

> 有 $2n$ 个点，第 $i$ 个点坐标为 $(i,0)$，你要进行一个匹配，匹配上的点用边连上，要求连边不交。
>
> 已经匹配了若干个点，求剩下的点匹配是否有解。
>
> $n\le 25$ 。

正解是指数级，分讨已经匹配点数量的大小。

把一条边看成一个区间，区间相交不包含就连边，那么出现三元环就寄。

先判断已经匹配的是否存在三元环，然后猜了个结论，对于我自己选的区间，有连边的方案可以调整为无连边。

也就是三元环一定是两个原来相交的区间加上一个我选的区间。

那么就可以 check 每个区间是否能选，然后就是一个一般图最大匹配判断是否有方案即可。

这题不用构造方案，数据感觉不强，直接过了，虽然上面那个结论不会证，反正复杂度 $O(n^4)$ 。

还有一个高妙做法，设 $a_i$ 表示 $(i,0)$ 的连边是向上还是向下。

那么条件是每个已选的区间中间与这个区间同向的点的数量要求是偶数，这个是可以调整法证明的。

设 $S$ 表示已有区间的集合，那么直接考虑 $a_i$ 应该满足的条件：

- $\bigoplus_{i=1}^{2n} a_i=0$
- $\forall [l,r]\in S,a_l\oplus a_r=0$ 。
- 对于两个相交不包含的区间 $[l,r],[l',r']$，$a_l\oplus a_{l'}=1$。
- $\forall [l,r]\in S,\bigoplus_{i=l}^{r} a_i\oplus a_l\oplus 1$ 。

判断方程是否有解即可，注意到条件有 $O(n^2)$ 个，暴力做 $O(n^4)$ 。

但是上面说过如果相交不包含区间形成环直接无解，无环就只有 $O(n)$ 个条件了，再压个位，复杂度就是 $O(\frac{n^3}{\omega})$。