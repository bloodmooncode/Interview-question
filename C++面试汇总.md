# C++面试汇总

[TOC]

### C++ 内存分区

**栈（Stack）**：

-   用于存储局部变量和函数调用的信息

    ```c++
    int a = 0;
    ```

**堆（Heap）**:  

-   用于动态内存分配，由程序员手动分配和释放

-   空间相比栈更大，灵活性更高

-   使用 `new ` 和`delete` (或 `malloc` 和  `free` 在C风格编程中)进行内存分配和释放。不正确地管理堆内存可能导致内存泄漏或其他问题。

    ```c++
    #include <iostream>
    #include <cstdlib>
    
    int main() {
        // 使用malloc分配内存
        int* ptr = static_cast<int*>(malloc(sizeof(int))); 
        // 分配一个整数大小的内存空间，并返回指向该内存的指针
    
        // 检查内存是否分配成功
        if (ptr != nullptr) {
            // 在分配的内存中存储数据
            *ptr = 42;
            std::cout << "Value: " << *ptr << std::endl;
    
            // 释放内存
            free(ptr); // 释放先前分配的内存
        } else {
            std::cerr << "Memory allocation failed." << std::endl;
        }
    
        return 0;
    }
    ```

**全局/静态存储区**:  

-   用于存储全局变量和静态变量。

    静态变量（Static Variable）是在程序运行期间存在于静态存储区域的变量，它的生命周期与整个程序的运行时间相同。静态变量通常在函数内或全局作用域内声明，并且在声明时使用关键字 `static` 标记。静态变量与普通变量（非静态变量）的主要区别在于它们的生命周期和作用域。

    **生命周期：** 静态变量的生命周期与程序的生命周期相同。它们在程序启动时被创建，在程序终止时被销毁。这使得静态变量可以在函数调用之间保持其值不变。

    **作用域：** 静态变量的作用域可以是局部或全局，取决于它们在哪里声明。

    -   局部静态变量：在函数内部声明的静态变量，只能在该函数内部访问，但它们的生命周期跨越多次函数调用。
    -   全局静态变量：在函数外部声明的静态变量，可以在整个程序中访问，但它们的可见性被限制在声明它们的文件内。

-   在程序开始执行时分配，在程序结束时释放。

-   变量在整个程序执行期间都存在。

**常量存储区**:  

-   存储常量数据，如字符串字面量。

-   通常是只读的。

    ```c++
    const char* str = "Hello, world!"; // c风格
    std::string str = "Hello, world!"; // c++风格
    ```

**代码区**：

-   存储程序的二进制代码。

-   通常是只读的，防止程序代码被意外修改。

    

### C++ 内存管理手段

**new 和 delete 操作符：**

-   `new` 操作符用于动态分配堆内存，并返回分配内存的地址。可以用它来创建动态对象，如类的实例。
-   `delete` 操作符用于释放通过 `new` 分配的内存，以防止内存泄漏。

```c++
int *ptr = new int;   // 分配整数大小的堆内存
delete ptr;           // 释放分配的堆内存
```

**数组的 new 和 delete 操作符：**

-   `new[]` 操作符用于分配堆内存来存储数组，并返回分配内存的地址。
-   `delete[]` 操作符用于释放通过 `new[]` 分配的数组内存。

```c++
int *arr = new int[10];   // 分配整数数组的堆内存
delete[] arr;             // 释放分配的堆内存
```

**智能指针：**

-   C++11引入了智能指针，如 `std::shared_ptr` 和 `std::unique_ptr`，用于自动管理内存。
-   智能指针可以自动释放它们所拥有的对象的内存，避免了手动调用 `delete`。

```c++
std::shared_ptr<int> ptr = std::make_shared<int>(42);  // 创建一个 shared_ptr
```

**栈上分配：**

-   C++允许在栈上分配对象，这些对象在其作用域结束时自动销毁。
-   栈内存管理是自动的，无需手动释放内存。

```c++
int x = 10; // 在栈上分配整数变量，自动释放
```

**RAII（资源获取即初始化）：**

-   RAII 是一种C++编程范式，它利用对象的生命周期来管理资源（如内存、文件句柄等）。
-   使用 RAII，可以在对象构造时分配资源，在对象销毁时释放资源，确保资源的正确管理。

