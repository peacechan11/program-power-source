
export type Member = {
  id: string;
  name: string;
  email: string;
};

export type Activity = {
  id: string;
  title: string;
  isCompleted: boolean;
  createdAt: string;
  createdBy: string;
};

export type TaskCard = {
  id: string;
  title: string;
  description?: string;
  activities: Activity[];
  attachments: Attachment[];
  createdAt: string;
  listId: string;
  comments: Comment[];
};

export type Comment = {
  id: string;
  text: string;
  authorId: string;
  authorName: string;
  createdAt: string;
};

export type Attachment = {
  id: string;
  name: string;
  url: string;
  type: string;
};

export type TaskList = {
  id: string;
  name: string;
  order: number;
  isDefault?: boolean;
};

export type Board = {
  id: string;
  name: string;
  members: Member[];
  lists: TaskList[];
  cards: TaskCard[];
};

export type CurrentUser = {
  id: string;
  name: string;
  email: string;
};

export type NotificationType = "cardCreation" | "activityComplete" | "cardMoved";

export enum ListType {
  TODO = "todo",
  DOING = "doing",
  DONE = "done",
}

export type DragItem = {
  type: "CARD";
  id: string;
  listId: string;
  index: number;
};
