---
title: 鞅和停时定理
date: 2024-03-20 14:01:23
tags: ["概率论"]
---

## 鞅

鞅最开始用来研究赌博策略问题，后来引入到数学中。

先考虑这样一个公平赌博局面，每一轮，你都可以下注 $x$ 元，然后有 $\frac{1}{2}$ 的概率你可以获得 $2x$ 元，$\frac{1}{2}$ 的概率输光。

此时我们提出一个赌博策略，这个策略每次下注多少由前面的输赢情况进行决定。

我们设一组独立随机变量 $\{Y_1,Y_2,...\}$ 表示前面局面的输赢情况，$Y_i=1$ 表示第 $i$ 局赢，$Y_i=-1$ 表示第 $i$ 局输。

令第 $i$ 轮下注 $b_i$ 元，容易发现 $b_i$ 由 $Y_1,Y_2,...,Y_{n-1}$ 的取值决定。

令 $X_i$ 表示第 $i$ 轮结束后的的钱数，那么有：

$$
X_n=X_0+\sum_{i=1} b_iY_i
$$

此时我们考虑前 $n$ 轮已经结束，计算 $X_{n+1}$ ：

$$
E[X_{n+1}|\{Y_1,Y_2,...,Y_n\}]=E[X_n+b_{n+1}Y_{n+1}|\{Y_1,Y_2,...,Y_n\}]
$$

此时由于 $X_n$ 和 $b_i$ 显然已经为定值。

$$
=X_n+b_{n+1}E[Y_{n+1}|\{Y_1,Y_2,...,Y_n\}]=X_n
$$

因为 $Y_i$ 间独立。

此时说明了 $X_{n+1}=X_n$，通俗解释就是在公平赌博情况下，不存在一种策略使得自己获利。

此时，设 $\{Y_n\},\{X_n\}$ 为两个随机变量序列，且 $X_n$ 可以由 $Y_1,Y_2,...,Y_n$ 唯一确定，并且满足：

$$
E[X_{n+1}|\{Y_1,Y_2,...,Y_n\}]=X_n
$$

则称 $X$ 为 $Y$​ 的**鞅**。

<!-- more -->

## 停时

注意到，刚才的研究是一个无限轮的赌博问题，赌徒无法通过调整策略获益，那么考虑赌徒可以自己控制某一轮开始就不赌了呢？这样看上去貌似可以获利（比如获利了马上退出）。

此时引入一个**停时**，是一个随机变量 $T$，可以通过 $X_1,X_2,...,X_n$ 的取值来决定 $T$ 与 $n$ 的大小关系，换句话说就是可以通过前面的结果推出是继续还是停止。

那么此时令这个停时的收益是 $E[M_T]$，在公平赌博局面中，$M$ 是 $X$ 的鞅。

我们想知道是否有：

$$
E[M_T]=E[M_0]
$$

这若成立，说明赌徒无法通过调整自己的停止时间获得收益（也就是见好就收不会有收益）。

但是对于一般的情况，这不一定成立，但若满足以下三个条件之一，则必然成立：

$$
P\{ T < \infty \}=1\\
E[|M_T|]<\infty\\
\lim_{n\to \infty} E[|M_n|I_{\{T>n\}}|]=0
$$

这是**鞅停时定理**。

证明先咕着，事实上 OI 中绝大多数题目都满足第二条。

但是最上面提到的公平赌博中的策略**不一定满足**鞅停时定理。  

举个例子，一个经典的赌博策略是初始赌本为 $1$，赢了就跑，输了赌本翻倍，这样保证了跑的时候一定赢 $1$ 元，连输的概率也不大，被很多赌徒视为必胜法则。

但事实上很明显因为输完就没了，开始赌本 $X_0$ 必然有限，所以 $P\{T< \log X_0\}=1$，所以满足鞅停时定理，也就是这种策略无收益。

