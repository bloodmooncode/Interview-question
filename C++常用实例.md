# C++常用实例

[TOC]



## **int**

### __gcd()最大公约数

algorithm库中的函数

```c++
cout << __gcd(-2,4) << endl; // -2
```

### lcm最小公倍数(c++17有库函数)

```c++
int lcm(int a,int b){
	return a * b / __gcd(a,b);// 
}
lcm(12,16); // 48
```

### 将整数转化为二进制数

```c++
void func()
{
	vector<long long>A;
	long long n = 0, i = 0;
	cin >> n;
	while (n)
	{
		A.push_back(n % 2);
		n /= 2;
		cout << A[i];
		i++;
	}
}
```

### 将整数转化为16进制数

```c++
string toHex(int num) {
	if (num == 0) {
		return "0";
  }
  string sb;
  for (int i = 7; i >= 0; i --) {
		int val = (num >> (4 * i)) & 0xf;
		if (sb.length() > 0 || val > 0) {
			char digit = val < 10 ? (char) ('0' + val) : (char) ('a' + val - 10);
      sb.push_back(digit);
    }
	}
  return sb;
}
```



## **char**

### 一、isdigit/isalpha

```c++
/* 判断一个字符是不是数字 */
#include <ctype.h> 
char c='0'; 
isdigit(c); 
//来判断是否为数字，如果是数字那么会返回非0 
isalpha(c); 
//来判断是否为字母，如果是字母那么返回非0
```





## **string**

### 获取字符串长度

```c++
string s = "asdfghjkl";
int Slength = s.length();
```

### 删除字符串中特定位置的元素

```c++
/* 使用迭代器删除 */
string s = "asdfghjkl";
string::iterator its = s.begin() + i;
s.erase(its);
```

```c++
/* 使用下标删除 */
string s = "asdfghjkl";
s.erase(6,4); // 从位置pos=6处开始，删除4个字符
```

### 删除字符串中指定的所有字符

```c++
/* 删除s中所有e */
string s = "qwertyuio";
s.erase(std::remove(s.begin(), s.end(), 'e'), s.end());
```

### 字符串查找字符或字符串判断

```c++
/* index == -1 */
str1 = "...";
str2 = "...";
int index = str1.find(str2);
if (index == -1) {
    cout << "failed" << endl;
}
/* string::npos */
if ((n1 = str1.find(str2)) != string::npos)
{
	cout << str1 << "successful" << str2 << endl;
}
```

### 判断两个字符串的公共部分

```c++
/* 可以比较所有ASCII字符，返回所有相同的字符 */
vector<char> judgeSameChar(string s1, string s2)
{
	vector<int> a(128), b(128); //两个数组，分别存两个字符串中的字符，下标就对应字符的ASCII码
	for (auto i : s1)
		a[i]++;
	for (auto j : s2)
		b[j]++;
	vector<char> res;
	for (int k = 0; k < 128; k++)
	{
        //如果对应下标的a、b数组中的value值都不为零说明该字符在s1和s2中都存在
		if(a[k] != 0 && b[k] != 0)
			res.push_back(k);
	}
	return res;
}
```

### 字符串排序

```c++
string s;
sort(s.begin(),s.end()); 
```

### stringstream的用法

```c++
/* 可以用于分割被空格、制表符等符号分割的字符串 */
#include<bits/stdc++.h>
using namespace std;  

int main(){  
    string str="i am a boy";  
    istringstream is(str);  
    string s;  
    while(is>>s)  {  
        cout<<s<<endl;  
    }  
} 
```

### getline + stringstream

```c++
#include <iostream>
#include <sstream>
#include <vector>
#include<algorithm>
using namespace std;

int main() {
    string s;
    vector<string> arrs;
    while (getline(cin, s)) {
        arrs.clear();
        istringstream ss(s);
        while (ss >> s) {
            arrs.push_back(s);
        }
        sort(arrs.begin(), arrs.end());
        for (const string& arr : arrs) {
            cout << arr << ' ';
        }
        cout << endl;
    }
    return 0;
}
```

### 去除空格

```c++
/*去除字符串左侧的空格*/
void trimLeftTrailingSpaces(string &input) {
    input.erase(input.begin(), find_if(input.begin(), input.end(), [](int ch) {
        return !isspace(ch);
    }));
}
```

```c++
/*去除字符串右侧的空格*/
void trimRightTrailingSpaces(string &input) {
    input.erase(find_if(input.rbegin(), input.rend(), [](int ch) {
        return !isspace(ch);
    }).base(), input.end());
}
```

### 提取子字符串substr()

```c++
string str = "We think in generalities, but we live in details.";
string str2 = str.substr (3,5); // "think"
auto pos = str.find("live"); // position of "live" in str
string str3 = str.substr (pos); // get from "live" to the end
cout << str2 << ' ' << str3 << endl;
/* think live in details. */
```



## **pair**

### 按照first或second排序

```c++
bool cmp (pair<int, int> a, pair<int, int> b)
{
	return a.first < b.first;//根据fisrt的值升序排序
	//return a.second<b.second; //根据second的值升序排序
}
```



## **vector**

### 动态数组初始化

（1）不带参数的构造函数初始化

```c++
// 初始化一个size为0的vector
vector<int> abc;
```

（2）带参数的构造函数初始化

