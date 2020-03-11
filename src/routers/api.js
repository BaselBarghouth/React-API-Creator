import express from "express";
import DB from "../database/database";
import validation from "../validation/validation";
import jwt from "jsonwebtoken";
import auth from "../auth/auth";
import sqlite from "sqlite";
import { dataBaseName } from "../database/config";
const router = express.Router();
/**
 * Route that returns a list of data
 * @module /table
 * @method get
 * @param {express.request} req - request
 * @param {express.response} res - response
 * @param {express.next} next -next
 * @returns {JSON} two keys with two values first one if the process is successed or not the second one is the data you wanna get
 */
let conection;
const checkConection = async () => {
  if (conection === undefined)
    conection = await sqlite.open(`./src/${dataBaseName}.sqlite`);
};
checkConection();
router.get("/", async (req, res, next) => {
  console.log("=====", req.originalUrl.split("/"));
  let table = req.originalUrl.split("/")[1];
  const db = new DB(table, conection);
  if (req.originalUrl.split("/").length > 2) {
    let firstTableName = req.originalUrl.split("/")[2];
    let secondTableName = req.originalUrl.split("/")[3];
    try {
      const data = await db.innerTowTables(firstTableName, secondTableName);
      if (data.success) return res.status(200).json(data);
      return res.status(400).json(data);
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err
      });
    }
  }

  try {
    const data = await db.getData();
    if (data.success) return res.status(200).json(data);
    return res.status(400).json(data);
  } catch (err) {
    console.log(err);
    res.status(400).json({
      success: false,
      error: err
    });
  }
});
/**
 * Route that return any row from your database depends on its id
 * @module /table/:id
 * @method get
 * @param {express.request} req - request
 * @param {express.response} res - response
 * @param {express.next} next -next
 * @returns {JSON} two keys with two values first one if the process is successed or not the second one is the data you wanna get
 */
router.get("/:id", async (req, res, next) => {
  let table = req.originalUrl.split("/")[1];
  let id = req.params.id;

  const db = new DB(table, conection);
  try {
    const data = await db.findDataById(id);
    if (data.success) return res.status(200).json(data);
    return res.status(400).json(data);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err
    });
  }
});
/**
 * Route that delete a row from your database depends on its id
 * @module /table/:id
 * @method delete
 * @param {express.request} req - request
 * @param {express.response} res - response
 * @param {express.next} next -next
 * @returns {JSON} two keys with two values first one if the process is successed or not the second one is the id you you have deleted
 */
router.delete(
  "/:id",
  //  auth,
  async (req, res, next) => {
    let table = req.originalUrl.split("/")[1];
    const db = new DB(table, conection);
    let id = req.params.id;
    try {
      const data = await db.deleteData(id);
      if (data.success) return res.status(200).json(data);
      return res.status(400).json(data);
    } catch (err) {
      console.log(err);
      res.status(400).json({
        success: false,
        error: err
      });
    }
  }
);
/**
 * Route you can post data in your database
 * @module /table
 * @method post
 * @param {express.request} req - request
 * @param {express.response} res - response
 * @param {express.next} next -next
 * @returns {JSON} two keys with two values first one if the process is successed or not the second one is the id you you have deleted
 */
router.post(
  "/",
  async (req, res, next) => {
    let table = req.originalUrl.split("/")[1];
    /**
     * @function isLoginPost
     * @returns {Boolean} if you are using this req to login or to add data in your database
     */
    const isLoginPost = () => {
      if (table === "login") return true;
      return false;
    };
    if (isLoginPost()) {
      const db = new DB(table, conection);
      console.log("oop");
      // const { error } = validation(table, req.body);
      // if (error)
      //   return res.status(400).json({
      //     success: false,
      //     data: error.details[0].message
      //   });
      try {
        const resualt = await db.login(req.body);
        if (resualt.success) {
          const token = jwt.sign({ user: resualt }, "basel");
          return res
            .header("auth-token", token)
            .status(200)
            .json({
              success: true,
              user: resualt,
              token: token
            });
        }
      } catch (err) {
        return res.json({
          success: false,
          error: err
        });
      }
    } else {
      next();
    }
  },
  // auth,
  async (req, res, next) => {
    let table = req.originalUrl.split("/")[1];
    const db = new DB(table, conection);
    // const { error } = validation(table, req.body);
    // if (error)
    //   return res.status(400).json({
    //     success: false,
    //     error: error.details[0].message
    //   });
    try {
      const data = await db.addData(req.body);

      if (data.success) return res.status(200).json(data);
      return res.status(400).json(data);
    } catch (err) {
      res.status(400).json({
        success: false,
        error: err
      });
    }
  }
);
/**
 * Route you can post data in your database
 * @module /table/:id
 * @method put
 * @param {express.request} req - request
 * @param {express.response} res - response
 * @param {express.next} next -next
 * @returns {JSON} two keys with two values first one if the process is successed or not the second one is the id you you have deleted
 */
router.put("/:id", async (req, res, next) => {
  let table = req.originalUrl.split("/")[1];
  // const { error } = validation(table, req.body);
  // if (error)
  //   return res.status(400).json({
  //     success: false,
  //     error: error.details[0].message
  //   });
  let id = req.params.id;
  const db = new DB(table, conection);
  try {
    const data = await db.updateData(id, req.body);
    if (data.success) return res.status(200).json(data);
    return res.status(400).json(data);
  } catch (err) {
    res.status(400).json({
      success: false,
      error: err
    });
  }
});
export default router;