再来个例子，初始赌本 $1$， 赢了赌本减 $1$，输了赌本加 $1$，输光为止。

这个策略的高妙之处在于，输会让接下来赢的多，赢会让接下来输的少，换句话说就是一输一赢，一赢一输都可以赚 $1$ 元。

会发现这个策略上面三个条件都不满足。

是说明这个策略能赢吗，显然不是，只能说明鞅停时定理是充分条件而非必要条件。

> 一个赌徒，初始有若干元，每次赢一元与输一元的的概率都是 $1/2$，如果总共输 $\mathcal l_1$ 元或者赢 $\mathcal l_2$ 就结束，求赢 $\mathcal l_2$ 的概率。

如果让赢的概率为 $p$ 然后列方程可以得到更加通用的结果，但是这里只做一个小应用。

设 $Z_i$ 表示 $i$ 轮后的收益，由于 $Z_i$ 有界，所以满足鞅停时定理，设 $p$ 为赢 $\mathcal l_2$ 的概率。
$$
\mathbb E[Z_T]=\mathbb E[Z_0]\\
p\mathcal l_1+(1-p)\mathcal l_2=0\\
p=\frac{\mathcal l_1}{\mathcal l_2+\mathcal l_2	}
$$

## 求 $E[T]$

扯了这么多，来考虑一下和 OI 相关的内容。

OI 中的题一般是，给定一个结束条件，求期望步数。

套路是，对一个局面设一个势能函数 $\varphi(X)$，满足 $\varphi(X)=0$ 则 $X$ 是一个终止状态，并且满足 $X$ 后继状态势能会减一。

由于 $E[\varphi(X_n)]-E[\varphi(X_{n+1})]=1$，所以 $f(X_n)=\varphi(X_n)+n$ 是 $X$ 的一个鞅。

如果满足条件，那么去用一下停时定理。

$$
E[f(X_T)]=E[f(X_0)]\\
E[\varphi(X_T)]+E[T]=E[\varphi(X_0)]
$$

上面的要求保证了 $\varphi(X_T)$ 为定值，$\varphi(X_0)$ 也为定值，因此直接相减即可。

## 本质

注意到这类问题有一个暴力 dp 就是设一个状态到结束的期望步数，转移是后继状态加一。

所以构造这个构造函数的过程本质就是在猜测 dp 的答案。

这样看来这个好像挺没用的，相当于一个顺推一个逆推。

## 套路

这个东西主要还是解决有多个局面，彼此之间不独立的问题。

这样设出每个子局面的势能，求和就是总势能。

然后要去满足差为 $1$ 的条件，列出一次转移的变化值，然后一般可以把每个局面的东西独立开来，解出势能。

其实感觉这个东西和 SG 函数的套路比较类似，但是它是会互相影响的。

### [CF1025G](https://codeforces.com/problemset/problem/1025/G) *3200

注意到一个子局面只和其大小有关，并且最终状态唯一，直接设 $f(n)$ 表示有 $n$ 个 acquired 点的势能。

此时很多题解直接针对一组 $a,b$ 进行分析，实际上这步是不显然的，因为前面的条件只要求后继状态的和的差，这样分析是保证了一组 $a,b$ 的后继差都是 $1$，要求更严格，但是不一定解的出。

但事实上由于后面的推导中可以发现 $a,b$ 的势能函数是独立的，所以一般是可以解出的，不过直接枚举所有 $a,b$ 去列式肯定没问题。

$$
f(a)+f(b)-1=\frac{af(0)+bf(0)+f(a+1)+f(b+1)}{2}
$$

独立一下，把 $-1$ 拆开分配给 $a,b$。

$$
f(a)-\frac{1}{2}=\frac{af(0)+f(a+1)}{2}
$$

此时 $af(0)$ 很引荐，但是注意到这个势能函数是我们自己设的，与具体是啥局面没啥关系，解出来只要满足那个式子就行，所以 $f(0)$ 是啥不重要，直接给个 $f(0)=0$，然后解一下，得到：

