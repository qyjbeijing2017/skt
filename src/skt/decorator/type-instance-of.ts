export const isParent = (type:any,parentType:any)=>{
    let _type = type;
    while(_type){
        if(_type === parentType){
            return true;
        }
        _type = _type.__proto__;
    }
    return false;
}