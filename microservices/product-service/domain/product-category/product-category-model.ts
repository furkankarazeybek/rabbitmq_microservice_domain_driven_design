import { ObjectId } from 'mongodb';

export interface IProductCategory {
  _id: ObjectId;
  categoryName: string;
}

