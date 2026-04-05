# ドメイン設計

## User Aggregate

### モデル図

```mermaid
classDiagram
 
class User {
  <<RootEntity>>
  id: UserId
  email: string
  name: string
  role: Role
  password: string
  isDelete: boolean
}

class UserId {
  <<ValueObject>>
  value: string
}

class Role {
  <<ValueObject>>
  value: [admin, general]
}


User *-- Role
User *-- UserId
```

### ドメインルール

| 属性     | 制約                                                | 必須 |
| -------- | --------------------------------------------------- | ---- |
| id       | UILD                                                | ✅   |
| email    | メールアドレス形式 <br> 最大文字数：50文字          | ✅   |
| name     | 最大文字数：30文字                                  | ✅   |
| role     | admin（管理者）, general（一般）                    | ✅   |
| password | 8文字以上16文字以下<br>保存形式はハッシュ化された値 | ✅   |
| isDelete | デフォルト値：false                                 | ✅   |

___

## Group Aggregate

```mermaid
classDiagram
class Group {
  <<RootEntity>>
  id: GroupId
  name: string
  description: string
  groupClassification: GroupClassification
}

class GroupId {
  <<ValueObject>>
  value: string
}

class GroupClassification {
  <<ValueObject>>
  value: private | public
}

class GroupMembership {
  <<ValueObject>>
  userId: UserId
}


Group *-- GroupId
Group "1" --> "many" GroupMembership
Group *-- GroupClassification
```

| 属性                | 制約                             | 必須 |
| ------------------- | -------------------------------- | ---- |
| id                  | UILD                             | ✅   |
| name                | 最大文字数：30文字               | ✅   |
| description         | 最大文字数：80文字               | ✅   |
| groupClassification | admin（管理者）, general（一般） | ✅   |
| GroupMembership     | UILD                             | ✅   |

___

## Project Aggregate

```mermaid
classDiagram

class Project {
  <<RootEntity>>
  id: ProjectId
  groupId: GroupId
  name: string
  description: string
  createById: UserId
}

class ProjectId {
  <<ValueObject>>
  value: string
}


Project *-- ProjectId
```

| 属性        | 制約               | 必須 |
| ----------- | ------------------ | ---- |
| id          | UILD               | ✅   |
| groupId     | UILD               | ✅   |
| name        | 最大文字数：30文字 | ✅   |
| description | 最大文字数：80文字 | ✅   |
| createById  | UILD               | ✅   |

___

## Todo Aggregate

```mermaid
classDiagram

class Todo {
  <<RootEntity>>
  id: TodoId
  workspaceId: WorkspaceId
  title: string
  description: string
  status: TodoStatus
  dueDate: Date
  assigneeId: UserId
  createdBy: UserId
}

class TodoId {
  <<ValueObject>>
  value: string
}

class TodoStatus {
  <<ValueObject>>
  value: 未着手 | 進行中 | 完了
}

Todo *-- TodoId
Todo *-- TodoStatus
```

| 属性        | 制約                                                       | 必須 |
| ----------- | ---------------------------------------------------------- | ---- |
| id          | UILD                                                       | ✅   |
| workspaceId | UILD                                                       | ✅   |
| title       | 最大文字数：30文字                                         | ✅   |
| description | 最大文字数：80文字                                         | ✅   |
| status      | 未着手 (NotStarted) , 進行中(InProgress) , 完了(Completed) | ✅   |
| dueDate     |                                                            | ✅   |
| assigneeId  |                                                            | ✅   |
| createdBy   |                                                            | ✅   |