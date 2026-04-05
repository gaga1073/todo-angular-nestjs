export const IProjectGroupAccessPortToken = Symbol('IProjectGroupAccessPort');

export interface IProjectGroupAccessPort {
  /**
   * 指定ユーザーが指定グループに所属しているか確認する
   */
  isMember(userId: string, groupId: string): Promise<boolean>;
}