```c++
class FileHandler {
public:
    FileHandler(const char* filename) {
        file = fopen(filename, "r");
    }

    ~FileHandler() {
        if (file) {
            fclose(file);
        }
    }
private:
    FILE* file;
};
```



### C++内存泄漏场景

**动态内存未释放:**
最常见的场景是使用new关键字分配了堆内存，但忘记使用 delete来释放。例如，一个函数内部创建了一个动态数组或对象，但没有在适当的时候释放它。

**循环引用:**
在使用智能指针(如 std::shared_ptr)时，如果存在循环引用，可能导致对象无法被正确释放。

**异常安全性不足:**
在函数中可能会抛出异常，如果在抛出异常之前已经分配了内存，但在捕获异常时未能释放该内存，也会导致内存泄漏。

**指针覆盖:**
如果一个指针被重新赋值指向另一个地址，而其原本指向的内存未被释放，那么原本的内存就无法再被访问和释放，导致泄漏。



### 深拷贝和浅拷贝

-   **浅拷贝(Shallow Copy) :**

    浅拷贝仅复制对象的成员值，如果成员包含指针，则仅复制指针的值(即内存地址)，而不复制指针所指向的实际数据。
    这意味着原始对象和拷贝对象的指针成员将指向相同的内存地址。
    浅拷贝通常是默认的复制行为。
    **示例:**
    假设有一个类 `SimpleClass`，其中有一个指向`int`类型的指针成员。使用默认的复制构造函数(浅拷贝)来复制`SimpleClass`的实例时，新对象的指针成员将指向与原始对象相同的内存地址。

    ```c++
    class SimpleClass {
    	public:
        int* ptr;
        SimpleClass(int val){
        	ptr = new int(val);
        }
    };
    SimpleClass obj1(10);
    SimpleClass obj2 = obj1; //浅拷贝
    ```

    在这种情况下，`obj1 ` 和 `obj2`的ptr指向同一个内存地址。

-   **深拷贝(Deep Copy):**

    深拷贝不仅复制对象的成员值，如果成员包含指针，则还会复制指针所指向的数据到新的内存地址。
    这样，原始对象和拷贝对象的指针成员将指向不同的内存地址，它们互不影响。
    **示例:**
    修改上面的SimpleClass，以实现深拷贝。

    ```c++
    class SimpleClass {
    public:
    	int* ptr;
        SimpleClass(int val) {
        	ptr = new int(val);
        }
        //深拷贝构造函数
        SimpleClass(const SimpleClass &obj){ 
            ptr = new int(*obj.ptr);
        }
    };
    
    SimpleClass obj1(10);
    SimpleClass obj2 = obj1;//深拷贝
    ```

    在这种情况下，`obj1` 和 `obj2`的ptr指向不同的内存地址。
    深拷贝通常在对象含有动态分配的内存或资源时使用，以确保每个对象都有其自己的独立副本，避免资源共享导致的问题，如多次释放同一资源。



### 野指针是什么？如何避免产生野指针?

野指针是指向“不可预知”或“无效”内存的指针。在C++中，野指针通常发生在以下几种情况:

-   未初始化的指针: 声明了一个指针但没有给它赋予一个确切的地址。

-   已删除或释放的内存: 当一个指针指向的内存被删除或释放后，该指针仍然指向那个地址，但那个地址的内容已经不再有效。

```c++
#include <iostream>

int main() {
    int* ptr = new int(42); // 使用 new 创建一个整数，并分配内存
    delete ptr;            // 释放内存
    
    // 现在 ptr 指向的内存已经被释放，但 ptr 仍然指向那个地址
    // 尝试访问已删除的内存会导致未定义的行为
    std::cout << *ptr << std::endl; // 可能会导致崩溃或不确定的结果

    return 0;
}
```

在上面的示例中，指针 `ptr` 在使用 `delete` 释放内存后，仍然保留了对已删除内存的引用。尝试访问已删除的内存会导致未定义的行为。

-   超出作用域的指针: 指针指向的内存区域已经不再属于程序控制的范围，比如指向了局部变量的内存，而该局部变量已经超出了其作用域。

```c++
#include <iostream>

int* createInt() {
    int x = 10;       // 声明一个整数变量 x
    int* ptr = &x;    // ptr 指向局部变量 x
    return ptr;       // 返回指向局部变量的指针
}

int main() {
    int* ptr = createInt(); // 在 createInt 函数中创建的指针
    // createInt 函数返回后，局部变量 x 已超出作用域
    // ptr 现在指向不再有效的内存

    // 尝试访问已经超出作用域的指针会导致未定义的行为
    std::cout << *ptr << std::endl; // 可能会导致崩溃或不确定的结果

    return 0;
}
```

