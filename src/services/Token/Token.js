import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../../config/secrets";

export default class Token {
  /**
   * Generates a token for a given user session
   * @param {string} userId
   * @returns {string}
   */
  static generateToken(userId) {
    return jwt.sign({userId}, JWT_SECRET, {expiresIn: '7d'});
  }

  /**
   * Verifies the integrity of the token received
   * @param {string} token
   * @returns {boolean}
   */
  static verify(token) {
    try {
      jwt.verify(token, JWT_SECRET);
    } catch (e) {
      throw new Error('Invalid token');
    }
  }
}
