const objet1 = { a: 1, b: 2 };
const objet2 = objet1;
const objet3 = { ...objet1 };
objet1.a = 5;
console.log(objet2);
console.log(objet3);
