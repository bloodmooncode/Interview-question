# iOS面试汇总

[TOC]

### Swift语言特性，相较于其他语言优势

| **安全性**           | 它通过自动内存管理和强类型系统来避免常见的编程错误，如空指针和数组越界 |
| -------------------- | ------------------------------------------------------------ |
| **现代化语法**       | Swift 的语法简洁直观，易于理解和编写。它消除了许多传统 C 语言的复杂性，如头文件和指针运算。 |
| **类型安全和推断**   | Swift 强调类型安全，同时提供了类型推断机制，使得编码更加清晰和简洁，同时减少错误 |
| **内存管理**         | 通过自动引用计数（ARC）机制，Swift 管理内存使用，无需开发者手动干预，简化了内存管理过程。 |
| **函数式编程特性**   | Swift 支持函数式编程概念，如映射、过滤和约简，这有助于编写更简洁和表达性更强的代码。 |
| **互操作性**         | Swift 可以无缝与 Objective-C 代码和 Cocoa 框架一起工作，方便了老项目向 Swift 过渡。 |
| **强大的社区和资源** | 与 Apple 生态系统的紧密结合，Swift 拥有一个活跃的开发者社区和丰富的学习资源 |

```swift
// 类型安全
var name: String = "Taylor Swift"
name = 42 // 编译错误：'Int' 类型的值不能分配给 'String' 类型的变量

// 类型推断
let age = 30 // 类型自动被推断为 'Int'
let pi = 3.14 // 类型自动被推断为 'Double'
```



### swift内存管理ARC 机制原理作用

ARC

```
当创建一个类的新实例时，ARC 会分配一块内存来存储该实例的信息。这块内存包含了实例的类型信息、以及它所存储的任何属性的值。为了确保实例在使用中保持活动状态，ARC 跟踪该实例有多少属性、常量和变量正在引用它。每当这个实例被赋予一个新的引用，其引用计数增加；当引用被取消时，引用计数减少。

当某个实例的引用计数变为零时，即没有任何属性、常量或变量引用它，ARC 会认定这个实例不再被需要，并释放它所占用的内存。这样做可以避免内存泄漏，即内存被不再需要的实例占用。
```

循环引用解决

```swift
class Person {
    let name: String
    var apartment: Apartment?
    
    init(name: String) {
        self.name = name
    }
    deinit {
        print("\(name) 被释放")
    }
}

class Apartment {
    let unit: String
    var tenant: Person?   // 改为 weak var tenant: Person?

    init(unit: String) {
        self.unit = unit
    }
    deinit {
        print("公寓 \(unit) 被释放")
    }
}

// 创建实例
var john: Person? = Person(name: "John")
var unit4A: Apartment? = Apartment(unit: "4A")

// 创建循环强引用
john!.apartment = unit4A
unit4A!.tenant = john

// 尝试打破引用
john = nil
unit4A = nil
```

手动管理MRC

**@autoreleasepool块：** 在需要手动管理内存的情况下，可以使用`@autoreleasepool`块来手动释放内存。在块内部创建的对象会在块结束时被释放。

MRC指的是手动引用计数（Manual Reference Counting），是Objective-C中一种手动管理内存的方式。在MRC模式下，开发者需要手动追踪和管理每个对象的引用计数，负责在适当的时机调用`retain`、`release`和`autorelease`等方法来增加或减少对象的引用计数，从而确保内存正确地被释放。



### iOS闭包原理

闭包（Closures）是一种在函数式编程中常见的概念，它是一个包含了函数代码块及其所在环境的对象。在Swift和Objective-C等编程语言中，闭包允许将函数作为第一类对象来处理，可以在函数内嵌套定义函数，而这个内部函数可以捕获并存储其所在上下文的变量和常量的引用。

以下是闭包的一些关键概念和原理：