野指针非常危险，因为它们可能会导致程序崩溃或数据损坏。避免野指针的方法包括:

-   初始化指针: 声明指针时，始终将其初始化为`nullptr` 或有效地址。

-   使用智能指针: 利用C++的智能指针(如`std::shared_ptr`或`std::unique_ptr`)，这些智能指针可以自动管理内存，减少内存泄漏和野指针的风险。

-   及时设置为nullptr: 一旦释放了指针指向的内存，立即将指针设置为`nullptr`。这样可以确保不会意外地使用已经释放的内存。
-   小心处理指针的作用域： 确保指针不会超出其应有的作用域，尤其是不要让指针指向临时或局部变量的地址。



### 智能指针的概念和种类

智能指针通过自动化内存管理帮助解决内存泄漏。它们确保当智能指针离开其作用域时，其指向的内存得到适当的释放。这是通过利用RAII(资源获取即初始化)原则来实现的，即在对象创建时获取资源，在对象销毁时释放资源。
C++标准库提供了几种智能指针，如`std::unique_ptr` 、`std::shared_ptr` 和`std::weak_ptr `

`std::unique_ptr` :它拥有它所指向的对象。当`unique_ptr`对象被销毁时(如离开作用域)，它指向的对象也会被删除。这种指针不支持复制，确保了对象的唯一所有权。

`std::shared_ptr` :这种指针允许多个`shared_ptr`实例共享同一个对象的所有权。当最后一个拥有该对象的`shared_ptr`被销毁时，对象才会被删除。这是通过内部使用引用计数机制来实现的。

`std::weak_ptr`:这是一种不拥有对象的智能指针，它指向由某个`shared_ptr`管理的对象。它用于解决 `shared_ptr`可能导致的循环引用问题。



### Swift指针和C++智能指针关系

Swift 的引用类型和 C++ 的智能指针有一些相似之处，因为它们都用于管理内存和对象的生命周期，但它们在语法和实现上有一些不同。

**Swift 的引用类型：**

在 Swift 中，引用类型是通过类来实现的，而不是通过结构体或枚举。Swift 中的引用类型有以下特点：

引用语法：Swift 使用类似于 C++ 的指针语法来访问对象的属性和方法，但它隐藏了引用计数的细节，使得引用管理更加简单和安全。

```swift
class Person {
    var name: String
    init(name: String) {
        self.name = name
    }
}
var person1: Person? = Person(name: "Alice")
var person2: Person? = person1
// 引用计数为2，两个变量指向同一个对象

person1 = nil
// 引用计数为1

person2 = nil
// 引用计数为0，对象自动释放
```

**C++ 的智能指针：**

在 C++ 中，智能指针是一种对象，用于管理动态分配的内存。C++ 中有两种主要类型的智能指针：

`std::shared_ptr`：表示多个指针共享同一个对象，使用引用计数来跟踪对象的引用数量。当引用计数为零时，对象被自动释放。

这段源码是 `shared_ptr` 的实现，以下是每个代码片段的作用：

1. **成员变量声明和构造函数:**

    ```cpp
    private:
        T* ptr;
        size_t* ref_count;
    
    public:
        shared_ptr(T* p = nullptr) : ptr(p), ref_count(new size_t(1)) {}
    ```

    - `ptr`: 存储指向动态分配内存的指针。
    - `ref_count`: 存储引用计数的指针，用于跟踪共享 `ptr` 的 `shared_ptr` 实例的数量。
    - 构造函数初始化 `ptr` 为传入的指针，`ref_count` 初始化为 1。

2. **拷贝构造函数:**

    ```cpp
    shared_ptr(const shared_ptr& other) : ptr(other.ptr), ref_count(other.ref_count) {
        (*ref_count)++;
    }
    ```

    - 用于创建共享 `ptr` 的新实例。
    - 将 `ptr` 和 `ref_count` 从另一个 `shared_ptr` 实例复制。
    - 增加引用计数。

3. **析构函数:**

    ```cpp
    ~shared_ptr() {
        release();
    }
    ```

    - 释放资源的函数，被析构函数和赋值运算符共享。

