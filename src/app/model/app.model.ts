export interface BaseMongoFields {
  _id: string;
  createdAt: Date;
  updatedAt: Date;
  __v?: number;
}

export interface User extends BaseMongoFields {
  username: string;
  email: string;
  password: string;
}