1. **捕获值（Capturing Values）：** 闭包可以捕获和存储其所在上下文的常量和变量的引用。这意味着闭包可以在其定义的上下文之外引用和修改这些值，即使原始作用域已经不存在。

    ```swift
    func makeIncrementer(incrementAmount: Int) -> () -> Int {
        var total = 0
        
        let incrementer: () -> Int = {
            total += incrementAmount
            return total
        }
        
        return incrementer
    }
    
    let incrementByTwo = makeIncrementer(incrementAmount: 2)
    print(incrementByTwo()) // 输出 2
    print(incrementByTwo()) // 输出 4
    ```

2. **引用类型和值类型：** 当闭包捕获一个值类型（比如结构体或枚举）时，实际上是拷贝了这个值。但如果捕获的是引用类型（比如类实例），则是捕获了引用，闭包内外对这个引用指向的对象进行的操作会影响彼此。

    ```swift
    struct SomeStruct {
        var value: Int
    }
    
    var closure: (() -> Void)?
    
    do {
        let instance = SomeStruct(value: 42)
        closure = {
            print(instance.value)
        }
    }
    
    closure?() // 输出 42，因为 instance 是结构体，被捕获时被拷贝
    ```

3. **循环引用（Retain Cycles）：** 当闭包和类实例相互引用时，可能导致循环引用。为了避免循环引用，Swift引入了捕获列表（Capture List）的概念，用于定义在闭包中捕获的引用类型的“弱引用”或“无主引用”。

    ```swift
    class Person {
        var name: String
        var closure: (() -> Void)?
    
        init(name: String) {
            self.name = name
            setupClosure()
        }
    
        func setupClosure() {
            closure = { [weak self] in
                guard let strongSelf = self else { return }
                print("Hello, \(strongSelf.name)!")
            }
        }
    }
    
    var person: Person? = Person(name: "John")
    person?.closure?() // 输出 "Hello, John!"
    
    person = nil // Person 实例被释放，避免循环引用
    
    ```

4. **逃逸闭包（Escaping Closures）：** 逃逸闭包是在函数结束后仍然存在的闭包，可能在函数返回后执行。需要使用 `@escaping` 标记来明确声明一个逃逸闭包。逃逸闭包常见于异步操作，比如回调函数或处理异步任务的闭包。

    ```swift
    var completionHandlers: [() -> Void] = []
    
    func someFunctionWithEscapingClosure(completionHandler: @escaping () -> Void) {
        completionHandlers.append(completionHandler)
    }
    
    someFunctionWithEscapingClosure {
        print("Closure executed!")
    }
    
    completionHandlers.first?() // 输出 "Closure executed!"
    ```

5. **非逃逸闭包（Non-Escaping Closures）：** 非逃逸闭包是在函数调用过程中立即执行的闭包，不会存储在函数外部。默认情况下，Swift中的闭包是非逃逸的。

    ```swift
    func someFunctionWithNonEscapingClosure(closure: () -> Void) {
        closure()
    }
    
    someFunctionWithNonEscapingClosure {
        print("Non-escaping closure executed!")
    }
    ```

    逃逸闭包：闭包做为函数的参数传递时，在函数体结束后被调用，我们就说这个闭包逃离了这个函数体的作用域，这个闭包是逃逸型的闭包，使用@escaping来标注。

    非逃逸型的闭包：在函数体结束前被调用，闭包是非逃逸型的闭包。

6. **尾随闭包（Trailing Closure）：** 如果闭包是函数的最后一个参数，可以使用尾随闭包的语法。这样可以增加代码的可读性，将闭包表达式写在函数括号外部。



### iOS引用计数分为哪几类

在iOS中，引用计数可以分为以下几类：

-   **强引用（Strong Reference）：** 强引用是最常见的引用计数方式。当一个对象被一个强引用指向时，该对象的引用计数会增加，只有当所有强引用都被释放时，对象的引用计数才会降为零，从而释放对象的内存。

-   **弱引用（Weak Reference）：** 弱引用不会增加对象的引用计数。当一个对象只有弱引用指向时，即使弱引用存在，对象的引用计数仍然会被释放。弱引用通常用于防止循环引用，即两个或多个对象互相持有对方的强引用，导致内存泄漏。