4. **赋值运算符重载:**

    ```cpp
    shared_ptr& operator=(const shared_ptr& other) {
        if (this != &other) {
            release();
            ptr = other.ptr;
            ref_count = other.ref_count;
            (*ref_count)++;
        }
        return *this;
    }
    ```

    - 赋值运算符，用于实现 `shared_ptr` 的赋值操作。
    - 在复制另一个实例之前释放当前实例的资源。
    - 复制 `ptr` 和 `ref_count`，并增加引用计数。

5. **解引用和成员访问运算符重载:**

    ```cpp
    T& operator*() const {
        return *ptr;
    }
    
    T* operator->() const {
        return ptr;
    }
    ```

    - 使 `shared_ptr` 实例可以像指针一样被解引用和访问成员。

6. **私有函数 `release`:**

    ```cpp
    private:
        void release() {
            if (--(*ref_count) == 0) {
                delete ptr;
                delete ref_count;
            }
        }
    ```

    - 释放资源的私有函数。
    - 如果引用计数减为零，删除动态分配的内存。

最后，示例程序在 `main` 函数中展示了 `shared_ptr` 的用法，创建两个实例并共享相同的动态分配内存。

```c++
#include <memory>

std::shared_ptr<int> ptr1 = std::make_shared<int>(42);
std::shared_ptr<int> ptr2 = ptr1;
// 引用计数为2，两个智能指针指向同一个对象

ptr1 = nullptr;
// 引用计数为1

ptr2 = nullptr;
// 引用计数为0，对象自动释放
```

`std::unique_ptr`：表示独占所有权的指针，一旦一个 `std::unique_ptr` 拥有一个对象，其他指针就无法拥有它。

这段源码是 `unique_ptr` 的实现，以下是每个代码片段的作用：

1. **成员变量声明和构造函数:**

    ```cpp
    private:
        T* ptr;
    
    public:
        unique_ptr(T* p = nullptr) : ptr(p) {}
    ```

    - `ptr`: 存储指向动态分配内存的指针。
    - 构造函数初始化 `ptr` 为传入的指针。

2. **移动构造函数:**

    ```cpp
    unique_ptr(unique_ptr&& other) noexcept : ptr(other.ptr) {
        other.ptr = nullptr;
    }
    ```

    - 用于创建新实例，从另一个 `unique_ptr` 实例“窃取”资源。
    - 将 `ptr` 从另一个实例中移动，并将源实例的 `ptr` 设置为 `nullptr`，以防止资源的二次释放。

3. **移动赋值运算符重载:**

    ```cpp
    unique_ptr& operator=(unique_ptr&& other) noexcept {
        if (this != &other) {
            delete ptr;
            ptr = other.ptr;
            other.ptr = nullptr;
        }
        return *this;
    }
    ```

    - 移动赋值运算符，用于实现 `unique_ptr` 的移动赋值操作。
    - 在释放当前实例的资源之前，将 `ptr` 从另一个实例中移动。

4. **析构函数:**

    ```cpp
    ~unique_ptr() {
        delete ptr;
    }
    ```

    - 释放资源的函数，被析构函数和移动赋值运算符共享。

5. **解引用和成员访问运算符重载:**

    ```cpp
    T& operator*() const {
        return *ptr;
    }
    
    T* operator->() const {
        return ptr;
    }
    ```

    - 使 `unique_ptr` 实例可以像指针一样被解引用和访问成员。

6. **释放所有权的函数 `release`:**

    ```cpp
    T* release() {
        T* temp = ptr;
        ptr = nullptr;
        return temp;
    }
    ```

    - 返回 `unique_ptr` 实例所拥有的指针，并将自身的 `ptr` 设置为 `nullptr`，释放所有权。

最后，示例程序在 `main` 函数中展示了 `unique_ptr` 的用法，创建两个实例并演示了资源的所有权移动操作。

```c++
#include <memory>

std::unique_ptr<int> ptr1 = std::make_unique<int>(42);
// std::unique_ptr<int> ptr2 = ptr1; // 编译错误，std::unique_ptr 不能复制

ptr1 = nullptr;
// 对象被自动释放
```

**关系和区别：**

-   Swift 的引用类型和 C++ 的智能指针都用于管理对象的生命周期，以防止内存泄漏。
-   Swift 的引用计数机制和 C++ 的引用计数智能指针（如 `std::shared_ptr`）非常相似，它们都可以处理多个引用共享同一个对象。
-   C++ 的 `std::unique_ptr` 与 Swift 的引用类型不同，它表示独占所有权，只有一个指针可以拥有对象。这在 C++ 中类似于使用值语义的 Swift 结构体。



