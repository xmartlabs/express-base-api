class RandomNumberGenerator {
  constructor() {
    this.p = 999983;
    this.g = 48902;
  }

  next(prev) {
    let rand = prev;
    do {
      rand = (rand * this.g) % this.p;
    } while (!this.strengthFilter(rand));
    return rand;
  }

  strengthFilter(code) {
    // Avoid having codes with more then 3 equal digits
    const repetitions = `${code}`.split('').reduce((acu, curr) => { acu[curr] = acu[curr] ? acu[curr] + 1 : 1; return acu; }, {});
    return Object.keys(repetitions).map(k => repetitions[k]).filter(n => n > 3).length === 0;
  }
}

module.exports = RandomNumberGenerator;