-   **保留引用（Retained Reference）：** 在MRC（手动引用计数）中，使用 `retain` 方法来增加对象的引用计数，表示对对象的引用仍然有效。需要在适当的时机调用 `release ` 来减少引用计数，以确保内存正确释放。

-   **自动释放池引用（Autoreleased Reference）：** 在MRC中，通过 `autorelease` 方法将对象放入自动释放池，对象的引用计数会在自动释放池被释放时减少。在ARC中，自动释放池引用的管理被编译器自动处理，无需手动调用 `autorelease` 。

这些引用计数方式提供了不同的灵活性和功能，使得开发者可以根据具体情况选择适当的引用方式，以确保内存正确地管理和释放。在现代iOS开发中，ARC广泛使用，减轻了开发者手动管理引用计数的负担。



### iOS内存泄漏的情况和解决方法

内存泄漏是指应用程序中的内存未被正确释放，导致应用占用的内存不断增加，最终可能导致应用性能下降或崩溃。在iOS开发中，内存泄漏是一个比较常见的问题，通常出现在不正确的内存管理或引用循环中。以下是一些可能导致内存泄漏的情况以及相应的解决方法：

1. 强引用导致的循环引用：

**情况：** 当两个对象相互强引用时，可能形成循环引用，导致对象无法被释放。

**解决方法：**

- 对于类之间的循环引用，使用捕获列表中的`weak`或`unowned`关键字，避免强引用循环。例如：

    ```swift
    class A {
        var b: B?
    }
    
    class B {
        weak var a: A?
    }
    ```

- 对于闭包中的循环引用，使用捕获列表和`weak`关键字：

    ```swift
    class MyClass {
        var closure: (() -> Void)?
    
        func setupClosure() {
            closure = { [weak self] in
                self?.doSomething()
            }
        }
    
        func doSomething() {
            // Some action
        }
    }
    ```

2. 未正确释放资源：

**情况：** 忘记释放不再需要的对象或资源，导致内存泄漏。

**解决方法：**

- 在合适的时机，使用`deinit`方法或析构函数来释放资源。确保在对象不再需要时，资源被正确释放。
- 使用ARC（Automatic Reference Counting）可以减少手动释放资源的负担，但仍需注意避免循环引用。

3. 对象持有的强引用无法释放：

**情况：** 对象持有的强引用无法释放，通常是由于闭包中的强引用。

**解决方法：**

- 对于使用闭包的场景，使用捕获列表中的`weak`关键字，防止强引用循环。
- 如果可能，考虑使用`unowned`关键字，但要确保被引用对象在被引用的同时不会被释放。

4. 使用单例模式导致的持久对象：

**情况：** 单例模式中的对象被持久引用，无法释放。

```swift
class Singleton {
    // 使用 static 关键字创建单例
    static let shared = Singleton()

    private init() {
        // 私有化构造函数，防止外部创建实例
    }

    func doSomething() {
        // 单例的功能
    }
}

// 使用单例
Singleton.shared.doSomething()
```

**解决方法：**

- 在单例模式中，使用静态变量而不是强引用实例，以便在不再需要时能够释放内存。可以使用`static`关键字或者在 Swift 中使用`static let`创建单例。

5. 异步操作未正确管理：

**情况：** 在异步操作中，可能由于循环引用或延迟释放导致内存泄漏。

**解决方法：**

- 对于异步操作，特别是使用闭包进行回调时，使用捕获列表中的`weak`或`unowned`关键字来避免循环引用。

6. 对象被错误地保留：

**情况：** 对象被错误地保留，导致无法释放。

**解决方法：**

- 审查代码，确保只在需要的地方保留对象，并在不再需要时及时释放。



### 点击iOS App 到启动的过程