### delete和free之间关系

**delete**

-   **用途**: `delete` 是C++中用于释放动态分配的内存的操作符。它与 new 操作符配对使用。
-   **特点**:当使用 `new` 分配一个对象时，`delete` 负责调用该对象的析构函数并释放分配给它的内存。如果对象是一个数组，应该使用` delete[]` 来释放。
-   **应用场景**: 主要用于 C++中分配对象和数组，尤其是在构造函数和析构函数中涉及复杂资源管理时。

**free**

-   **用途**: `free`是C语言标准库中的函数，与`malloc`, `calloc`或`realloc`配对使用来释放内存。

-   **特点**:`free`释放由 `malloc`系列函数分配的内存，但不会调用任何析构函数，因为`malloc`和`free`是C语言中的一部分，而C语言没有构造函数或析构函数的概念。

-   **应用场景**:在C程序中处理原始内存分配时使用，或者在C++中处理非对象的原始内存时使用。

    总之，delete是C++的组成部分，它理解对象的概念，能够调用析构函数来正确地清理对象。而free仅仅是释放内存块，不涉及任何构造或析构的概念。使用时必须匹配:用new分配的内存要用 delete释放，用 malloc分配的内存要用 free释放。混用会导致未定义行为，可能引发程序崩溃或内存泄漏。



### Lambda表达式

Lambda 表达式是 C++11 引入的一项功能，允许在代码中创建匿名函数。Lambda 表达式可以用来替代传统的函数对象（函数指针或函数对象类），并且通常在需要简短的功能时非常方便。

Lambda 表达式的基本形式如下：

```cpp
[capture](parameters) -> return_type {
    // lambda body
}
```

其中：

- `capture` 指定了在 lambda 函数体内可用的外部变量。可以是值传递、引用传递，或者省略。
- `parameters` 是 lambda 函数的参数列表，与普通函数类似。
- `return_type` 指定了 lambda 函数的返回类型，可以省略。
- `lambda body` 包含了 lambda 函数的实际操作。

下面是一些 Lambda 表达式的示例：

1. Lambda 表达式作为函数参数：

    ```cpp
    #include <iostream>
    #include <vector>
    #include <algorithm>
    
    int main() {
        std::vector<int> numbers = {1, 2, 3, 4, 5};
    
        // 使用 Lambda 表达式作为函数参数，打印每个元素
        std::for_each(numbers.begin(), numbers.end(), [](int x) {
            std::cout << x << " ";
        });
    
        return 0;
    }
    ```

2. Lambda 表达式捕获外部变量：

    ```cpp
    #include <iostream>
    
    int main() {
        int multiplier = 2;
    
        // Lambda 表达式捕获外部变量，并将其乘以2
        auto multiply = [multiplier](int x) {
            return x * multiplier;
        };
    
        std::cout << multiply(5) << std::endl;  // 输出 10
    
        return 0;
    }
    ```

3. Lambda 表达式返回值：

    ```cpp
    #include <iostream>
    
    int main() {
        // Lambda 表达式返回两个数的和
        auto add = [](int a, int b) -> int {
            return a + b;
        };
    
        std::cout << add(3, 4) << std::endl;  // 输出 7
    
        return 0;
    }
    ```

Lambda 表达式是一种方便的方式来定义短小的匿名函数，实现原理如下：

Lambda 表达式是 C++11 引入的一项功能，它允许在代码中定义匿名函数。Lambda 表达式的实现原理涉及到闭包和匿名函数对象。以下是 Lambda 表达式的主要实现原理：

1. **闭包：** Lambda 表达式允许在其内部捕获外部的变量。为了支持这种捕获，C++ 编译器生成了一个闭包对象，它持有捕获的变量，并作为 Lambda 表达式的实际函数体使用。这个闭包对象是一个类对象，通常被称为“闭包类”。

2. **匿名函数对象：** Lambda 表达式本质上是一个匿名的函数对象，因为它可以像函数一样被调用。为了实现这个匿名函数对象，编译器生成了一个类，这个类有一个 `operator()` 函数，它包含了 Lambda 表达式的实际执行代码。