$$
f(n)=1-2^n
$$

### [CF1479E](https://www.luogu.com.cn/problem/CF1479E) *3500

将整体考虑，直接列式，设 $S=\sum_{i=1}^m f(a_i)$：

$$
-1+\sum_{i=1}^m f(a_i)=\sum_{i=1}^m \frac{a_i}{n}\times \frac{(f(a_i-1)+f(1)+S-f(a_i))+\frac{a_iS}{n}+\sum_{j\ne i} \frac{a_j}{n} (f(a_i-1)+f(a_j+1)+S-f(a_i)-f(a_j))}{2}
$$

套路性的，把每个 $f(a_i)$ 相关的单独拿出来。

$$
-\frac{a_i}{n}+f(a_i)=\\
\frac{a_i}{n}\times \frac{f(a_i-1)+f(1)+\frac{a_if(a_i)}{n}+\frac{n-a_i}{n}f(a_i-1)}{2}+\sum_{j\ne i} \frac{a_j}{n}\times \frac{f(a_i)+\frac{a_j}{n}f(a_i)+\frac{a_i}{n}f(a_i+1)+\sum_{k\ne i\ne j} \frac{a_k}{n}f(a_i)}{2}\\
=\frac{a_i}{2n}(f(1)+\frac{a_i}{n}f(a_i)+\frac{2n-a_i}{n}f(a_i-1))+\frac{n-a_i}{2n}(\frac{2n-a_i}{n}f(a_i)+\frac{a_i}{n}f(a_i+1))\\
$$

把 $a_i$ 换成 $x$，然后移项得到：

$$
-\frac{x}{n}=\frac{x}{2n^2}(nf(1)+(2x-3n)f(x)+(2n-x)f(x-1)+(n-x)f(x+1))\\
-2n=nf(1)+(2x-3n)f(x)+(2n-x)f(x-1)+(n-x)f(x+1)
$$

此时递推式从前面两个递推，因此 $f(0),f(1)$ 可以随意设。

令 $f(0)=0,f(1)=-2$，这样得到：
$$
0=(2x-3n)f(x)+(2n-x)f(x-1)+(n-x)f(x+1)
$$

$n$ 很大，无法线性求逆元，因此递推的时候维护分子分母即可，直到要查询的值的时候再求出逆元，复杂度 $O(n+m\log n)$。

### [CF850F](https://www.luogu.com.cn/problem/CF850F) *2800

其实大概都是一个套路。

设一个颜色势能为 $f(a_i)$，总球数为 $s$，$S=\sum f(a_i)$。

$$
-1+S=\\
\frac{1}{s(s-1)}(\sum_{i\ne j} a_ia_j(f(a_i+1)+f(a_j-1)+S-f(a_i)-f(a_j))+\sum a_i(a_i-1) S)\\
-1=\frac{1}{s(s-1)}(\sum_{i\ne j} a_ia_j(f(a_i+1)+f(a_j-1)-f(a_i)-f(a_j)))\\
-\frac{a_i}{s}=\frac{1}{s(s-1)}(s-a_i)a_i(f(a_i+1)+f(a_i-1)-2f(a_i))\\
\frac{-s+1}{s-a_i}=f(a_i+1)+f(a_i-1)-2f(a_i)
$$

设 $g(x)=f(x+1)-f(x)$

$$
\frac{-s+1}{s-x}=g(x)-g(x-1)
$$

容易发现这个东西本质上就是对左边的东西做两次前缀和，因此 $f(a_i)$ 可以简单递推，但是注意到 $\sum a_i$ 很大，推一下式子。

令 $f_0=f_1=0$，$c_x=\frac{-s+1}{s-x}$ 。

$$
f_s=\sum_{j=1}^{s-1} c_j\binom{s-j}{1}=\sum_{j=1}^{s-1} -s+1=(s-1)(1-s)
$$