1.   加载程序包:当用户点击应用程序图标时，iOS会查找程序包并将其加载到内存中。在这个过程中，系统还会检查应用程序是否与当前设备和操作系统兼容。
2.   创建应用程序对象:一旦程序包加载到内存中，iOS将创建一个应用程序对象并为其分配内存空间。这个对象管理应用程序的生命周期，并对其进行配置和初始化。
3.   加载主窗口和根视图控制器:在应用程序对象创建后，iOS会加载应用程序窗口和根视图控制器。这是应用程序的主要用户界面，并且包含应用程序的所有其他视图控制器和视图。
4.   启动应用程序委托:应用程序委托是应用程序的代表，并负责处理应用程序的生命周期事件和其他系统事件。当应用程序启动时，iOS会调用应用程序委托的application(_:didFinishlaunchingWithOptions:)方法，并传递启动选项，以便应用程序可以进行必要的初始化。
5.   加载并初始化应用程序的核心框架:iOS系统还会在启动过程中加载和初始化应用程序的核心框架和库，例如UlKit、Foundation、Core Data和Core Location等。这些框架为应用程序提供了许多核心功能和服务。
6.   显示第一个屏幕:当所有必要的初始化都完成后，iOS会将第一个屏幕显示在用户界面上，这标志着应用程序的启动过程完成。



### swift和oc区别

语法、内存管理、性能、兼容性



### class和struct区别和各自应用场景

| Class                                            | Struct                                   |
| ------------------------------------------------ | ---------------------------------------- |
| 引用类型                                         | 值类型                                   |
| 支持继承                                         | 不支持继承                               |
| 类的实例通常是在堆上分配内存的，需要手动管理内存 | 结构体通常更轻量，因为它们在栈上分配内存 |

-   当你需要创建一个需要多个引用指向同一个实例的对象时，使用类。
-   当你需要实现继承关系时，使用类。
-   当你需要使用析构函数来执行清理工作时，使用类。
-   当你需要表示一个简单的数据结构时，如坐标点、颜色、范围等，使用结构体。
-   当你希望通过复制来传递数据而不是共享引用时，使用结构体。
-   当你想要避免使用类的引用语义和可能引发的潜在问题时，使用结构体。



### iOS开发设计原则

-   **用户体验优先：**易于使用，具有直观的界面设计，遵循iOS的设计语言和准则（如人机界面指南），并提供流畅的交互体验。

-   **简洁和一致的界面：** 应用程序的界面应该简洁明了，不应该过分复杂。保持一致性，确保应用内的各个界面和元素都符合相似的设计原则，以便用户更容易上手。

-   **性能优化：** 应用程序应该保持高性能，快速响应用户的操作。避免资源浪费、内存泄漏和低效的代码。

-   **安全性和隐私保护：** 在处理用户数据和敏感信息时，务必采取安全措施，如数据加密、身份验证和授权。同时，尊重用户的隐私，只收集必要的信息，并提供透明的隐私政策。

-   **可访问性：** 确保你的应用程序对于残障用户也是可访问的。采用无障碍功能，如屏幕阅读器支持、大文字显示等，以确保尽可能多的用户能够使用你的应用。

-   **模块化和可维护性：** 使用模块化的代码结构，采用设计模式和最佳实践，以便代码易于理解和维护。避免紧耦合的组件，提高代码的可维护性和可测试性。



### MVC和MVVM 模式有什么区别 （根本性，各自劣势和优势）

**MVC（Model-View-Controller）：**

1.  **根本性区别：**
    -   模型（Model）：负责表示应用程序的数据和业务逻辑。
    -   视图（View）：负责显示数据，并将用户输入传递给控制器。
    -   控制器（Controller）：充当模型和视图之间的中介，负责接收用户输入、处理业务逻辑，并更新视图和模型。
2.  **优势：**
    -   分离关注点：MVC将应用程序分成三个独立的组件，有助于代码的可维护性和可扩展性。
    -   易于理解：MVC是一种常见的模式，开发人员熟悉它，并且有许多支持库和框架可用于MVC开发。
    -   适用于小型应用：对于较小的应用程序，MVC可能足够简单且有效。
3.  **劣势：**
    -   始终需要手动同步：在MVC中，视图通常需要手动同步更新，这可能导致UI代码的复杂性和错误。
    -   控制器膨胀：随着应用程序复杂性的增加，控制器可能会变得过于庞大和难以维护。
    -   难以测试：由于控制器通常包含业务逻辑，因此单元测试可能会变得复杂。



**MVVM（Model-View-ViewModel）：**