3. **捕获外部变量：** 如果 Lambda 表达式捕获了外部变量，编译器会在闭包对象中创建对应的成员变量，并在闭包类的构造函数中将这些变量初始化。这样，Lambda 表达式内部就能够访问和修改这些捕获的外部变量。

4. **生成闭包类：** 编译器在编译时生成一个闭包类，该类包含了 Lambda 表达式的实际代码以及捕获的外部变量。这个生成的类可能会包含成员变量、构造函数、析构函数和 `operator()` 函数等。



### vector 实现原理

C++中的` vector`是一个序列容器，它封装了动态大小数组的功能。在内存上，` vector`通常是这样实现的:
**动态数组** :  `vector`底层使用一个动态分配的数组来存储元素。当我们创建一个`vector`时，它会根据需要的容量在堆上分配一块内存。
**自动扩容** : 当向`vector `添加元素而当前的内存不足以容纳更多元素时， `vector` 会自动进行扩容。这通常涉及到以下步骤:

-   分配一个更大的新内存块。

-   将现有元素从旧内存块复制到新内存块。

-   释放旧内存块。

-   更新内部指针以指向新的内存块。

**连续内存** : ` vector`的元素在内存中是连续存储的，这意味着可以通过指针算术直接访问它们，这也使得 `vector`能够提供类似数组的高效随机访问。
**空间复杂度** : `vector`通常会预留一些额外的未使用空间，以减少频繁扩容的需求。当新元素被添加到`vector`时，如果预留空间足够，则无需重新分配内存。

为了更好地管理Vector容器的内存，Vector 会预先分配一块内存空间，并维护三个指针:begin、end 和end_of_storage。 begin 指向存储第一个元素的地址，end指向最后一个元素的下一个位置的地址，而
end_of_storage则指向整块内存的最后一个地址。这个方式可以提高 Vector的添加和删除元素操作的效率。



### 值传递，指针传递，引用传递

在C++中，可以使用值传递、指针传递和引用传递来传递参数给函数。以下是每种传递方式的示例代码：

**值传递（Pass by Value）：**

```cpp
#include <iostream>

void valuePass(int x) {
    x += 10;
    std::cout << "Inside function: " << x << std::endl;
}

int main() {
    int num = 5;
    valuePass(num);
    std::cout << "Outside function: " << num << std::endl;
    return 0;
}
```

在值传递中，函数接受参数的副本，对参数的修改不会影响原始值。在上面的示例中，函数 `valuePass` 接受 `num` 的副本，修改了副本，但不影响原始的 `num`。

**指针传递（Pass by Pointer）：**

```cpp
#include <iostream>

void pointerPass(int* x) {
    (*x) += 10;
    std::cout << "Inside function: " << (*x) << std::endl;
}

int main() {
    int num = 5;
    pointerPass(&num);
    std::cout << "Outside function: " << num << std::endl;
    return 0;
}
```

在指针传递中，函数接受一个指向参数的指针，通过指针可以修改参数的值。在上面的示例中，函数 `pointerPass` 接受一个指向 `num` 的指针，并通过指针修改了 `num` 的值。

**引用传递（Pass by Reference）：**

```cpp
#include <iostream>

void referencePass(int& x) {
    x += 10;
    std::cout << "Inside function: " << x << std::endl;
}

int main() {
    int num = 5;
    referencePass(num);
    std::cout << "Outside function: " << num << std::endl;
    return 0;
}
```

在引用传递中，函数接受参数的引用，通过引用可以修改参数的值，并且不需要使用指针操作。在上面的示例中，函数 `referencePass` 接受 `num` 的引用，修改了 `num` 的值。



### 虚函数、纯虚函数实现

在C++中，虚函数和纯虚函数是用于实现多态性（Polymorphism）的重要概念。它们用于允许派生类（子类）覆盖基类（父类）的函数，以实现不同的行为。以下是虚函数和纯虚函数的示例实现：

**虚函数（Virtual Function）：**

虚函数是在基类中声明为 `virtual` 的函数，它可以在派生类中被覆盖（重写）。虚函数的特点是，基类指针或引用可以在运行时根据对象的实际类型来调用正确的虚函数实现。

