/**
 * A mongoose schema plugin which applies the following in the toJSON transform call:
 *  - removes __v, createdAt, updatedAt, and any path that has private: true
 *  - replaces _id with id
 */

import { Schema } from "mongoose";

const deleteAtPath = (
  obj: Record<string, unknown>,
  path: string[],
  index: number
) => {
  if (index === path.length - 1) {
    delete obj[path[index]];
    return;
  }
  // Runtime error is possible
  deleteAtPath(obj[path[index]] as Record<string, unknown>, path, index + 1);
};

const toJSON = (
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  schema: Schema & { options: Record<string, any>; paths: any }
) => {
  let transform = (_, __, ___) => undefined;
  if (schema.options.toJSON && schema.options.toJSON.transform) {
    transform = schema.options.toJSON.transform;
  }

  schema.options.toJSON = Object.assign(
    schema.options.toJSON || { minimize: false },
    {
      transform(doc, ret, options) {
        Object.keys(schema.paths).forEach(path => {
          if (
            schema.paths[path].options &&
            schema.paths[path].options.private
          ) {
            deleteAtPath(ret, path.split(`.`), 0);
          }
        });

        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
        delete ret.createdAt;
        delete ret.updatedAt;
        return transform(doc, ret, options);
      },
    }
  );
};

export default toJSON;