1.  **根本性区别：**
    -   模型（Model）：与MVC中的模型类似，负责表示应用程序的数据和业务逻辑。
    -   视图（View）：与MVC中的视图类似，负责显示数据，但不包含业务逻辑。
    -   视图模型（ViewModel）：新引入的组件，负责将模型数据适配成视图所需的形式，并处理视图与模型之间的通信。它通常不包含视图的引用，从而降低了耦合度。
2.  **优势：**
    -   分离关注点：MVVM通过视图模型将视图与模型分离，使代码更易于维护和测试。
    -   双向数据绑定：MVVM通常包括双向数据绑定，可以自动处理模型和视图之间的同步，减少了手动更新视图的需要。
    -   适用于大型应用：对于复杂的、大型应用程序，MVVM提供了更好的结构，有助于管理复杂性。
3.  **劣势：**
    -   学习曲线：MVVM相对于传统的MVC可能有一定的学习曲线，因为它引入了新的概念，如视图模型和数据绑定。
    -   可能需要额外的框架支持：实现MVVM通常需要使用诸如RxSwift、Combine或其他数据绑定库，这可能需要一些额外的学习和配置。


​	 

### 分别介绍Model View Controller 三者之间怎么通信，谁持有谁，谁不能持有谁 

eg.model 和view之间能直接通信吗



### 属性的概念，@published @State @Environment



### iOS开发高阶函数有哪些





### iOS跨进程通信的方式

**URL Scheme：** URL Scheme 是一种简单的跨进程通信方式，通过打开一个自定义的URL来触发其他应用程序的特定操作。应用程序可以注册自己的URL Scheme，并在需要与其他应用程序通信时使用这些URL来启动其他应用程序或传递数据。

**Inter-Process Communication (IPC)：** iOS支持多种IPC机制，允许不同进程之间共享数据和通信。其中一种常见的IPC方式是XPC（XNU进程通信），它允许应用程序创建和管理独立的进程，以便在不同进程之间进行通信。XPC还支持远程过程调用（RPC），使应用程序可以在不同进程之间调用函数。

**App Groups：** App Groups 允许多个应用程序共享特定的容器目录和数据。这可以用于在不同应用程序之间共享文件和数据，以实现跨进程通信。

**通知中心（NotificationCenter）：** 通知中心允许应用程序发送和接收通知，这些通知可以在不同进程之间传递信息。虽然通知通常是在同一进程内使用的，但它们也可以用于不同进程之间的通信。

**分布式通知：** 通过使用分布式通知机制，应用程序可以在不同设备之间的不同进程之间发送和接收通知。这种通信方式通常用于多设备共享数据和状态。

**WebSocket和Socket编程：** 应用程序可以使用WebSocket或套接字（Socket）编程来进行跨进程通信。这种通信方式通常用于实时数据传输，例如聊天应用程序。

**URL Session和网络通信：** 应用程序可以使用URL Session来与远程服务器进行通信，并在不同进程之间传递数据。这通常用于从网络获取数据或将数据上传到服务器。



### Core data使用流程

Core Data 是苹果提供的一种持久化框架，用于在应用程序中管理数据模型和存储数据。下面是使用 Core Data 的一般步骤：

1. **创建数据模型文件**：

    - 打开 Xcode，选择 File -> New -> Project。
    - 在模板选择中，选择 iOS -> Core Data，创建一个项目。

2. **定义数据模型**：

    - 打开 `.xcdatamodeld` 文件，这是 Core Data 的数据模型文件。
    - 在数据模型中，可以定义实体（Entity）、属性（Attribute）、关系（Relationship）等。

3. **生成 NSManagedObject 子类**：

    - 选择实体，然后选择 Editor -> Create NSManagedObject Subclass。
    - 这将生成一个与实体相关的 NSManagedObject 子类，该类用于访问和操作实体的对象。

