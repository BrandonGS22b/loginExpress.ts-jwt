import { compareSync, genSaltSync, hashSync } from 'bcryptjs';

export const bcryptAdapter = {

  hash: (password: string) => {
    const saltRounds = 7; // Número de rondas más bajo para hacer el proceso más rápido
    const salt = genSaltSync(saltRounds); // Pasar el número de rondas aquí
    return hashSync(password, salt);
  },

  compare: (password: string, hashed: string) => {
    return compareSync(password, hashed);
  }

};