```c++
// 初始化size,但每个元素值为默认值
vector<int> abc(10);    // 初始化了10个默认值为0的元素
// 初始化size,并且设置初始值
vector<int> cde(10，1);    // 初始化了10个值为1的元素
```

（3）通过数组地址初始化

```c++
int a[5] = {1,2,3,4,5};
// 通过数组a的地址初始化，注意地址是从0到5（左闭右开区间）
vector<int> b(a, a+5);
```

（4）通过同类型的vector初始化

```c++
vector<int> a(5,1);
// 通过a初始化
vector<int> b(a);
```

（5）通过copy函数赋值

```c++
vector<int> a(5,1);
int a1[5] = {2,2,2,2,2};
vector<int> b(10);

/* 将a中元素全部拷贝到b开始的位置中,注意拷贝的区间为a.begin() ~ a.end()的左闭右开的区间 */
copy(a.begin(), a.end(), b.begin()); // 此时b: 1 1 1 1 1 0 0 0 0 0

/* 拷贝区间也可以是数组地址构成的区间 */
copy(a1, a1+5, b.begin() + 5);	// 此时b: 1 1 1 1 1 2 2 2 2 2
```



### 动态数组初始化&赋值

一维数组赋值

### Sort排序

```c++
vector<int> arrs {2,4,1,23,5,76,0,43,24,65};
sort(arrs.begin(), arrs.end(), less<int>()); // 升序排列
sort(arrs.begin(), arrs.end(), greater<int>()); // 降序排列
```

### reverse逆序

```c++
string str="hello world , hi";
reverse(str.begin(),str.end());//str结果为 ih , dlrow olleh
vector<int> v = {5,4,3,2,1};
reverse(v.begin(),v.end());//容器v的值变为1,2,3,4,5
```

### unique去重

unique去除的是相邻的重复元素，所以在进行数组排序之前一般用都会要排一下序

```c++
vector<int> v { 1, 2, 0, 3, 3, 0, 7, 7, 7, 0, 8 };
vector<int>::iterator it = unique(v.begin(), v.end());
// auto it = unique(v.begin(), v.end());
v.erase(it, v.end());  
for (auto i : v)
	cout << i << " ";
// 1 2 0 3 0 7 0 8
```



## **lambda**

`lambda`表达式是`C++11`中引入的一项新技术，利用`lambda`表达式可以编写内嵌的匿名函数，用以替换独立函数或者函数对象，并且使代码更可读。如果从广义上说，`lamdba`表达式产生的是函数对象。在类中，可以重载函数调用运算符`()`，此时类的对象可以将具有类似函数的行为，我们称这些对象为函数对象（Function Object）或者仿函数（Functor）。

`lambda`表达式一般都是从方括号`[]`开始，然后结束于花括号`{}`，花括号里面就像定义函数那样，包含了`lamdba`表达式体

```c++
// 定义简单的lambda表达式
auto basicLambda = [] { cout << "Hello, world!" << endl; };
// 调用
basicLambda();   // 输出：Hello, world!
```

上面是最简单的`lambda`表达式，没有参数。如果需要参数，那么就要像函数那样，放在圆括号里面，如果有返回值，返回类型要放在`->`后面，即拖尾返回类型，当然你也可以忽略返回类型，`lambda`会帮你自动推断出返回类型

```c++
// 指明返回类型
auto add = [](int a, int b) -> int { return a + b; };
// 自动推断返回类型
auto multiply = [](int a, int b) { return a * b; };

int sum = add(2, 5);   // 输出：7
int product = multiply(2, 5);  // 输出：10
```

`lambda`表达式最前面的方括号是`lambda`表达式一个很要的功能，就是闭包。当定义一个`lambda`表达式后，编译器会自动生成一个匿名类（这个类当然重载了`()`运算符），我们称为闭包类型（closure type）。那么在运行时，这个`lambda`表达式就会返回一个匿名的闭包实例，其实一个右值。所以，我们上面的`lambda`表达式的结果就是一个个闭包。闭包的一个强大之处是其可以通过传值或者引用的方式捕捉其封装作用域内的变量，前面的方括号就是用来定义捕捉模式以及变量，我们又将其称为`lambda`捕捉块。

```c++
int main()
{
    int x = 10;
    auto add_x = [x](int a) { return a + x; };  // 复制捕捉x
    auto multiply_x = [&x](int a) { return a * x; };  // 引用捕捉x
    
    cout << add_x(10) << " " << multiply_x(10) << endl;
    // 输出：20 100
    return 0;
}
```

> 捕获的方式
>
> []：默认不捕获任何变量；
>
> [=]：默认以值捕获所有变量；
>
> [&]：默认以引用捕获所有变量；
>
> [x]：仅以值捕获x，其它变量不捕获；
>
> [&x]：仅以引用捕获x，其它变量不捕获；
>
> [=, &x]：默认以值捕获所有变量，但是x是例外，通过引用捕获；
>
> [&, x]：默认以引用捕获所有变量，但是x是例外，通过值捕获；
>
> [this]：通过引用捕获当前对象（其实是复制指针）；
>
> [*this]：通过传值方式捕获当前对象；

```
bool is_son(string& m,string& n)
    {
        auto p = 0;
        for (auto i = 0;i < n.size() ; ++i)
        {
            if (m[p] ==  n[i]) p++;
            if (p == m.size()) return true;
        }

        return false;
    }
```