4. **设置 Core Data 栈**：

    - 在 AppDelegate 或其他适当的位置，设置 Core Data 栈。通常，这包括创建 NSManagedObjectModel、NSPersistentStoreCoordinator、NSManagedObjectContext 等。

        ```swift
        // 初始化 Core Data 栈
        lazy var persistentContainer: NSPersistentContainer = {
            let container = NSPersistentContainer(name: "YourDataModelName")
            container.loadPersistentStores { (_, error) in
                if let error = error as NSError? {
                    fatalError("Unresolved error \(error), \(error.userInfo)")
                }
            }
            return container
        }()
        ```

5. **进行数据操作**：

    - 使用 `NSManagedObjectContext` 对象进行数据操作，包括插入、更新、删除和查询等。

        ```swift
        // 插入数据
        let entity = NSEntityDescription.entity(forEntityName: "YourEntityName", in: context)!
        let newItem = NSManagedObject(entity: entity, insertInto: context)
        newItem.setValue("SomeValue", forKey: "propertyName")
         
        // 保存上下文
        do {
            try context.save()
        } catch {
            print("Failed to save context: \(error)")
        }
         
        // 查询数据
        let fetchRequest = NSFetchRequest<NSFetchRequestResult>(entityName: "YourEntityName")
        do {
            let result = try context.fetch(fetchRequest)
            for data in result as! [NSManagedObject] {
                print(data.value(forKey: "propertyName") as! String)
            }
        } catch {
            print("Failed to fetch data: \(error)")
        }
        ```

6. **处理并发**：

    - 当应用程序涉及到多线程操作时，确保正确地处理 Core Data 的并发。通常，你会创建不同的 `NSManagedObjectContext` 实例，并使用合适的并发队列。

        ```swift
        let privateContext = NSManagedObjectContext(concurrencyType: .privateQueueConcurrencyType)
        privateContext.parent = mainContext
        
        privateContext.perform {
            // 在 privateContext 中进行数据操作
            do {
                try privateContext.save()
            } catch {
                print("Failed to save private context: \(error)")
            }
        
            // 在主线程的 mainContext 中进行数据操作
            mainContext.performAndWait {
                do {
                    try mainContext.save()
                } catch {
                    print("Failed to save main context: \(error)")
                }
            }
        }
        ```



### iOS多线程方式

在 iOS 开发中，多线程技术是一种常见的处理异步任务和提高应用性能的手段。以下是 iOS 开发中常见的多线程技术：

1. **GCD（Grand Central Dispatch）**：

    - GCD 是一套用于并发编程的低级 API。它提供了一种简单而强大的方式来管理多线程任务。

    - 使用 `dispatch_queue` 来创建并发队列，可以选择是串行队列还是并发队列。

    - 使用 `dispatch_async`、`dispatch_sync` 等方法将任务添加到队列中。

        ```swift
        // 创建并发队列
        let concurrentQueue = DispatchQueue(label: "com.example.concurrent", attributes: .concurrent)
        
        // 在并发队列中执行异步任务
        concurrentQueue.async {
            // 异步执行的任务
        }
        ```

2. **Operation 和 OperationQueue**：

    - Operation 和 OperationQueue 是基于 GCD 的更高级的多线程抽象。它们允许你定义和管理操作，而不必直接处理底层的线程管理。

    - 使用 Operation 定义任务，将任务添加到 OperationQueue 中。

    - 支持任务的依赖关系和优先级等。

        ```swift
        // 创建 Operation
        let operation = BlockOperation {
            // 任务内容
        }
        
        // 创建 OperationQueue
        let operationQueue = OperationQueue()
        
        // 将 Operation 添加到队列中
        operationQueue.addOperation(operation)
        ```

3. **DispatchWorkItem**：

    - DispatchWorkItem 是 GCD 中的一种执行单元，可以用于执行一个任务，并与 GCD 结合使用。

    - 可以在 DispatchWorkItem 中定义任务，并使用 GCD 的 `dispatch_async` 或 `dispatch_sync` 来执行。

        ```swift
        let workItem = DispatchWorkItem {
            // 任务内容
        }
        
        // 在指定队列中执行 DispatchWorkItem
        DispatchQueue.global().async(execute: workItem)
        ```

