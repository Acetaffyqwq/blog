---
title: 赔率算法初探
date: 2024-03-20 14:59:57
tags: ["概率论"]
---

先由一个经典的问题引入

> 有 $n$ 个奖陆续出台，每一个奖可以选择选或者不选，每个奖只能在出台的时候选，并且只能选一个奖，每出台一个可以和前面的比较价值大小，问想得到价值最大的奖的最优策略。

这是经典的[秘书问题](https://en.wikipedia.org/wiki/Secretary_problem)。

<!-- more -->

### 赔率算法

将其抽象为个一个数学问题：

> 有 $n$ 个 0/1 **独立**随机变量 $a_1,a_2,...,a_n$，$E[a_i]=p_i$，可以从前向后观测每个 $a_i$ 的取值，并选择是否停止，求策略使得停止位置是最后一个 $1$ 的概率最大。

上面那个问题相当于是 $p_i=\dfrac{1}{i}$，表示第 $i$​ 个奖是前缀最大值。

由于变量独立，所以前面的结果不会影响后面的，也就是如果 $[1,i-1]$ 都没有停，那么 $i$ 开始的决策将与前面无关。

设 $f_i$ 表示从 $i$ 开始进行决策，能得到的最大概率。

可以得到：
$$
f_i=(1-p_i)f_{i+1}+p_i\max(f_{i+1},\prod_{j=i+1}^n (1-p_j))\\
= \max(f_{i+1},(1-p_i)f_{i+1}+p_i\prod_{j=i+1}^n (1-p_j))
$$
左边转移表示不停，右边表示能停就停，答案就是 $f_1$。

从左边部分可以发现 $f_i$ 一定单调不增，而如果从右边转移说明 $\prod\limits_{j=i+1}^n (1-p_j)>f_i$，而 $\prod\limits_{j=i+1}^n (1-p_j)$ 显然单调增，所以说肯定可以找到一个断点 $T$，满足 $\ge T$ 的都从右边转移，然后 $f_1=f_T$。

那么直接全部由右边转移，然后找到最后一个 $f_i<f_{i+1}$ 的位置即可。
$$
f_i=(1-p_i)f_{i+1}+p_i\prod_{j=i+1}^n (1-p_j)
$$
暴力展开，得到：
$$
f_i=\sum_{j=i}^{n}p_j\prod_{k=i}^n [j\ne k](1-p_k)
$$
在前面加入一项得到 $f_{i-1}$，令 $p_{i-1}=p'$
$$
f_{i-1}=(1-p')f_{i}+p'\prod_{j=i}^n (1-p_j)\\
f_i-f_{i-1}=p'f_i-p'\prod_{j=i}^n (1-p_j)\\
=p'\sum_{j=i}^{n}p_j\prod_{k=i}^n [j\ne k](1-p_k)-p'\prod_{j=i}^n (1-p_j)\\
=p'\prod_{j=i}^n (1-p_j)\sum_{k=i}^n\frac{p_k}{1-p_k}-p'\prod_{j=i}^n (1-p_j)
$$
因此 $T$ 是满足 $\sum_{i=T}^n \frac{p_i}{1-p_i}\ge 1$ 的最大的 $T$。

由于后面的转移全部都是选右边的转移，所以用语言可以表示为前面 $T$ 个全部放弃，后面遇到一个 $1$​ 就直接选，

该算法称为**赔率算法**（**odds algorithm**）。

回到最开始的问题，我们现在解决它。

设 $r_i=\frac{p_i}{1-p_i}=\frac{1}{i-1}$ 。

我们求解 $\lim_{n\to \infty}$ 的策略。
$$
\sum_{i=T}^n \frac{1}{i}\ge \int_{T}^n \frac{1}{x}dx\\
\int_{T}^n \frac{1}{x}dx=\ln n-\ln T= 1
$$
轻松解得 $T=n/e$，这就是最优策略。

算一下得到最大值的概率，由于 $\sum_{i=T}^n \frac{p_i}{1-p_i}=1$。

所以
$$
f_T=\prod_{i=T}^n \frac{i-1}{i}=\frac{T-1}{n}=\frac{1}{e}
$$

### 其他问题

未完待续。