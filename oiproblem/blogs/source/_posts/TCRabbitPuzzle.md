---
title: TCRabbitPuzzle
date: 2024-04-22 18:08:31
tags: ["计数"]
---

> 数轴上有三个相同的点 $A,B,C$，你需要通过恰好 $K$ 次操作把点移动到 $D,E,F$，求方案数。
>
> 每次操作，选择两个点，将一个点移动到另一个点轴对称的位置，但是只能越过一个点，并且不能出现两个点位置相同。
>
> $A,B,C,D,E,F\le 10^{18},K\le 10^6$ 。

<!-- more -->

分析一下这个操作的性质。

如果是两边的点对称到中间，那么只有一种对称方式，如果是中间的对称到两边，那么有两种，并且每个操作都有一个对应的逆操作，那么可以把原问题变成一个图上行走问题。

画出来是一棵二叉树，并且由于每个点的父亲唯一而且互不相同，也就是每种状态不可能在树上出现多次。

问题转化为给出二叉树上的两个点，求一个游走到另一个的方案。

跑出 LCA，那么有效的信息只有两个点到 LCA 的距离以及 LCA 到根的距离。

我开始的想法是，注意到每次行走，都有一种方案向终点走一步，两种方案远离，所以组合数简单算一下，容斥掉跳到根上面的方案即可。

但是这样是寄的，因为如果已经到达了答案，那么三种走法都是远离，贡献难以计算了。

由于要限制不能到根上面，因此枚举一下走到深度最浅的点 $p$。

路径总体可以看成是 $st\to p\to en$，只不过在这条路径的中间，可以在一个点原地游走一下然后再去下一个点。

例如对于 $st\to p$ 这一段，考虑 $x$ 到其父亲前面的一段，那么就是向下走两种方案，向上一种，然后需要满足一个卡特兰数的限制。

后半段也是同理的，会发现走 $2$ 的次数是确定的，行走的方案数就是 $st\to p\to en$ 这条路径长度个卡特兰数卷起来，这个之前出现过了，可以看成是加了 $k$ 个右括号将他们分隔开来，然后左边放 $k$ 个左括号。

总复杂度 $O(k)$。

```cpp
int main() {
  ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);

  ll _, A1, B1, C1, A2, B2, C2, K;
  cin >> _ >> A1 >> B1 >> C1;
  cin >> _ >> A2 >> B2 >> C2;
  cin >> K;

  map<tuple<ll, ll, ll>, int> mp;
  int d1 = 0, d2 = 0;
  For(i, 0, K + 5) {
    mp[{A1, B1, C1}] = d1++;
    ll L = B1 - A1, R = C1 - B1;
    if (L == R) break;
    L < R ? (A1 += 2 * L, swap(A1, B1)) : (C1 -= 2 * R, swap(C1, B1));
  }

  int ff = 0;
  For(i, 0, K + 5) {
    if (mp.count({A2, B2, C2})) {
      ff = 1;
      break;
    }
    ll L = B2 - A2, R = C2 - B2;
    if (L == R) break;
    d2++;
    L < R ? (A2 += 2 * L, swap(A2, B2)) : (C2 -= 2 * R, swap(C2, B2));
  }

  if (!ff) return cout << "0\n", 0;

  V<mint> jie(K + 5, 1), ni(K + 5);
  For(i, 1, K) jie[i] = jie[i - 1] * i;
  ni[K] = jie[K].inv();
  Rep(i, K, 1) ni[i - 1] = ni[i] * i;

  auto C = [&](int x, int y) {
    if (x < 0 || x < y) return 0_m;
    return jie[x] * ni[y] * ni[x - y];
  };

  auto calc = [&](int m, int p) {
    return (2_m).pow(p) * (C(K, (K + m) / 2) - C(K, (K + m) / 2 + 1));
  };

  int L = mp[{A2, B2, C2}], R = d2, U = d1 - 1 - L;
  if ((K & 1) != ((L + R) & 1)) return cout << "0\n", 0;
  mint ans = 0;
  For(i, 0, U) if (L + R + 2 * i <= K) {
    ans += calc(L + R + 2 * i, (K - L - R - 2 * i) / 2);
  }
  cout << ans << '\n';
}
```