4. **Thread 和 NSThread**：

    - Thread 和 NSThread 是 iOS 中直接管理线程的类。虽然在 iOS 中推荐使用 GCD 和 Operation，但在某些特定情况下，你可能需要直接操作线程。

    - NSThread 允许你创建和管理线程，但它相对较低级，因此在大多数情况下，不建议直接使用。

        ```swift
        // 创建并启动线程
        let myThread = Thread {
            // 线程内容
        }
        myThread.start()
        ```

5. **URLSession 和 NSURLConnection**：

    - 在进行网络请求时，iOS 提供了 URLSession（iOS 7及以上）和 NSURLConnection（iOS 6及以下）等类，它们能够在后台执行网络操作。

    - URLSession 提供了多线程支持，通过配置 URLSession 的代理方法来处理异步网络请求。

        ```swift
        let url = URL(string: "https://example.com")!
        let task = URLSession.shared.dataTask(with: url) { (data, response, error) in
            // 处理网络请求结果
        }
        task.resume()
        ```



### iOS Runloop和Runtime

`RunLoop` 和 `Runtime` 是两个在iOS和macOS开发中经常涉及的概念，它们分别用于处理事件循环和在运行时进行对象的交互。

**RunLoop（运行循环）：**

`RunLoop` 是一个事件处理循环，用于处理用户输入、定时器、网络请求等事件。它是一个在应用程序中持续运行的循环，用于监视和响应各种事件。`RunLoop` 确保应用程序在非活动状态时进入休眠状态，而在需要时唤醒以响应事件。

在iOS或macOS开发中，主线程默认会自动创建一个 `RunLoop`，但其他线程需要手动创建和运行 `RunLoop`。

常见的 `RunLoop` 使用场景包括：

- 处理用户输入事件
- 处理定时器
- 处理网络请求

**Runtime（运行时）：**

`Runtime` 是一个在程序运行时进行对象交互的系统。Objective-C语言是一门动态语言，其对象和方法调用是在运行时解析的。`Runtime` 库提供了一组C语言API，用于在运行时创建、销毁、操作类和对象。

`Runtime` 常见的使用场景包括：

- 动态创建类和对象
- 动态添加或替换方法
- 获取类的属性和方法信息
- 实现消息转发机制

总结：

- `RunLoop` 主要用于处理事件循环，确保应用程序能够响应各种事件。
- `Runtime` 则提供了在运行时动态操作类和对象的能力，使得 Objective-C 在语言层面上更加灵活。



### iOS 多线程如何保证读写安全

1. **使用互斥锁（Mutex）：**

    - 在需要保护临界区（可能会被多个线程同时访问的代码块）时，可以使用互斥锁来确保同一时刻只有一个线程能够访问该区域。在Objective-C中，可以使用`@synchronized`关键字或`NSLock`类实现互斥锁。

    ```objective-c
    @synchronized(self) {
        // 临界区代码
    }
    ```

    ```objective-c
    NSLock *lock = [[NSLock alloc] init];
    [lock lock];
    // 临界区代码
    [lock unlock];
    ```

2. **使用串行队列（Serial Queue）：**

    - 通过使用GCD（Grand Central Dispatch）的串行队列，可以确保对共享资源的访问是串行的，而不是并发的。这样可以避免多个线程同时修改共享资源的问题。

    ```objective-c
    dispatch_queue_t serialQueue = dispatch_queue_create("com.example.serialQueue", DISPATCH_QUEUE_SERIAL);
    dispatch_async(serialQueue, ^{
        // 临界区代码
    });
    ```

3. **使用读写锁（Read-Write Lock）：**

    - 读写锁允许多个线程同时读取共享资源，但只有一个线程能够写入。在Objective-C中，可以使用`pthread_rwlock_t`来实现读写锁。

    ```objective-c
    pthread_rwlock_t rwLock;
    pthread_rwlock_init(&rwLock, NULL);
    
    // 读操作
    pthread_rwlock_rdlock(&rwLock);
    // 读取共享资源
    pthread_rwlock_unlock(&rwLock);
    
    // 写操作
    pthread_rwlock_wrlock(&rwLock);
    // 修改共享资源
    pthread_rwlock_unlock(&rwLock);
    ```

