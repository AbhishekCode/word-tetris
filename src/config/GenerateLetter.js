

const allletters = "eariotnslcudpmhgbfywkvxzjq";



export const lettersAdjustedPerWeight = () => {
   let weightedArray = [];
   Array.prototype.map.call(allletters, (_letter, index) => {
       for (var i = 0; i < allletters.length - index; i++) weightedArray.push(_letter);
   });
     
   return shuffle(weightedArray);
}


const shuffle = (a) => {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}