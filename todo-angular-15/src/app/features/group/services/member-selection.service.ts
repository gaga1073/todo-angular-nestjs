import { Injectable } from '@angular/core';

export type SelectUsersList = {
  id: string;
  name: string;
};

/**
 * グループ/ユーザーモーダル共通のメンバー選択ロジック
 */
@Injectable({
  providedIn: 'root',
})
export class MemberSelectionService {
  /**
   * 候補リストから選択済みユーザーを除外
   */
  excludeSelectionUsers(
    usersList: SelectUsersList[],
    selectedUsers: SelectUsersList[],
  ): SelectUsersList[] {
    return usersList.filter((user) => !selectedUsers.some((selected) => selected.id === user.id));
  }

  /**
   * メンバーを追加
   * - 既に選択済みの場合は何もしない
   */
  addMember(
    userId: string,
    usersList: SelectUsersList[],
    selectedUsers: SelectUsersList[],
  ): SelectUsersList[] {
    const existing = selectedUsers.find((u) => u.id === userId);
    if (existing) {
      return selectedUsers;
    }
    const user = usersList.find((u) => u.id === userId);
    if (user) {
      return [...selectedUsers, user];
    }
    return selectedUsers;
  }

  /**
   * メンバーを削除
   */
  removeMember(userId: string, selectedUsers: SelectUsersList[]): SelectUsersList[] {
    return selectedUsers.filter((u) => u.id !== userId);
  }

  /**
   * 複数メンバーを削除
   */
  removeMembers(userIds: string[], selectedUsers: SelectUsersList[]): SelectUsersList[] {
    const idSet = new Set(userIds);
    return selectedUsers.filter((u) => !idSet.has(u.id));
  }

  /**
   * 複数メンバーを追加
   */
  addMembers(
    userIds: string[],
    usersList: SelectUsersList[],
    selectedUsers: SelectUsersList[],
  ): SelectUsersList[] {
    const idSet = new Set(selectedUsers.map((u) => u.id));
    const toAdd = userIds
      .filter((id) => !idSet.has(id))
      .map((id) => usersList.find((u) => u.id === id))
      .filter((u) => u !== undefined) as SelectUsersList[];

    return [...selectedUsers, ...toAdd];
  }
}