4. **使用原子操作：**

    - 在某些情况下，可以使用原子操作来确保对共享资源的操作是不可分割的。在Objective-C中，可以使用`@synchronized`、`atomic`关键字或`NSLock`来实现原子操作。

    ```objective-c
    @property (atomic, strong) NSObject *atomicObject;
    ```

5. **使用线程安全的数据结构：**

    - 使用线程安全的数据结构，如`NSLocking`协议实现的`NSLock`、`NSRecursiveLock`，或者GCD提供的`dispatch_barrier_async`来确保对共享数据的访问是安全的。

    ```objective-c
    NSLock *lock = [[NSLock alloc] init];
    NSMutableArray *threadSafeArray = [NSMutableArray array];
    
    // 读操作
    [lock lock];
    // 读取和修改 threadSafeArray
    [lock unlock];
    
    // 写操作
    [lock lock];
    // 修改 threadSafeArray
    [lock unlock];
    ```



### GCD概念

GCD（Grand Central Dispatch）是苹果公司为 macOS、iOS 和其他操作系统提供的一套多核编程的API。它提供了一种更简单、更可扩展的并发模型，用于执行异步操作和并行任务。GCD 的主要目标是帮助开发者更轻松地利用多核处理器和优化系统性能。

以下是 GCD 的一些关键概念：

1. **队列（Dispatch Queue）：** 队列是 GCD 中的基本执行单元。队列用于管理和调度任务，分为串行队列和并行队列两种类型。

    - **串行队列（Serial Queue）：** 任务按顺序执行，一个任务完成后才会执行下一个任务。

    ```swift
    let serialQueue = DispatchQueue(label: "com.example.serialQueue")
    serialQueue.async {
        // 任务1
    }
    serialQueue.async {
        // 任务2
    }
    ```

    - **并行队列（Concurrent Queue）：** 任务可以同时执行，但执行顺序不确定。

    ```swift
    let concurrentQueue = DispatchQueue(label: "com.example.concurrentQueue", attributes: .concurrent)
    concurrentQueue.async {
        // 任务1
    }
    concurrentQueue.async {
        // 任务2
    }
    ```

2. **任务（Block）：** 任务是 GCD 中执行的基本单元，通常使用闭包（Block）来表示。任务可以是同步或异步执行，可以在串行队列或并行队列中执行。

    ```swift
    DispatchQueue.global().async {
        // 异步执行的任务
    }
    
    DispatchQueue.main.sync {
        // 同步执行的任务（不推荐在主队列使用同步任务，可能导致死锁）
    }
    ```

3. **全局队列（Global Queue）：** GCD 提供了全局并发队列，分为不同的优先级，让开发者能够将任务提交到系统管理的队列中。

    ```swift
    DispatchQueue.global(qos: .userInitiated).async {
        // 用户启动的异步任务
    }
    ```

4. **主队列（Main Queue）：** 主队列是一个串行队列，用于在主线程上执行任务。通常用于更新 UI 界面。

    ```swift
    DispatchQueue.main.async {
        // 在主队列上异步执行任务，通常用于更新 UI
    }
    ```

5. **调度组（Dispatch Group）：** 调度组用于管理一组任务，可以等待所有任务完成后执行另一个任务。

    ```swift
    let dispatchGroup = DispatchGroup()
    let queue = DispatchQueue.global()
    
    dispatchGroup.enter()
    queue.async {
        // 任务1
        dispatchGroup.leave()
    }
    
    dispatchGroup.enter()
    queue.async {
        // 任务2
        dispatchGroup.leave()
    }
    
    dispatchGroup.notify(queue: .main) {
        // 所有任务完成后执行的任务
    }
    ```

GCD 简化了多线程编程，提供了高效、安全且易用的接口，帮助开发者充分利用多核处理器，实现并发和异步操作。



### UIKit控件有哪些，iOS自定义样式view绘制



### iOS Animaiton 类型



### iOS页面间通信方式



### required 关键字



### extension 扩展



### 手势处理底层机制



### Combine and Core Data

