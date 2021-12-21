import bcrypt from 'bcrypt';

export default class Password {
  /**
   * Returns a hashed version of the password received
   * @param {string} password
   * @returns {string}
   */
  static hashPassword(password) {
    const salt = bcrypt.genSaltSync();
    return bcrypt.hashSync(password, salt);
  }

  /**
   * Checks whether the password received is valid or not
   * @param {string} password
   * @param {string} hashedPassword
   * @returns {boolean}
   */
  static compare(password, hashedPassword) {
    return bcrypt.compareSync(password, hashedPassword);
  }
}