```cpp
#include <iostream>

class Base {
public:
    void normalFunction() {
        std::cout << "Base::normalFunction()" << std::endl;
    }

    virtual void virtualFunction() {
        std::cout << "Base::virtualFunction()" << std::endl;
    }
};

class Derived : public Base {
public:
    void normalFunction() {
        std::cout << "Derived::normalFunction()" << std::endl;
    }

    void virtualFunction() override {
        std::cout << "Derived::virtualFunction()" << std::endl;
    }
};

int main() {
    Base* basePtr = new Derived();
    basePtr->normalFunction(); // 调用Base类的normalFunction()，静态绑定
    basePtr->virtualFunction(); // 调用Derived类的virtualFunction()，动态绑定
    
    // 输出
   	// Base::normalFunction()
	// Derived::virtualFunction()

    delete basePtr;

    return 0;
}
```

在上面的示例中，`Base` 类中的 `show` 函数被声明为虚函数，然后在 `Derived` 类中覆盖了该函数。在 `main` 函数中，我们创建了一个 `Derived` 类的对象，并通过 `Base` 类的指针调用 `show` 函数，但实际上会调用 `Derived` 类的实现。

**纯虚函数（Pure Virtual Function）：**

纯虚函数是在基类中声明为纯虚函数（没有实现），并且要求派生类必须提供实现。一个类包含纯虚函数的类称为抽象类，不能被实例化，只能用作派生类的基类。

```cpp
#include <iostream>

class Shape {
public:
    virtual void area() = 0; // 纯虚函数，没有实现
};

class Circle : public Shape {
public:
    void area() override {
        std::cout << "Area of Circle" << std::endl;
    }
};

class Rectangle : public Shape {
public:
    void area() override {
        std::cout << "Area of Rectangle" << std::endl;
    }
};

int main() {
    // Shape* shape = new Shape(); // 错误，不能创建抽象类的实例
    Shape* circle = new Circle();
    Shape* rectangle = new Rectangle();

    circle->area();    // 调用Circle类的area函数
    rectangle->area(); // 调用Rectangle类的area函数

    delete circle;
    delete rectangle;

    return 0;
}
```

在上面的示例中，`Shape` 类包含一个纯虚函数 `area`，它没有实现。`Circle` 和 `Rectangle` 类继承自 `Shape` 类，并分别提供了 `area` 函数的实现。尝试创建 `Shape` 类的实例会导致编译错误，因为它是抽象类。



### 静态变量

`static` 关键字在 C++ 中可以用于不同的上下文，包括变量、函数和类的成员。下面是 `static` 变量的主要作用：

1. **静态局部变量：**

    ```cpp
    void exampleFunction() {
        // 静态局部变量
        static int localVar = 0;
        localVar++;
    }
    ```

    - **作用：** 静态局部变量在函数调用之间保持其值，而不同于普通局部变量，它只在第一次进入函数时初始化一次。
    - **用途：** 用于在函数调用之间保持状态或计数。

2. **静态全局变量：**

    ```cpp
    // 静态全局变量
    static int globalStaticVar = 42;
    ```

    - **作用：** 静态全局变量具有全局作用域，但只在声明它的源文件中可见。它在整个程序执行期间存在，只初始化一次。
    - **用途：** 用于在整个程序执行期间共享状态。

3. **静态数据成员：**

    ```cpp
    class MyClass {
    public:
        // 静态数据成员
        static int staticDataMember;
    };
    ```

    - **作用：** 静态数据成员属于类而不是类的实例。它在程序执行期间只有一份副本，而不是每个对象都有一份。
    - **用途：** 用于在所有类实例之间共享数据。

4. **静态成员函数：**

    ```cpp
    class MyClass {
    public:
        // 静态成员函数
        static void staticMemberFunction() {
            // ...
        }
    };
    ```

    - **作用：** 静态成员函数不依赖于特定对象的实例，因此它可以直接通过类名调用，而不需要实例化对象。
    - **用途：** 用于与类的实例无关的操作，例如工具函数或访问静态数据成员。



### 析构函数

析构函数（Deinitializer）用于在对象被销毁或释放时执行清理和资源释放的操作。在不同编程语言中，析构函数可能会有不同的名称，例如在Swift中使用`deinit`关键字来定义析构函数，而在C++中使用`~ClassName`的语法。

析构函数通常用于以下情况：

1.  **资源释放：** 当一个对象持有一些外部资源，如文件句柄、网络连接、数据库连接或内存分配，析构函数可以用来释放这些资源，以防止资源泄漏和内存泄漏。
2.  **清理操作：** 有时候对象需要在销毁时执行一些清理操作，例如关闭打开的文件、保存未保存的数据、取消订阅观察者等。