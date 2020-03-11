import SQL from "sql-template-strings";
import { tables as TABLE } from "./config";
/**
 * @type {object}- holds key values where the key is the table name and value is the primary key for this table
 * @property {strings} users - name of users table
 * @property {strings} drivers - name of drivers table
 * @property {strings} driverpickup - name of driverpickup table
 * @property {strings} payment - name of payment table
 *  @property {strings} pickup - name of pickup table
 */

/**
 * This class
 * @module DataBase
 *
 */

class DataBase {
  /**
   * @function constructor
   * @param {String} tableName
   */
  constructor(tableName, db) {
    this.tableName = tableName;
    this.db = db;
  }
  /**
   * This is a function that gets all data from your database deppends on the table name
   * @function getData
   * @returns {Array} -all data from the table
   */
  async getData() {
    const data = await this.db.all(`SELECT * FROM ${this.tableName}`);
    return { success: true, data: data };
  }
  /**
   * This function add data in your database
   * @function addData
   * @param {Object} props -holds key, values where the key is the column name and value is the value you wanna add in a specific table
   * @returns {Object} -holds another object which has sql statment you use and last id in your table  and how many changes happened in your table
   */
  async addData(props) {
    const columns = Object.keys(props);
    const rows = Object.values(props);
    let columnNames = "";
    let values = "";
    for (const column in columns) {
      columnNames = columnNames + columns[column] + "," + " ";
      values = values + `"${rows[column]}"` + "," + " ";
    }
    columnNames = columnNames.substring(0, columnNames.length - 2).trim();
    values = values.substring(0, values.length - 2).trim();
    let stmt = `INSERT INTO ${this.tableName} (${columnNames}) values (${values});`;

    try {
      const newData = await this.db.run(stmt);

      return { success: true, data: newData };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  /**
   * This function add data in your database
   * @function deleteData
   * @param {Number} id -id for the row you wanna delete
   */
  async deleteData(id) {
    let stmt = `DELETE from ${this.tableName} where ${
      TABLE[this.tableName]
    } = ${id}`;

    try {
      const result = await this.db.run(stmt);
      console.log("====", result);
      if (result.length === 0)
        return { success: false, data: `Sorry this id: ${id} dose not exist` };
      return { success: true, data: result };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  /**
   * This function add data in your database
   * @function updateData
   * @param {Number} id -holds the id for the row you wanna update
   * @param {Object} props -holds key, values where the key is the column name and value is the value you wanna update in a specific table
   * @returns {Object} -holds another object which has sql statment you use and last id in your table  and how many changes happened in your table
   */
  async updateData(id, props) {
    const columns = Object.keys(props);
    const rows = Object.values(props);
    let values = "";
    for (let column in columns) {
      values = values + columns[column] + "=" + `"${rows[column]}"` + " " + ",";
    }
    values = values.substring(0, values.length - 2).trim();
    const stmt = `UPDATE ${this.tableName} set ${values} where ${
      TABLE[this.tableName]
    } = ${id}`;

    try {
      const result = await this.db.run(stmt);
      console.log();
      if (result["stmt"].changes === 0)
        return { success: false, data: `Sorry this id: ${id} dose not exist` };

      return { success: true, data: result };
    } catch (err) {
      console.log(err);
      return { success: false, error: err };
    }
  }
  /**
   * This function add data in your database
   * @function findDataById
   * @param {Number} id -id for the row you wanna find in a spicific table
   */
  async findDataById(id) {
    const stmt = `select * from ${this.tableName} where ${
      TABLE[this.tableName]
    } = ${id} `;

    try {
      const rows = await this.db.all(stmt);
      if (rows.length === 0)
        return { success: false, data: `Sorry this id: ${id} dose not exist` };
      return { success: true, data: rows };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  /**
   * This function add data in your database
   * @function login
   * @param {Object} props -holds keys, values where the keys are the columns name and value is the value you wanna check in a specific table
   */
  async login(props) {
    const { email, password } = props;
    console.log(props);
    try {
      const stmt = SQL`SELECT * FROM users WHERE email = ${email} AND password = ${password}`;
      const rows = await this.db.all(stmt);
      console.log(rows[0]);
      const user = rows[0];
      if (!user) {
        return { success: false, error: "Email or password are incorrect!" };
      } else return { success: true, data: rows[0] };
    } catch (err) {
      return { success: false, error: err };
    }
  }
  async innerTowTables(firstTable, secondTable) {
    const stmt = `SELECT * FROM ${firstTable}
    INNER JOIN ${secondTable} where ${secondTable}.${TABLE[secondTable]} = ${firstTable}.${TABLE[firstTable]} ;`;
    console.log(stmt);
    try {
      const rows = await this.db.all(stmt);
      return rows;
    } catch (err) {
      return err;
    }
  }
}

export default DataBase;
