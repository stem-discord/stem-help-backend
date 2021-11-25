import hellgate from "hellgate";

const { Hellgate, Ring, IHotel } = hellgate;

import { mongo } from "../../shared";

class MongoHotel extends IHotel {
  async user(userId) {
    let user;
    if (typeof userId === `string`) {
      user = await mongo.User.findById(userId);
    } else {
      user = userId;
    }
    return super.user(user, user.ranks ?? [], user.groups ?? []);
  }
}

const application = new Hellgate(new MongoHotel());

const data = new Ring(application, {
  create: false,
  read: true,
  update: false,
  delete: false,
}, {
  create: [`data:manager`],
});

const rings = {
  data,
};

export { application, rings };
