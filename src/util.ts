export const random = (len:number) => {
    const option = "qwertyuiopasdfghjklzxcvbnm1234567890";
    const length = option.length-1 ;

    let value = "";
    for(let i = 0 ; i < len ; i++){
        value += option[Math.floor(Math.random()*length)]
    }
    return value ;
}