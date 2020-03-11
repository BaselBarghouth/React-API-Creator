import joi from "@hapi/joi";

const validation = (tableName, data) => {
  const dataBase = {
    users: {
      name: joi
        .string()
        .min(4)
        .required(),
      email: joi
        .string()
        .min(6)
        .email()
        .required(),
      lastmane: joi
        .string()
        .min(4)
        .required(),
      location: joi
        .string()
        .min(6)
        .required(),
      phone: joi
        .string()
        .min(8)
        .required(),
      role: joi
        .string()
        .min(4)
        .required()
    },
    drivers: {
      name: joi
        .string()
        .min(4)
        .required(),
      lastmane: joi
        .string()
        .min(4)
        .required(),
      phone: joi
        .string()
        .min(8)
        .required()
    },
    pickup: {
      user_id: joi
        .string()
        .min(1)
        .required(),
      status_pickup: joi
        .string()
        .min(1)
        .required(),
      date_pickup: joi
        .string()
        .min(1)
        .required()
    },
    payment: {
      pickup_id: joi
        .string()
        .min(1)
        .required(),
      status_payment: joi
        .string()
        .min(1)
        .required(),
      date_payment: joi
        .string()
        .min(1)
        .required(),
      price: joi
        .string()
        .min(1)
        .required()
    },
    driverpickup: {
      pickup_id: joi
        .string()
        .min(1)
        .required(),
      driver_id: joi
        .string()
        .min(1)
        .required()
    },
    driverpayment: {
      payment_id: joi
        .string()
        .min(1)
        .required(),
      driver_id: joi
        .string()
        .min(1)
        .required()
    },
    login: {
      email: joi
        .string()
        .min(6)
        .email()
        .required(),
      password: joi
        .string()
        .min(8)
        .required()
    }
  };
  const schema = joi.object(dataBase[tableName]);
  return schema.validate(data);
};

export default validation;
