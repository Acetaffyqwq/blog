---
title: 「典」一种简单限制树上背包的优化
date: 2024-04-22 19:04:54
tags:
---

> 给定一棵 $n$ 个点的树，第 $i$ 个点上有一个体积为 $a_i$，价值 $b_i$ 的物品，每个点为黑色或者白色。
>
> 在树上选择若干个点，要求每个被选的点的最近的被选的祖先要和他异色，并且体积和 $\le W$，求最大价值和。
>
> 需要对原树的每棵子树求出答案。
>
> $n\le 200,W\le 5\times 10^4$ 。

<!--more-->

不同于最简单的树上背包，这个每个点的体积是给出的，因此暴力复杂度为 $\mathcal O(nm^2)$ 的。

一个小优化：只把有效点值存下来然后暴力转移，复杂度分析一下可以得到 $\mathcal O(\frac{nm^2}{\log m})$，还是有点用的。

直接放弃掉树上背包。

然后想到了约束背包[经典题目](https://www.luogu.com.cn/problem/P6326)，古典做法就是把 dfs 序跑出来，然后在 dfs 序上 dp，一个点如果不选了那么它的子树就都不会选了，直接跳到下一个地方，否则就向子树跳一个，这样的话只需要支持背包加入一个物品，那么复杂度就是 $O(nm)$。

如果跑出任意一个连通块，需要加一个点分治，但是子树内答案就很难做（好像不可做）。

然后有了一个最新科技，感觉完全吊打 dfs 序上 dp。

dfs 序上 dp 的本质是，类似建一个自动机，每个点连向第一个儿子或者子树外的第一个点，然后自动机上的一条路径就代表了一个树上包含根的连通块，然后在这个上面 dp。

但是这个东西和子树内信息非常割裂，而且只能维护树上连通块，遇到树上非联通块的约束条件就萎了，就是 dp 到一个点，父亲的信息是未知的。

此时一个很牛的考虑是，把 dfs 到 $i$ 的背包信息传到儿子里面去 dp，然后再传出来。

```cpp
function dfs(c, dp)//贺的
  Dp[0] <- dp
  Dp[1] <- dp
  for d in {children of c} do
    Dp[0] <- dfs(d, Dp[0])[0]
    Dp[1] <- dfs(d, Dp[1])[1]
  end for
  for i = 0 to X - W[c] do
    chmax(Dp[C[c]][i + W[c]], Dp[C[c] ^ 1][i] + B[c])
  end for
  return Dp
```

由于外部点怎么选对我其实是没有影响的，只需要把外面的 dp 数组搬过来直接做，约束条件可以在传回父亲的时候进行限制即可。

然后每次传回父亲的时候再将这个点加入。

注意到这个 dp 复杂度是 $O(m2^n)$，很不牛。

注意到复杂度劣主要是因为每个子树都分成 0/1 两种情况分别 dp，注意到如果只有一个儿子，那么可以把儿子的 dp 状态值直接继承上来，因为没有其他儿子的约束。

首此启发，考虑一个类似 dsu on tree 的东西，先递归重儿子，把信息直接继承。

```cpp
function dfs(c, dp)
  if c is not leaf then
    h = (heavy child of c)
    Dp <- dfs(h, dp)
    for d in {children of c} / {h} do
      Dp[0] <- dfs(d, Dp[0])[0]
      Dp[1] <- dfs(d, Dp[1])[1]
    end for
  else 
    Dp[0] <- dp
    Dp[1] <- dp
  end if
  for i = 0 to X - W[c] do
    chmax(Dp[C[c]][i + W[c]], Dp[C[c] ^ 1][i] + B[c])
  end for
  return Dp
```

分析一下复杂度。

$$
f(n)=\sum_{\sum a_i=n-1} f(a_1)+2\sum_{j=2} f_{a_j}+O(m)\\
a_1=\max a_i
$$

如果儿子有 $k$ 个，那么最大值一定是 $a_1=a_2=...=a_k$。

$$
f(n)=f(n/k)(2k-1)+O(m)\\
=n^{\log_k 2k-1}m
$$

显然 $k=2$ 最优，复杂度为 $O(n^{\log_2 3}m)=O(n^{1.59}m)$。

但是注意到现在得到的这个 dp 还是只能求出整棵树的答案，不能求出每个子树的答案，因为每次递归都是把外面的信息传进去。

求一个点的信息，只要传一个空的状态进去就行了，但是复杂度乘个 $n$。

这个也可以 dsu，把空信息传到重子树里面，然后整个传回来，然后扔到轻子树里面去 dp。

复杂度类似的分析一下，发现和求单次是一样的。

> 和上面一题相同，但是要求改成选出的点集是独立集。

nfls 讲课的题，标算是一个引荐东西，注意到两个点有边，那么在点分树上一定是祖先关系，而点分树的树高有保证，所以状压记录祖先的选择情况，复杂度是 $\mathcal O(n^2m)$ 的，不牛。

fxt 讲了一下 $\mathcal O(\frac{nm^2}{\log m})$ 的做法，不牛。

直接套用上面的做法就可以了，贴一个代码：

```cpp
#include <bits/stdc++.h>
#define V vector
#define Vi vector<int>
#define sz(a) ((int)a.size())
#define fi first
#define se second
#define Int pair<int, int>
#define Inf ((int)1e9)
#define pb push_back
#define ins insert
#define For(i, x, y) for (int i = (x); i <= (y); i++)
#define Rep(i, x, y) for (int i = (x); i >= (y); i--)
#define seg int p, int l, int r
#define lid p << 1, l, mid
#define all(a) a.begin(), a.end()
#define rid p << 1 | 1, mid + 1, r
#define mid ((l + r) / 2)
#define Ceil(x, y) (((x) + (y)-1) / (y))
#define cmax(a, b) a = max(a, b)
#define cmin(a, b) a = min(a, b)
#define IO(x) freopen(#x ".in", "r", stdin), freopen(#x ".out", "w", stdout);
using namespace std;
#define A array

struct hzy {
  int x, z;
};
const int P = 1e9 + 7;
hzy operator+(hzy x, hzy y) {
  int r = max(x.x, y.x);
  return {r, ((r == x.x ? x.z : 0) + (r == y.x ? y.z : 0)) % P};
}
hzy operator+(hzy x, int b) { return {x.x + (x.x < 0 ? 0 : b), x.z}; }

int main() {
  IO(air);
  ios::sync_with_stdio(0), cin.tie(0), cout.tie(0);

  int n, m;
  cin >> n >> m;
  Vi a(n + 5), b(n + 5);
  For(i, 1, n) cin >> b[i] >> a[i];
  V<Vi> e(n + 5);
  for (int i = 1, x, y; i < n; i++) cin >> x >> y, e[x].pb(y), e[y].pb(x);

  Vi siz(n + 5);
  auto pre = [&](auto lf, int x, int fa) -> void {
    siz[x] = 1;
    For(i, 0, sz(e[x]) - 1) if (e[x][i] == fa) {
      e[x].erase(e[x].begin() + i);
      break;
    }
    for (int y : e[x]) lf(lf, y, x), siz[x] += siz[y];
    sort(all(e[x]), [&](int u, int v) { return siz[u] > siz[v]; });
  };
  pre(pre, 1, 0);

  auto dfs = [&](auto lf, int x, V<hzy> &F) -> A<V<hzy>, 2> {
    A<V<hzy>, 2> g;
    if (!sz(e[x])) {
      g[0] = g[1] = F;
    } else {
      g = lf(lf, e[x][0], F);
      for (int y : e[x])
        if (y ^ e[x][0]) {
          g[0] = lf(lf, y, g[0])[0];
          g[1] = lf(lf, y, g[1])[1];
        }
    }
    V<hzy> tmp(m + 5, {-1, 0});
    For(i, 0, m) tmp[i] = g[1][i];
    For(i, 0, m - b[x]) g[1][i + b[x]] = g[1][i + b[x]] + (g[0][i] + a[x]);
    g[0] = tmp;
    return g;
  };

  V<hzy> f(m + 5, {-1, 0});
  f[0] = {0, 1};
  auto res = dfs(dfs, 1, f);
  For(i, 1, m) cout << res[1][i].x << ' ' << res[1][i].z << '\n';
}
```