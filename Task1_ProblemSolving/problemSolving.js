function stairClimbing(n) {
   
    if (n === 1) return 1;
    if (n === 2) return 2;

    let prev2 = 1;
    let prev1 = 2;
    let current = 0;

    for (let i = 3; i <= n; i++) {
        current = prev1 + prev2;
        prev2 = prev1;
        prev1 = current;
    }
    // console.log({current});
    return current;
}


console.log(stairClimbing(1));
console.log(stairClimbing(2));
console.log(stairClimbing(4));
console.log(stairClimbing(5));
console.log(stairClimbing(10));
console.log(stairClimbing(15));
console.log(stairClimbing(20));
console.log(stairClimbing(50)); 
