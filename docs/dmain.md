
```mermaid
classDiagram
    Animal <|-- Dog
    Animal <|-- Cat
    class Animal {
        +String name
        +makeSound()
    }
    class Dog {
        +bark()
    }
    class Cat {
        +meow()
    }

  class User {
    id: UserId
    email: string
    name: string
    role: Role
    password: string
    isDelete: boolean
    privateGroup: Group
  }

```
````